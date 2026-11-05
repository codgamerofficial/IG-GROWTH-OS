// =============================================================================
// GlowFit AI / RIIQX — Smart Shopping & Dropshipping Intelligence Engine
// Cross-Platform Arbitrage • Screenshot OCR • Multi-Tier Gift Card Optimization
// =============================================================================

export type ShoppingPlatform =
  | 'amazon'
  | 'flipkart'
  | 'myntra'
  | 'ajio'
  | 'meesho'
  | 'tatacliq'
  | 'nykaa';

export interface ProductAnalysisRequest {
  url?: string;
  screenshotBase64?: string;
  screenshotMimeType?: string;
  productNameHint?: string;
}

export interface ExtractedProductInfo {
  title: string;
  brand: string;
  modelOrVariant?: string;
  category: 'electronics' | 'fashion' | 'beauty' | 'home' | 'fitness' | 'gadgets';
  detectedPlatform: ShoppingPlatform | 'unknown';
  detectedPrice: number;
  originalMrp: number;
  detectedDiscountPct: number;
  currency: 'INR' | 'USD';
  imageUrl?: string;
  confidenceScore: number;
  extractedFeatures: string[];
}

export interface PlatformPriceDetail {
  platform: ShoppingPlatform;
  displayName: string;
  platformIconUrl?: string;
  productUrl: string;
  listedPrice: number;
  mrp: number;
  discountPct: number;
  inStock: boolean;
  deliveryDays: number;
  deliveryCost: number;
  sellerName: string;
  sellerRating: number;
  applicableCoupons: {
    code: string;
    discountAmount: number;
    description: string;
  }[];
  bankOffers: {
    bank: string;
    discountAmount: number;
    description: string;
  }[];
  giftCardRate: {
    available: boolean;
    discountRatePct: number;
    cashbackRatePct: number;
    provider: string;
  };
  totalDirectSavings: number;
  finalEffectivePrice: number;
  isCheapest: boolean;
}

export interface ArbitrageOptimizationPlan {
  productId: string;
  productTitle: string;
  originalPrice: number;
  recommendedPlatform: ShoppingPlatform;
  recommendedPlatformName: string;
  baseListedPrice: number;
  appliedCoupon?: {
    code: string;
    savings: number;
  };
  appliedBankOffer?: {
    bank: string;
    savings: number;
  };
  giftCardArbitrage: {
    recommendedGiftCardBrand: string;
    giftCardAmountRequired: number;
    giftCardDiscountPct: number;
    giftCardImmediateSavings: number;
    cashbackEarned: number;
    netGiftCardCost: number;
    autoCreditSupported: boolean;
  };
  totalMoneySaved: number;
  finalLowestEffectivePrice: number;
  overallSavingsPct: number;
  waterfall?: DeterministicSavingsWaterfall;
  stepByStepActionPlan: string[];
}

export interface GiftCardPurchaseRequest {
  userId?: string;
  platform: ShoppingPlatform;
  brandKey?: string;
  faceValue: number;
  paymentMethod: 'upi' | 'card' | 'wallet' | 'netbanking';
  autoCreditToShoppingWallet: boolean;
  idempotencyKey?: string;
}

export interface GiftCardPurchaseResult {
  success: boolean;
  orderId: string;
  voucherCode: string;
  voucherPin: string;
  platform: ShoppingPlatform;
  brandKey?: string;
  faceValue: number;
  amountPaid: number;
  cashbackEarned: number;
  walletCredited: boolean;
  autoCreditStatus: 'credited_instantly' | 'pending_sync' | 'code_generated';
  redemptionInstructions: string;
  directWalletUrl: string;
  idempotencyKey?: string;
  timestamp: string;
}

export interface DeterministicSavingsWaterfall {
  baseListedPrice: number;
  platform: ShoppingPlatform;
  platformDisplayName: string;
  mrp: number;
  couponApplied?: {
    code: string;
    discountAmount: number;
    description: string;
    minSpendRequired: number;
  };
  priceAfterCoupon: number;
  bankOfferApplied?: {
    bankName: string;
    cardType: 'credit' | 'debit' | 'all';
    discountAmount: number;
    isInstant: boolean;
    maxDiscountCap: number;
  };
  priceAfterBankOffer: number;
  directPlatformSubtotal: number;
  giftCardSelected?: {
    brandKey: string;
    brandName: string;
    faceValue: number;
    discountPct: number;
    upfrontSavings: number;
    netGiftCardCost: number;
    cashbackPct: number;
    guaranteedCashback: number;
  };
  upfrontCashOutlay: number;
  deliveryCharges: number;
  futureCashbackEarned: number;
  totalNetEconomicSavings: number;
  finalEffectiveCost: number;
  effectiveSavingsPct: number;
}

export interface GiftCardBrandItem {
  id: string;
  brandKey: string;
  brandName: string;
  category: 'shopping' | 'fashion' | 'beauty' | 'food' | 'travel';
  minDenomination: number;
  maxDenomination: number;
  supportedDenominations: number[];
  currentDiscountPct: number;
  currentCashbackPct: number;
  walletRedemptionUrl: string;
  terms: string;
  isAvailable: boolean;
}

