// =============================================================================
// RIIQX — Phase 6 Acceptance Test Suite: AI Workflow Builder
// Tests Node Graph, Natural Language Synthesis, Execution Logs & Human Gates
// =============================================================================

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3001';

console.log('--- STARTING PHASE 6 TEST SUITE: AI WORKFLOW BUILDER ---');

async function runTests() {
  let synthesizedWorkflowId = null;
  let executionRunId = null;
  let approvalNodeId = null;

  // TEST 1: List workflows (verifies seeded templates)
  console.log('\n[TEST 1] GET /api/riiqx/workflows');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/workflows`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.workflows));
    assert.ok(data.workflows.length > 0, 'Expected at least 1 seeded template');
    console.log(`✓ Fetched workflows list cleanly. Found ${data.count} workflows (including master templates).`);
  }

  // TEST 2: Synthesize Workflow from Natural Language Prompt
  console.log('\n[TEST 2] POST /api/riiqx/workflows/synthesize (Natural Language to DAG Node Graph)');
  {
    const payload = {
      prompt: 'Automatically generate 3 viral reel hooks from product upload, but wait for my human approval before rendering to video.',
    };

    const res = await fetch(`${BASE_URL}/api/riiqx/workflows/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.workflow);

    synthesizedWorkflowId = data.workflow.id;
    console.log(`✓ Workflow synthesized with ID: ${synthesizedWorkflowId}`);
    console.log(`  - Name: "${data.workflow.name}"`);
    console.log(`  - Nodes count: ${data.workflow.nodes.length}`);
    console.log(`  - Edges count: ${data.workflow.edges.length}`);

    // Verify human approval node exists
    const approvalNode = data.workflow.nodes.find(
      (n) => n.type === 'human_approval' || n.subType === 'approval_checkpoint'
    );
    assert.ok(approvalNode, 'Expected at least 1 human approval checkpoint node in DAG graph');
    approvalNodeId = approvalNode.id;
    console.log(`  - Human Checkpoint Node: [${approvalNode.label}] (ID: ${approvalNodeId})`);

    // Verify disk persistence
    const diskPath = path.join(process.cwd(), 'AI Video Editor', 'projects', 'workflows', `${synthesizedWorkflowId}.json`);
    assert.ok(fs.existsSync(diskPath), `Expected workflow file on disk at ${diskPath}`);
    console.log(`✓ Verified disk persistence in AI Video Editor/projects/workflows/`);
  }

  // TEST 3: Execute Workflow & Verify Pause at Human Checkpoint Gate
  console.log('\n[TEST 3] POST /api/riiqx/workflows/:id/execute (Run Pipeline & Pause for Sign-off)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/workflows/${synthesizedWorkflowId}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: { topic: 'Autonomous Workflow Launch' },
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.run);

    executionRunId = data.run.id;
    console.log(`✓ Workflow execution started. Run ID: ${executionRunId}`);
    console.log(`  - Status: ${data.run.status}`);
    assert.strictEqual(data.run.status, 'waiting_approval', 'Workflow must pause at human approval gate');

    console.log(`  - Checkpoint Node State: ${data.run.nodeStates[approvalNodeId]?.status}`);
    assert.strictEqual(data.run.nodeStates[approvalNodeId]?.status, 'paused_for_approval');

    console.log(`  - Telemetry Logs Count: ${data.run.logs.length}`);
    assert.ok(data.run.logs.length >= 2, 'Expected telemetry logs');
  }

  // TEST 4: Human Approval Sign-off & Completion of Downstream Nodes
  console.log('\n[TEST 4] POST /api/riiqx/workflows/:id/approve (Grant Sign-off & Finish Execution)');
  {
    const res = await fetch(`${BASE_URL}/api/riiqx/workflows/${synthesizedWorkflowId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runId: executionRunId,
        nodeId: approvalNodeId,
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.run);

    console.log(`✓ Human approval sign-off granted:`);
    console.log(`  - Final Run Status: ${data.run.status}`);
    assert.strictEqual(data.run.status, 'completed', 'Workflow must complete after human sign-off');

    const lastLog = data.run.logs[data.run.logs.length - 1];
    console.log(`  - Final Log Entry: "${lastLog.message}"`);
  }

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 6 ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('\n❌ PHASE 6 TEST SUITE FAILED:', err);
  process.exit(1);
});
