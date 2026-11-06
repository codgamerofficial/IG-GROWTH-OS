// =============================================================================
// RIIQX — Personal Twin Lifestyle, Digest & Goals E2E Test Suite
// Zero Simulation • Real HTTP Execution • Validates Endpoints on Port 3001
// =============================================================================

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('=============================================================================');
  console.log('RIIQX Personal AI Twin: Lifestyle, Digest & Goals Verification Suite');
  console.log(`Target Host: ${BASE_URL}`);
  console.log('=============================================================================\n');

  // ---------------------------------------------------------------------------
  // TEST 1: Lifestyle Recipe Generation (Cook at Home)
  // ---------------------------------------------------------------------------
  console.log('--- Test 1: Cook at Home Recipe Intelligence ---');
  try {
    const res = await fetch(`${BASE_URL}/api/twin/lifestyle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'cook_home',
        ingredients: 'Eggs, fresh paneer, baby spinach, ripe tomatoes',
        diet: 'High Protein / Low Carb',
        budget: 'Under ₹300',
        mealType: 'Dinner',
        timeAvailable: '20 mins',
      }),
    });

    assert(res.status === 200, `POST /api/twin/lifestyle returned 200 (Got ${res.status})`);
    const data = await res.json();
    assert(data.success === true, 'Response marked success === true');
    assert(data.mode === 'cook_home', 'Mode returned is cook_home');
    assert(Array.isArray(data.recommendations) && data.recommendations.length > 0, 'Returned recommendations array');

    const first = data.recommendations[0];
    assert(typeof first.title === 'string' && first.title.length > 3, `Recipe title present: "${first.title}"`);
    assert(Boolean(first.time && first.cost && first.calories && first.protein), 'Macros & constraints present (time, cost, kcal, protein)');
    assert(Array.isArray(first.ingredients) && first.ingredients.length > 0, `Ingredients list present (${first.ingredients.length} items)`);
    assert(Array.isArray(first.steps) && first.steps.length > 0, `Cooking steps present (${first.steps.length} steps)`);
    assert(typeof first.whyTwinPicks === 'string' && first.whyTwinPicks.length > 10, 'Twin justification present');
  } catch (err) {
    assert(false, `Test 1 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Lifestyle Dining Out / Ordering Hacks
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 2: Eat Out & Delivery Order Verification ---');
  try {
    const res = await fetch(`${BASE_URL}/api/twin/lifestyle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'eat_out',
        diet: 'High Protein / Low Carb',
        budget: 'Under ₹400',
        mealType: 'Dinner',
      }),
    });

    assert(res.status === 200, `POST /api/twin/lifestyle (eat_out) returned 200 (Got ${res.status})`);
    const data = await res.json();
    assert(data.success === true, 'Response marked success === true');
    assert(data.mode === 'eat_out', 'Mode returned is eat_out');
    assert(Array.isArray(data.recommendations) && data.recommendations.length > 0, 'Returned dining guides array');

    const first = data.recommendations[0];
    assert(typeof first.title === 'string', `Dining title present: "${first.title}"`);
    assert(typeof first.orderingHack === 'string' && first.orderingHack.length > 10, 'Customization ordering hack present');
    assert(typeof first.whatRestaurantsHide === 'string' && first.whatRestaurantsHide.length > 10, 'Hidden restaurant caveats present');
    assert(Array.isArray(first.betterSwaps) && first.betterSwaps.length > 0, `Better swaps list present (${first.betterSwaps.length} swaps)`);
  } catch (err) {
    assert(false, `Test 2 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Goal Creation (POST /api/twin/goals)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 3: Personal Goal Creation ---');
  let createdGoalId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/twin/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Sony WH-1000XM5 Purchase Budget',
        description: 'Saving ₹3,500 monthly for noise-cancelling headphones',
        category: 'purchase_budget',
        targetAmount: 26990,
        currentAmount: 8000,
        currency: 'INR',
        deadline: '2026-12-15',
        status: 'active',
      }),
    });

    assert(res.status === 200, `POST /api/twin/goals returned 200 (Got ${res.status})`);
    const data = await res.json();
    assert(data.success === true && data.goal, 'Goal object created successfully');
    assert(data.goal.title === 'Sony WH-1000XM5 Purchase Budget', 'Goal title matches');
    assert(data.goal.targetAmount === 26990, 'Target amount correctly preserved');
    assert(data.goal.currentAmount === 8000, 'Current amount correctly preserved');
    createdGoalId = data.goal.id;
    assert(Boolean(createdGoalId), `Assigned goal ID: ${createdGoalId}`);
  } catch (err) {
    assert(false, `Test 3 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Goal Listing & Progress Update (PATCH /api/twin/goals)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 4: Goal Listing and Progress Update ---');
  try {
    const listRes = await fetch(`${BASE_URL}/api/twin/goals`);
    assert(listRes.status === 200, 'GET /api/twin/goals returned 200');
    const listData = await listRes.json();
    const found = listData.goals.find((g) => g.id === createdGoalId);
    assert(Boolean(found), `Created goal found in list (${listData.goals.length} total goals)`);

    // Increment savings by ₹2,000 via PATCH
    const patchRes = await fetch(`${BASE_URL}/api/twin/goals`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goalId: createdGoalId,
        currentAmount: 10000,
      }),
    });

    assert(patchRes.status === 200, `PATCH /api/twin/goals returned 200 (Got ${patchRes.status})`);
    const patchData = await patchRes.json();
    assert(patchData.success === true, 'PATCH marked success === true');
    assert(patchData.goal.currentAmount === 10000, `Current amount updated to 10,000 (Got ${patchData.goal.currentAmount})`);
  } catch (err) {
    assert(false, `Test 4 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: On-Demand Weekly Intelligence Digest Generation (POST /api/twin/digest)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 5: On-Demand Intelligence Digest Generation ---');
  try {
    const res = await fetch(`${BASE_URL}/api/twin/digest`, {
      method: 'POST',
    });

    assert(res.status === 200, `POST /api/twin/digest returned 200 (Got ${res.status})`);
    const data = await res.json();
    assert(data.success === true, 'Digest response marked success === true');
    assert(data.digest && typeof data.digest.title === 'string', `Digest title present: "${data.digest?.title}"`);
    assert(Array.isArray(data.digest?.sections) && data.digest.sections.length >= 3, `Digest has ${data.digest?.sections?.length} intelligence sections`);

    const sec = data.digest.sections[0];
    assert(typeof sec.title === 'string' && typeof sec.summary === 'string', `Section 1 has title & summary ("${sec.title}")`);
    assert(Array.isArray(sec.sourceCitations), 'Section 1 has verifiable citations array');
  } catch (err) {
    assert(false, `Test 5 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Digest Retrieval (GET /api/twin/digest)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 6: Digest Retrieval ---');
  try {
    const res = await fetch(`${BASE_URL}/api/twin/digest`);
    assert(res.status === 200, `GET /api/twin/digest returned 200 (Got ${res.status})`);
    const data = await res.json();
    assert(data.success === true, 'GET digest response marked success === true');
    assert(Array.isArray(data.digests) && data.digests.length > 0, `Returned digests history (${data.digests.length} digests)`);
  } catch (err) {
    assert(false, `Test 6 failed with error: ${err.message}`);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Goal Cleanup (DELETE /api/twin/goals)
  // ---------------------------------------------------------------------------
  console.log('\n--- Test 7: Goal Cleanup ---');
  if (createdGoalId) {
    try {
      const delRes = await fetch(`${BASE_URL}/api/twin/goals?id=${createdGoalId}`, {
        method: 'DELETE',
      });
      assert(delRes.status === 200, `DELETE /api/twin/goals?id=${createdGoalId} returned 200`);
      const delData = await delRes.json();
      assert(delData.deleted === true, 'Goal successfully deleted from repository');
    } catch (err) {
      assert(false, `Test 7 failed with error: ${err.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n=============================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED | ${failed} FAILED | TOTAL: ${passed + failed}`);
  console.log('=============================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();