export interface CashbackLedgerEntry {
  id: string;
  userId: string;
  giftCardOrderId: string;
  amount: number;
  status: 'pending' | 'credited' | 'withdrawn';
  creditedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface DropshippingProductItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  supplierPrice: number;
  suggestedSellingPrice: number;
  potentialProfitPerUnit: number;
  profitMarginPct: number;
  trendingScore: number; // 0 - 100
  supplierName: string;
  supplierRating: number;
  shippingDays: string;
  readyAdHooks: string[];
  recommendedAngles: string[];
  creatorStudioProjectId?: string;
}

export type ProductMatchType = 'exact_match' | 'variant_match' | 'similar_product' | 'unverified_match';

export interface ProductMatchResult {
  matchType: ProductMatchType;
  confidenceScore: number;
  matchExplanation: string;
  matchedAttributes: Record<string, string>;
  differentiatingAttributes?: Record<string, string>;
  mismatchedAttributes?: string[];
  isPurchaseSafe: boolean;
}

export interface CanonicalUrlResult {
  originalUrl: string;
  canonicalUrl: string;
  platform: ShoppingPlatform | 'unknown';
  canonicalIdentifier: string;
}

export interface PriceHistoryObservation {
  platform: ShoppingPlatform;
  displayName: string;
  price: number;
  mrp: number;
  timestamp: string;
  inStock: boolean;
  sellerName?: string;
}

export interface PriceHistoryData {
  productIdentifier: string;
  productTitle: string;
  lowestObserved: number;
  highestObserved: number;
  averageObserved: number;
  observations: PriceHistoryObservation[];
  priceTrendDirection: 'dropping' | 'stable' | 'increasing';
  lastUpdated: string;
}

export interface RetailerCoverageReport {
  platform: ShoppingPlatform;
  displayName: string;
  status: 'live_verified' | 'cached_verified' | 'unavailable';
  verifiedAt: string;
  latencyMs: number;
  reasonIfUnavailable?: string;
}

export interface PriceWatchlistRecord {
  id: string;
  userId: string;
  productTitle: string;
  productIdentifier: string;
  targetPrice: number;
  initialPrice: number;
  lowestRecordedPrice: number;
  preferredPlatform: string;
  isActive: boolean;
  createdAt: string;
}

// =============================================================================
// PHASE 5: DROPSHIPPING OPERATIONS & SUPPLIER LOGISTICS TYPES
// =============================================================================

export type DropshippingOrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'supplier_confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export type CourierMilestone =
  | 'order_placed'
  | 'payment_confirmed'
  | 'supplier_accepted'
  | 'manifest_generated'
  | 'dispatched'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'rto_initiated'
  | 'return_pickup'
  | 'returned';

export interface ContributionMarginBreakdown {
  sellingPrice: number;
  cogs: number;
  shippingCost: number;
  gatewayFee: number;
  gstAmount: number;
  returnReserve: number;
  grossProfit: number;
  grossMarginPct: number;
  netContributionMargin: number;
  netContributionMarginPct: number;
}

export interface DropshippingOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  productTitle: string;
  sku: string;
  quantity: number;
  unitSupplierCost: number;
  unitSellingPrice: number;
  unitMargin: number;
  totalPrice: number;
}

export interface OrderTrackingEvent {
  id: string;
  orderId: string;
  milestone: CourierMilestone;
  title: string;
  description: string;
  location: string;
  courier: string;
  occurredAt: string;
}

export interface DropshippingOrder {
  id: string;
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
  status: DropshippingOrderStatus;
  supplierId: string;
  supplierName: string;
  supplierOrderId?: string;
  courierPartner: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  items: DropshippingOrderItem[];
  subtotal: number;
  shippingFee: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentId?: string;
  idempotencyKey?: string;
  financialBreakdown: ContributionMarginBreakdown;
  trackingEvents: OrderTrackingEvent[];
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInventoryItem {
  id: string;
  supplierId: string;
  productId: string;
  productTitle: string;
  sku: string;
  availableStock: number;
  reservedStock: number;
  effectiveStock: number;
  lowStockThreshold: number;
  syncStatus: 'in_sync' | 'syncing' | 'low_stock' | 'out_of_stock' | 'failed';
  lastSyncedAt: string;
}

export type ReturnRefundReason =
  | 'defective_or_damaged'
  | 'wrong_item_delivered'
  | 'quality_not_as_expected'
  | 'arrived_too_late'
  | 'size_fit_issue'
  | 'buyer_cancelled';

export type ReturnQCStatus =
  | 'pending_inspection'
  | 'pickup_scheduled'
  | 'in_transit_to_hub'
  | 'qc_passed'
  | 'qc_rejected';

export interface ReturnRefundRecord {
  id: string;
  orderId: string;
  customerId: string;
  reason: ReturnRefundReason;
  reasonDetails?: string;
  evidenceUrls?: string[];
  qcStatus: ReturnQCStatus;
  refundAmount: number;
  refundStatus: 'pending' | 'processed' | 'failed';
  refundGatewayTxId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}



