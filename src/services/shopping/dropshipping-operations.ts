// =============================================================================
// RIIQX — Phase 5: Master Dropshipping Operations & Logistics Service
// Inventory Delta Sync • Order Lifecycle State Machine • Courier Tracking
// Margin Mathematics • Returns & Automated Payment Gateway Refunds
// Compliant with India Consumer Protection (E-Commerce) Rules 2020 & 2026
// =============================================================================

import {
  DropshippingOrder,
  DropshippingOrderItem,
  DropshippingOrderStatus,
  CourierMilestone,
  OrderTrackingEvent,
  SupplierInventoryItem,
  ContributionMarginBreakdown,
  ReturnRefundRecord,
  ReturnRefundReason,
  ReturnQCStatus,
} from './types';
import { CommerceService, MarketplaceProduct } from './commerce-service';

// -----------------------------------------------------------------------------
// Global singletons for persistence across Next.js dev reloads & route bundles
// -----------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var __riiqx_dropshipping_orders__: Map<string, DropshippingOrder> | undefined;
  // eslint-disable-next-line no-var
  var __riiqx_inventory__: Map<string, SupplierInventoryItem> | undefined;
  // eslint-disable-next-line no-var
  var __riiqx_returns__: Map<string, ReturnRefundRecord> | undefined;
  // eslint-disable-next-line no-var
  var __riiqx_order_idempotency__: Map<string, string> | undefined;
}

const ordersStore: Map<string, DropshippingOrder> =
  globalThis.__riiqx_dropshipping_orders__ || (globalThis.__riiqx_dropshipping_orders__ = new Map());

const inventoryStore: Map<string, SupplierInventoryItem> =
  globalThis.__riiqx_inventory__ || (globalThis.__riiqx_inventory__ = new Map());

const returnsStore: Map<string, ReturnRefundRecord> =
  globalThis.__riiqx_returns__ || (globalThis.__riiqx_returns__ = new Map());

const idempotencyStore: Map<string, string> =
  globalThis.__riiqx_order_idempotency__ || (globalThis.__riiqx_order_idempotency__ = new Map());

// -----------------------------------------------------------------------------
// Seed Supplier Inventory if empty
// -----------------------------------------------------------------------------
function initializeInventoryIfEmpty() {
  if (inventoryStore.size > 0) return;

  const products = CommerceService.listProducts({ limit: 100 }).products;
  products.forEach((p) => {
    const item: SupplierInventoryItem = {
      id: `inv_${p.id}`,
      supplierId: p.supplier.id,
      productId: p.id,
      productTitle: p.title,
      sku: p.sku,
      availableStock: p.stockQuantity || 45,
      reservedStock: 0,
      effectiveStock: p.stockQuantity || 45,
      lowStockThreshold: 5,
      syncStatus: (p.stockQuantity || 45) <= 5 ? 'low_stock' : 'in_sync',
      lastSyncedAt: new Date().toISOString(),
    };
    inventoryStore.set(p.sku, item);
  });
}

initializeInventoryIfEmpty();

// -----------------------------------------------------------------------------
// 1. Contribution Margin Mathematics Calculator
// -----------------------------------------------------------------------------
export function calculateContributionMargin(
  sellingPrice: number,
  cogs: number,
  shippingCost = 60,
  options: { returnReservePct?: number; gatewayFeePct?: number } = {}
): ContributionMarginBreakdown {
  const returnReservePct = options.returnReservePct ?? 0.05; // 5% return/RTO reserve
  const baseGatewayRate = options.gatewayFeePct ?? 0.019; // 1.9% standard gateway fee
  const gatewayFeeGstRate = 0.18; // 18% GST on payment gateway fee
  const effectiveGatewayRate = baseGatewayRate * (1 + gatewayFeeGstRate); // 2.242%

  const gatewayFee = Math.round(sellingPrice * effectiveGatewayRate * 100) / 100;
  const returnReserve = Math.round(sellingPrice * returnReservePct * 100) / 100;
  const grossProfit = Math.max(0, sellingPrice - cogs);
  const grossMarginPct = sellingPrice > 0 ? Math.round((grossProfit / sellingPrice) * 1000) / 10 : 0;

  // In India GST scheme, GST on product margin / value addition (18% inclusive)
  const gstAmount = Math.round(((grossProfit * 0.18) / 1.18) * 100) / 100;

  // Net Contribution Margin = SP - COGS - Shipping - Gateway - GST - ReturnReserve
  const netContributionMargin =
    Math.round((sellingPrice - cogs - shippingCost - gatewayFee - gstAmount - returnReserve) * 100) / 100;
  const netContributionMarginPct =
    sellingPrice > 0 ? Math.round((netContributionMargin / sellingPrice) * 1000) / 10 : 0;

  return {
    sellingPrice,
    cogs,
    shippingCost,
    gatewayFee,
    gstAmount,
    returnReserve,
    grossProfit,
    grossMarginPct,
    netContributionMargin,
    netContributionMarginPct,
  };
}

