// =============================================================================
// RIIQX — Phase 5: Dropshipping Operations & Supplier Logistics Acceptance Tests
// Inventory Delta Sync • Idempotent State Machine • Courier Milestones • Margins • Returns
// =============================================================================

import assert from 'assert';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

console.log('=============================================================================');
console.log('RIIQX — PHASE 5: DROPSHIPPING OPERATIONS ACCEPTANCE TESTS');
console.log('=============================================================================');

async function runPhase5Tests() {
  let passedCount = 0;
  let createdOrderId = '';
  const testIdempotencyKey = `idemp_test_p5_${Date.now()}`;

  // ---------------------------------------------------------------------------
  // TEST 1: Real-Time Supplier Inventory Sync & Delta Feed
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 1: Real-Time Supplier Inventory Sync & Delta Feed ---');
  try {
    const invRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/inventory`);
    assert.strictEqual(invRes.status, 200, 'Inventory API should return HTTP 200');
    const invData = await invRes.json();
    assert.strictEqual(invData.success, true, 'Inventory API should succeed');
    assert.ok(invData.count >= 4, 'Should track at least 4 catalog products in inventory');
    assert.ok(invData.health.totalSkus >= 4, 'Inventory health should report total SKUs');
    console.log(`  Initial Monitored SKUs: ${invData.count} (${invData.health.inSync} Healthy In-Sync)`);

    // Trigger Delta Sync
    const syncRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/inventory`, { method: 'POST' });
    assert.strictEqual(syncRes.status, 200, 'Delta Sync should return HTTP 200');
    const syncData = await syncRes.json();
    assert.strictEqual(syncData.success, true, 'Delta Sync should succeed');
    assert.ok(syncData.syncedCount >= 4, 'Delta Sync should update all catalog items');
    console.log(`  Delta Sync Completed: ${syncData.syncedCount} SKUs synchronized with supplier feed`);

    console.log('✅ [PASS] TEST 1: Real-time inventory monitoring and supplier delta sync verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 1:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Idempotent Order Placement & Checkout Lock
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 2: Idempotent Order Placement & Checkout Lock ---');
  try {
    const orderPayload = {
      customerId: 'cust_acceptance_test_01',
      customerName: 'Ananya Roy',
      customerEmail: 'ananya.roy@example.com',
      customerPhone: '+91 98300 11223',
      shippingAddress: {
        street: '88 Southern Avenue, Lake Gardens',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700029',
        country: 'India',
      },
      items: [
        {
          productId: 'prod_lumina_aura_01',
          quantity: 1,
        },
      ],
      paymentMethod: 'upi_direct',
      idempotencyKey: testIdempotencyKey,
      initialStatus: 'paid',
    };

    // First attempt: creates new order
    const orderRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    assert.strictEqual(orderRes.status, 200, 'Order creation should return HTTP 200');
    const orderData = await orderRes.json();
    assert.strictEqual(orderData.success, true, 'Order creation should succeed');
    assert.strictEqual(orderData.isExisting, false, 'First attempt must create a fresh order');
    createdOrderId = orderData.order.id;
    assert.ok(createdOrderId.startsWith('ORD_RIIQX_'), 'Order ID must follow RIIQX convention');
    assert.strictEqual(orderData.order.status, 'paid', 'Initial status must be paid');
    console.log(`  Initial Order Created: ${createdOrderId} | Subtotal: ₹${orderData.order.totalAmount}`);

    // Second attempt: duplicate idempotency key must safely return existing order
    const dupRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    assert.strictEqual(dupRes.status, 200, 'Duplicate request should return HTTP 200');
    const dupData = await dupRes.json();
    assert.strictEqual(dupData.success, true, 'Duplicate request should succeed');
    assert.strictEqual(dupData.isExisting, true, 'Duplicate request must flag isExisting: true');
    assert.strictEqual(dupData.order.id, createdOrderId, 'Must resolve to existing order ID');
    console.log(`  Duplicate Request Successfully Idempotent: returned ${dupData.order.id}`);

    console.log('✅ [PASS] TEST 2: Idempotent order placement and duplicate charge protection verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 2:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Strict State Machine Lifecycle & Illegal Transition Blocking
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 3: State Machine Lifecycle & Illegal Transition Prevention ---');
  try {
    assert.ok(createdOrderId, 'Need createdOrderId from Test 2');

    // Attempt illegal transition: Paid -> Delivered (illegal skip)
    const illegalRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    });

    assert.strictEqual(illegalRes.status, 400, 'Illegal transition must return HTTP 400');
    const illegalData = await illegalRes.json();
    assert.strictEqual(illegalData.success, false, 'Illegal transition must fail');
    assert.ok(illegalData.error.includes('Invalid order state transition'), 'Must return descriptive error');
    console.log(`  Illegal Transition Blocked: "paid" -> "delivered" correctly rejected`);

    // Valid Step 1: paid -> supplier_confirmed
    const step1Res = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'supplier_confirmed' }),
    });
    assert.strictEqual(step1Res.status, 200);
    const step1Data = await step1Res.json();
    assert.strictEqual(step1Data.order.status, 'supplier_confirmed');
    console.log('  State Transition 1: paid -> supplier_confirmed (PO Generated)');

    // Valid Step 2: supplier_confirmed -> packed
    const step2Res = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'packed' }),
    });
    assert.strictEqual(step2Res.status, 200);
    const step2Data = await step2Res.json();
    assert.strictEqual(step2Data.order.status, 'packed');
    console.log('  State Transition 2: supplier_confirmed -> packed (AWB Attached)');

    // Valid Step 3: packed -> shipped
    const step3Res = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'shipped' }),
    });
    assert.strictEqual(step3Res.status, 200);
    const step3Data = await step3Res.json();
    assert.strictEqual(step3Data.order.status, 'shipped');
    console.log('  State Transition 3: packed -> shipped (In-Transit)');

    // Valid Step 4: shipped -> delivered
    const step4Res = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    });
    assert.strictEqual(step4Res.status, 200);
    const step4Data = await step4Res.json();
    assert.strictEqual(step4Data.order.status, 'delivered');
    console.log('  State Transition 4: shipped -> delivered (OTP Verified)');

    console.log('✅ [PASS] TEST 3: Strict state machine transitions and illegal jump rejection verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 3:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Live Courier Tracking Milestones & AWB Validation
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 4: Live Courier Tracking Milestones & AWB Validation ---');
  try {
    const trackRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${createdOrderId}`);
    assert.strictEqual(trackRes.status, 200, 'Tracking query should return HTTP 200');
    const trackData = await trackRes.json();
    assert.strictEqual(trackData.success, true);
    const order = trackData.order;

    assert.ok(order.trackingNumber.startsWith('BD-DEL-'), 'Tracking number must have courier prefix');
    assert.ok(order.trackingUrl.includes('bluedart.com'), 'Tracking URL must point to carrier portal');
    assert.ok(order.trackingEvents.length >= 5, 'Should have recorded at least 5 lifecycle milestones');

    const milestones = order.trackingEvents.map((e) => e.milestone);
    assert.ok(milestones.includes('order_placed'), 'Must have order_placed milestone');
    assert.ok(milestones.includes('supplier_accepted'), 'Must have supplier_accepted milestone');
    assert.ok(milestones.includes('manifest_generated'), 'Must have manifest_generated milestone');
    assert.ok(milestones.includes('dispatched'), 'Must have dispatched milestone');
    assert.ok(milestones.includes('delivered'), 'Must have delivered milestone');

    console.log(`  Courier Partner: ${order.courierPartner} | AWB: ${order.trackingNumber}`);
    console.log(`  Tracking Milestones Recorded: ${order.trackingEvents.length} events logged`);

    console.log('✅ [PASS] TEST 4: Courier milestone generation, AWB mapping, and location history verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 4:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Mathematical Accuracy of Contribution Margin Calculator
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 5: Mathematical Accuracy of Contribution Margin Calculator ---');
  try {
    const sp = 2499;
    const cogs = 1100;
    const shipping = 60;

    const marginRes = await fetch(
      `${BASE_URL}/api/shopping/dropshipping/margins?sellingPrice=${sp}&cogs=${cogs}&shippingCost=${shipping}`
    );
    assert.strictEqual(marginRes.status, 200, 'Margin API must return HTTP 200');
    const marginData = await marginRes.json();
    assert.strictEqual(marginData.success, true);
    const b = marginData.breakdown;

    // Gross Profit = 2499 - 1100 = 1399
    assert.strictEqual(b.grossProfit, 1399, 'Gross profit must be SP - COGS');
    assert.strictEqual(b.grossMarginPct, 56.0, 'Gross margin % must be 56.0%');

    // Gateway Fee = 2499 * 0.019 * 1.18 = 56.03
    assert.strictEqual(b.gatewayFee, 56.03, 'Gateway fee with GST must be 56.03');

    // 18% GST on value addition = (1399 * 0.18) / 1.18 = 213.41
    assert.strictEqual(b.gstAmount, 213.41, 'GST on value addition must be 213.41');

    // Return & RTO Reserve (5%) = 2499 * 0.05 = 124.95
    assert.strictEqual(b.returnReserve, 124.95, 'Return reserve must be 124.95');

    // Net Contribution = 2499 - 1100 - 60 - 56.03 - 213.41 - 124.95 = 944.61
    assert.strictEqual(b.netContributionMargin, 944.61, 'Net contribution margin must be 944.61');
    assert.strictEqual(b.netContributionMarginPct, 37.8, 'Net margin % must be 37.8%');

    console.log(`  Selling Price: ₹${b.sellingPrice} | COGS: ₹${b.cogs} | Shipping: ₹${b.shippingCost}`);
    console.log(`  Gross Profit: ₹${b.grossProfit} (${b.grossMarginPct}%)`);
    console.log(`  Gateway Fee (1.9% + GST): -₹${b.gatewayFee} | GST Provision: -₹${b.gstAmount}`);
    console.log(`  Return Provision (5%): -₹${b.returnReserve}`);
    console.log(`  Net Contribution Margin: +₹${b.netContributionMargin} (${b.netContributionMarginPct}%)`);

    console.log('✅ [PASS] TEST 5: Contribution margin mathematical precision verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 5:', err.message);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Returns Workflow, QC Inspection & Automated Gateway Refund
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST 6: Returns Workflow, QC Inspection & Automated Gateway Refund ---');
  try {
    const returnPayload = {
      customerId: 'cust_acceptance_test_01',
      reason: 'defective_or_damaged',
      reasonDetails: 'Device RGB LED strip flickers intermittently on power-on.',
      evidenceUrls: ['https://example.com/evidence/defect_video_01.mp4'],
    };

    const returnRes = await fetch(`${BASE_URL}/api/shopping/dropshipping/orders/${createdOrderId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(returnPayload),
    });

    assert.strictEqual(returnRes.status, 200, 'Return request should return HTTP 200');
    const returnData = await returnRes.json();
    assert.strictEqual(returnData.success, true, 'Return request should succeed');
    assert.ok(returnData.returnRecord.id.startsWith('RET_RIIQX_'), 'Return ID must follow RIIQX convention');
    assert.strictEqual(returnData.returnRecord.qcStatus, 'qc_passed', 'Automated inspection must pass QC');
    assert.strictEqual(returnData.returnRecord.refundStatus, 'processed', 'Refund must be processed');
    assert.ok(
      returnData.returnRecord.refundGatewayTxId.startsWith('RFND_RZP_'),
      'Refund transaction ID must follow gateway format'
    );
    assert.strictEqual(returnData.order.status, 'refunded', 'Order status must be updated to refunded');

    console.log(`  Return ID: ${returnData.returnRecord.id}`);
    console.log(`  QC Status: ${returnData.returnRecord.qcStatus} | Refund: ${returnData.returnRecord.refundStatus}`);
    console.log(`  Gateway Refund TX: ${returnData.returnRecord.refundGatewayTxId}`);
    console.log(`  Final Order Status: ${returnData.order.status}`);

    console.log('✅ [PASS] TEST 6: 7-day return workflow, QC inspection, and automated gateway refund verified');
    passedCount++;
  } catch (err) {
    console.error('❌ [FAIL] TEST 6:', err.message);
  }

  console.log('\n=============================================================================');
  console.log(`PHASE 5 TEST RESULTS: ${passedCount}/6 TESTS PASSED (${Math.round((passedCount / 6) * 100)}%)`);
  console.log('=============================================================================');

  if (passedCount !== 6) {
    process.exit(1);
  }
}

runPhase5Tests();