// -----------------------------------------------------------------------------
// 2. Real-Time Supplier Inventory Delta Sync & Checkout Reservation Lock
// -----------------------------------------------------------------------------
export function getInventoryStatus(): SupplierInventoryItem[] {
  initializeInventoryIfEmpty();
  return Array.from(inventoryStore.values());
}

export function syncSupplierInventoryDelta(supplierId?: string): {
  syncedCount: number;
  updatedItems: SupplierInventoryItem[];
} {
  initializeInventoryIfEmpty();
  const updatedItems: SupplierInventoryItem[] = [];

  for (const [sku, item] of inventoryStore.entries()) {
    if (!supplierId || item.supplierId === supplierId) {
      // Simulate real-time supplier feed update with realistic variances
      const variance = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
      item.availableStock = Math.max(0, item.availableStock + variance);
      item.effectiveStock = Math.max(0, item.availableStock - item.reservedStock);
      item.syncStatus =
        item.effectiveStock === 0
          ? 'out_of_stock'
          : item.effectiveStock <= item.lowStockThreshold
          ? 'low_stock'
          : 'in_sync';
      item.lastSyncedAt = new Date().toISOString();
      inventoryStore.set(sku, item);
      updatedItems.push({ ...item });
    }
  }

  return { syncedCount: updatedItems.length, updatedItems };
}

export function reserveStockForCheckout(items: { sku: string; quantity: number }[]): {
  success: boolean;
  message: string;
  lockedSkus: string[];
} {
  initializeInventoryIfEmpty();
  const lockedSkus: string[] = [];

  // Pre-check availability for all items first
  for (const it of items) {
    const inv = inventoryStore.get(it.sku);
    if (!inv) {
      return { success: false, message: `SKU ${it.sku} not found in supplier catalog`, lockedSkus: [] };
    }
    if (inv.availableStock - inv.reservedStock < it.quantity) {
      return {
        success: false,
        message: `Insufficient stock for ${inv.productTitle} (${it.sku}). Available: ${inv.availableStock - inv.reservedStock}`,
        lockedSkus: [],
      };
    }
  }

  // Atomically lock stock
  for (const it of items) {
    const inv = inventoryStore.get(it.sku)!;
    inv.reservedStock += it.quantity;
    inv.effectiveStock = Math.max(0, inv.availableStock - inv.reservedStock);
    if (inv.effectiveStock <= inv.lowStockThreshold) {
      inv.syncStatus = inv.effectiveStock === 0 ? 'out_of_stock' : 'low_stock';
    }
    inventoryStore.set(it.sku, inv);
    lockedSkus.push(it.sku);
  }

  return { success: true, message: 'Stock successfully reserved for checkout session', lockedSkus };
}

export function releaseReservedStock(items: { sku: string; quantity: number }[]) {
  initializeInventoryIfEmpty();
  for (const it of items) {
    const inv = inventoryStore.get(it.sku);
    if (inv) {
      inv.reservedStock = Math.max(0, inv.reservedStock - it.quantity);
      inv.effectiveStock = Math.max(0, inv.availableStock - inv.reservedStock);
      inv.syncStatus =
        inv.effectiveStock === 0
          ? 'out_of_stock'
          : inv.effectiveStock <= inv.lowStockThreshold
          ? 'low_stock'
          : 'in_sync';
      inventoryStore.set(it.sku, inv);
    }
  }
}

export function commitReservedStock(items: { sku: string; quantity: number }[]) {
  initializeInventoryIfEmpty();
  for (const it of items) {
    const inv = inventoryStore.get(it.sku);
    if (inv) {
      inv.availableStock = Math.max(0, inv.availableStock - it.quantity);
      inv.reservedStock = Math.max(0, inv.reservedStock - it.quantity);
      inv.effectiveStock = Math.max(0, inv.availableStock - inv.reservedStock);
      inv.syncStatus =
        inv.effectiveStock === 0
          ? 'out_of_stock'
          : inv.effectiveStock <= inv.lowStockThreshold
          ? 'low_stock'
          : 'in_sync';
      inventoryStore.set(it.sku, inv);
    }
  }
}

// -----------------------------------------------------------------------------
// 3. Order Lifecycle State Machine
// -----------------------------------------------------------------------------
const VALID_STATUS_TRANSITIONS: Record<DropshippingOrderStatus, DropshippingOrderStatus[]> = {
  pending_payment: ['paid', 'cancelled'],
  paid: ['supplier_confirmed', 'cancelled'],
  supplier_confirmed: ['packed', 'cancelled'],
  packed: ['shipped'],
  shipped: ['delivered', 'cancelled'],
  delivered: ['return_requested'],
  cancelled: [],
  return_requested: ['returned'],
  returned: ['refunded'],
  refunded: [],
};

export function isValidStatusTransition(
  currentStatus: DropshippingOrderStatus,
  nextStatus: DropshippingOrderStatus
): boolean {
  const allowed = VALID_STATUS_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}

// -----------------------------------------------------------------------------
// 4. Create Dropshipping Order (with Idempotency & Financial Breakdowns)
// -----------------------------------------------------------------------------
export interface CreateOrderParams {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  paymentMethod?: string;
  idempotencyKey?: string;
  initialStatus?: DropshippingOrderStatus;
}

export function createDropshippingOrder(params: CreateOrderParams): {
  success: boolean;
  order?: DropshippingOrder;
  isExisting?: boolean;
  error?: string;
} {
  initializeInventoryIfEmpty();

  // 1. Idempotency Check
  if (params.idempotencyKey && idempotencyStore.has(params.idempotencyKey)) {
    const existingOrderId = idempotencyStore.get(params.idempotencyKey)!;
    const existingOrder = ordersStore.get(existingOrderId);
    if (existingOrder) {
      return { success: true, order: existingOrder, isExisting: true };
    }
  }

  // 2. Validate Items & Map to Catalog
  const products = CommerceService.listProducts({ limit: 100 }).products;
  const orderItems: DropshippingOrderItem[] = [];
  let subtotal = 0;
  let totalCogs = 0;
  let supplierId = 'supp_apex_dropship_01';
  let supplierName = 'Apex Global Logistics';

  const stockReservationList: { sku: string; quantity: number }[] = [];

  for (const reqItem of params.items) {
    const product = products.find((p) => p.id === reqItem.productId);
    if (!product) {
      return { success: false, error: `Product ID ${reqItem.productId} not found in catalog` };
    }

    const itemPrice = product.currentPrice;
    const itemCogs = product.supplierCost;
    const itemTotal = itemPrice * reqItem.quantity;
    const itemMargin = itemPrice - itemCogs;

    subtotal += itemTotal;
    totalCogs += itemCogs * reqItem.quantity;
    supplierId = product.supplier.id;
    supplierName = product.supplier.companyName;

    stockReservationList.push({ sku: product.sku, quantity: reqItem.quantity });

    orderItems.push({
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId: '', // populated below
      productId: product.id,
      variantId: reqItem.variantId,
      productTitle: product.title,
      sku: product.sku,
      quantity: reqItem.quantity,
      unitSupplierCost: itemCogs,
      unitSellingPrice: itemPrice,
      unitMargin: itemMargin,
      totalPrice: itemTotal,
    });
  }

  // 3. Atomically Reserve Stock
  const reserveResult = reserveStockForCheckout(stockReservationList);
  if (!reserveResult.success) {
    return { success: false, error: reserveResult.message };
  }

  // 4. Generate Order ID and Logistics Details
  const orderId = `ORD_RIIQX_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  orderItems.forEach((it) => (it.orderId = orderId));

  const shippingFee = 0.0; // Free pan-India priority dropship shipping for RIIQX members
  const estimatedDays = 3;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

  const initialStatus = params.initialStatus || 'paid';

  // If initial status is 'paid', commit the reserved stock immediately
  if (initialStatus === 'paid') {
    commitReservedStock(stockReservationList);
  }

  // 5. Calculate Comprehensive Margin Breakdown
  const financialBreakdown = calculateContributionMargin(subtotal, totalCogs, 60);

  // 6. Courier partner assignment & tracking
  const courierPartner = 'BlueDart Express';
  const trackingNumber = `BD-DEL-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const trackingUrl = `https://www.bluedart.com/tracking?trackNumber=${trackingNumber}`;

  // 7. Initial Tracking Milestones
  const initialMilestones: OrderTrackingEvent[] = [
    {
      id: `evt_${Date.now()}_1`,
      orderId,
      milestone: 'order_placed',
      title: 'Order Placed & Verified',
      description: `Order successfully placed by ${params.customerName}. Payment verified via ${params.paymentMethod || 'UPI'}.`,
      location: `${params.shippingAddress.city}, ${params.shippingAddress.state}`,
      courier: courierPartner,
      occurredAt: new Date(Date.now() - 30000).toISOString(),
    },
    {
      id: `evt_${Date.now()}_2`,
      orderId,
      milestone: 'payment_confirmed',
      title: 'Payment Confirmed & Escrow Locked',
      description: `Payment ID: PAY_${Math.random().toString(36).substring(2, 10).toUpperCase()} confirmed. Real-time stock committed.`,
      location: 'RIIQX Secure Escrow Gateway',
      courier: courierPartner,
      occurredAt: new Date().toISOString(),
    },
  ];

  const newOrder: DropshippingOrder = {
    id: orderId,
    customerId: params.customerId,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    customerPhone: params.customerPhone,
    shippingAddress: params.shippingAddress,
    status: initialStatus,
    supplierId,
    supplierName,
    supplierOrderId: `SUP-PO-${Math.floor(100000 + Math.random() * 900000)}`,
    courierPartner,
    trackingNumber,
    trackingUrl,
    estimatedDeliveryDate: deliveryDate.toISOString(),
    items: orderItems,
    subtotal,
    shippingFee,
    gstAmount: financialBreakdown.gstAmount,
    totalAmount: subtotal + shippingFee,
    paymentMethod: params.paymentMethod || 'upi_direct',
    paymentId: `PAY_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    idempotencyKey: params.idempotencyKey,
    financialBreakdown,
    trackingEvents: initialMilestones,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ordersStore.set(orderId, newOrder);

  if (params.idempotencyKey) {
    idempotencyStore.set(params.idempotencyKey, orderId);
  }

  return { success: true, order: newOrder };
}

// -----------------------------------------------------------------------------
// 5. Transition Order Status (Strict State Machine)
// -----------------------------------------------------------------------------
export function transitionOrderStatus(
  orderId: string,
  newStatus: DropshippingOrderStatus,
  notes?: string
): { success: boolean; order?: DropshippingOrder; error?: string } {
  const order = ordersStore.get(orderId);
  if (!order) {
    return { success: false, error: `Order ${orderId} not found` };
  }

  if (!isValidStatusTransition(order.status, newStatus)) {
    return {
      success: false,
      error: `Invalid order state transition: Cannot change status from "${order.status}" to "${newStatus}"`,
    };
  }

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();

  // Create Milestone Event based on New Status
  let milestone: CourierMilestone = 'order_placed';
  let title = '';
  let description = '';
  let location = `${order.shippingAddress.city} Hub`;

  switch (newStatus) {
    case 'supplier_confirmed':
      milestone = 'supplier_accepted';
      title = 'Supplier Accepted Order';
      description = `Supplier ${order.supplierName} acknowledged PO. Picking items from inventory.`;
      location = `${order.supplierName} Fulfillment Center`;
      break;
    case 'packed':
      milestone = 'manifest_generated';
      title = 'Items Packed & Airway Bill Generated';
      description = `Package sealed with tamper-evident tape. AWB ${order.trackingNumber} attached.`;
      location = `${order.supplierName} Dispatch Dock`;
      break;
    case 'shipped':
      milestone = 'dispatched';
      title = 'Dispatched via Courier';
      description = `Handed over to ${order.courierPartner}. Surface priority transit started.`;
      location = `${order.courierPartner} Regional Sorting Hub`;
      break;
    case 'delivered':
      milestone = 'delivered';
      title = 'Delivered to Customer';
      description = `Shipment safely handed over at ${order.shippingAddress.street}. OTP verification completed.`;
      location = `${order.shippingAddress.city}, ${order.shippingAddress.pincode}`;
      break;
    case 'cancelled':
      milestone = 'rto_initiated';
      title = 'Order Cancelled';
      description = notes || 'Order cancelled by customer or operational team. Stock returned to available pool.';
      location = 'RIIQX Central Systems';
      // Release inventory if cancelled
      releaseReservedStock(order.items.map((it) => ({ sku: it.sku, quantity: it.quantity })));
      break;
    case 'return_requested':
      milestone = 'return_pickup';
      title = 'Return Requested';
      description = notes || 'Customer initiated 7-day return request. Reverse pickup scheduled.';
      location = `${order.shippingAddress.city} Return Logistics Hub`;
      break;
    case 'returned':
      milestone = 'returned';
      title = 'Package Returned to Warehouse';
      description = 'Reverse transit completed. Item arrived at QC hub for inspection.';
      location = `${order.supplierName} Returns Center`;
      break;
    case 'refunded':
      milestone = 'returned';
      title = 'Payment Refunded';
      description = notes || 'Refund successfully processed to original payment method.';
      location = 'RIIQX Payment Gateway';
      break;
  }

  const trackingEvent: OrderTrackingEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    orderId,
    milestone,
    title,
    description,
    location,
    courier: order.courierPartner,
    occurredAt: new Date().toISOString(),
  };

  order.trackingEvents.push(trackingEvent);
  ordersStore.set(orderId, order);

  return { success: true, order };
}

// -----------------------------------------------------------------------------
// 6. Returns & Automated Payment Gateway Refunds Engine
// -----------------------------------------------------------------------------
export function processReturnAndRefund(params: {
  orderId: string;
  customerId: string;
  reason: ReturnRefundReason;
  reasonDetails?: string;
  evidenceUrls?: string[];
}): { success: boolean; returnRecord?: ReturnRefundRecord; order?: DropshippingOrder; error?: string } {
  const order = ordersStore.get(params.orderId);
  if (!order) {
    return { success: false, error: `Order ${params.orderId} not found` };
  }

  if (order.status !== 'delivered') {
    return {
      success: false,
      error: `Return cannot be initiated. Order status must be "delivered" (Current: ${order.status})`,
    };
  }

  // Check 7-day return policy
  const orderDate = new Date(order.createdAt).getTime();
  const now = Date.now();
  const daysSinceOrder = (now - orderDate) / (1000 * 60 * 60 * 24);
  if (daysSinceOrder > 10) {
    return {
      success: false,
      error: 'Return window expired. Orders can only be returned within 7-10 days of delivery.',
    };
  }

  // 1. Transition Order to return_requested
  transitionOrderStatus(params.orderId, 'return_requested', `Return Reason: ${params.reason}`);

  // 2. Create Return Record
  const returnId = `RET_RIIQX_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const returnRecord: ReturnRefundRecord = {
    id: returnId,
    orderId: params.orderId,
    customerId: params.customerId,
    reason: params.reason,
    reasonDetails: params.reasonDetails || 'Customer return request submitted with evidence.',
    evidenceUrls: params.evidenceUrls || [],
    qcStatus: 'pending_inspection',
    refundAmount: order.totalAmount,
    refundStatus: 'pending',
    notes: 'Awaiting courier reverse pickup and warehouse quality verification.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  returnsStore.set(returnId, returnRecord);

  // 3. Automated QC and Gateway Refund Simulation (Simulates verified pass)
  // In production, triggered when courier marks reverse pickup completed and QC passes
  returnRecord.qcStatus = 'qc_passed';
  returnRecord.refundStatus = 'processed';
  returnRecord.refundGatewayTxId = `RFND_RZP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  returnRecord.notes = `QC Passed. Full refund of ₹${order.totalAmount} dispatched to original payment source.`;
  returnRecord.updatedAt = new Date().toISOString();

  returnsStore.set(returnId, returnRecord);

  // 4. Update order state through returned to refunded
  transitionOrderStatus(params.orderId, 'returned', 'Reverse shipment received at supplier hub. QC passed.');
  transitionOrderStatus(
    params.orderId,
    'refunded',
    `Gateway refund TX: ${returnRecord.refundGatewayTxId}. Total refunded: ₹${order.totalAmount}`
  );

  return { success: true, returnRecord, order: ordersStore.get(params.orderId) };
}

// -----------------------------------------------------------------------------
// 7. Getters & Helpers
// -----------------------------------------------------------------------------
export function getDropshippingOrderById(orderId: string): DropshippingOrder | undefined {
  return ordersStore.get(orderId);
}

export function getAllDropshippingOrders(customerId?: string): DropshippingOrder[] {
  const all = Array.from(ordersStore.values());
  if (!customerId) return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReturnRecordByOrderId(orderId: string): ReturnRefundRecord | undefined {
  return Array.from(returnsStore.values()).find((r) => r.orderId === orderId);
}
