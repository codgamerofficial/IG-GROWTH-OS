// =============================================================================
// RIIQX — Master AI Workflow Execution Engine
// Visual Node Graph • Natural Language Synthesizer • Human Approval Gate
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowEdge,
  WorkflowExecutionRun,
  ExecutionLogItem,
  NodeExecutionStatus,
} from './types';
import { AIServiceManager } from '../ai/ai-service-manager';
import { BrandDNASynthesizer } from '../brand/brand-dna-synthesizer';
import { CampaignGenerator } from '../campaigns/campaign-generator';
import { ProductService } from '../products/product-service';

const WorkflowSynthesisSchema = z.object({
  name: z.string().default('Autonomous Creative Flow'),
  description: z.string().default('Multi-step autonomous creative generation sequence.'),
  trigger: z.enum(['manual', 'schedule', 'new_asset', 'social_event']).default('manual'),
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['trigger', 'ai_action', 'logic', 'integration', 'human_approval']),
      subType: z.string(),
      label: z.string(),
      description: z.string().optional(),
      x: z.number().default(100),
      y: z.number().default(100),
      config: z.record(z.any()).default({}),
    })
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      sourceNodeId: z.string(),
      targetNodeId: z.string(),
      label: z.string().optional(),
    })
  ),
});

export class WorkflowEngine {
  private static workflowsDir = path.join(process.cwd(), 'AI Video Editor', 'projects', 'workflows');
  private static runsDir = path.join(process.cwd(), 'AI Video Editor', 'projects', 'workflows', 'runs');
  private static memoryCache: Map<string, WorkflowDefinition> = new Map();
  private static activeRuns: Map<string, WorkflowExecutionRun> = new Map();

  private static saveRun(run: WorkflowExecutionRun): void {
    try {
      if (!fs.existsSync(this.runsDir)) fs.mkdirSync(this.runsDir, { recursive: true });
      this.activeRuns.set(run.id, run);
      fs.writeFileSync(path.join(this.runsDir, `${run.id}.json`), JSON.stringify(run, null, 2), 'utf-8');
    } catch {}
  }

  static {
    try {
      if (fs.existsSync(this.workflowsDir)) {
        const files = fs.readdirSync(this.workflowsDir).filter((f) => f.endsWith('.json'));
        for (const file of files) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(this.workflowsDir, file), 'utf-8'));
            if (data.id && data.name) {
              this.memoryCache.set(data.id, data);
            }
          } catch {}
        }
      }
    } catch {}

    // Seed master templates if empty
    if (this.memoryCache.size === 0) {
      this.seedMasterTemplates();
    }
  }

  /**
   * Synthesize a complete node graph from natural language instruction
   */
  public static async synthesizeWorkflowFromPrompt(prompt: string): Promise<WorkflowDefinition> {
    const brand = BrandDNASynthesizer.getActiveBrandDNA();
    const wfId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const systemPrompt = `You are the Principal AI Workflow Architect at RIIQX.
Convert the creator's natural language automation request into a valid, DAG node graph with nodes and directional edges.
Allowed Node Types:
1. 'trigger': (subType: 'manual_trigger' | 'schedule_trigger' | 'new_product_trigger')
2. 'ai_action': (subType: 'extract_brand' | 'generate_campaign' | 'generate_scene' | 'synthesize_storyboard')
3. 'logic': (subType: 'condition_filter' | 'pacing_check')
4. 'human_approval': (subType: 'approval_checkpoint') - Critical human gate before publishing/rendering.
5. 'integration': (subType: 'export_to_video' | 'post_to_social')

Arrange nodes left-to-right (x increases by 240px, y between 100-300px).
Return ONLY valid JSON matching the requested schema.`;

    const userPrompt = `Creator Instruction: "${prompt}"
Brand Context: ${brand?.brandName || 'RIIQX'}
Design a connected workflow that fulfills this exact automation.`;

    let synthesized: any;

    try {
      const res = await AIServiceManager.executeStructured(
        userPrompt,
        WorkflowSynthesisSchema,
        {
          systemPrompt,
          taskType: 'workflow_synthesis',
          temperature: 0.6,
        }
      );
      synthesized = res.data;
    } catch (err: any) {
      console.warn('[WorkflowEngine] AI workflow synthesis fallback triggered:', err.message);
      synthesized = this.buildFallbackWorkflowFromPrompt(prompt);
    }

    const workflow: WorkflowDefinition = {
      id: wfId,
      name: synthesized.name || 'Custom AI Workflow',
      description: synthesized.description || prompt,
      trigger: synthesized.trigger || 'manual',
      nodes: (synthesized.nodes || []).map((n: any) => ({
        ...n,
        status: 'idle' as NodeExecutionStatus,
      })),
      edges: synthesized.edges || [],
      createdAt: now,
      updatedAt: now,
    };

    this.saveWorkflow(workflow);
    return workflow;
  }

  /**
   * Execute workflow node-by-node with stage logging & human approval checkpoints
   */
  public static async executeWorkflow(
    workflowId: string,
    initialPayload?: any
  ): Promise<WorkflowExecutionRun> {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) throw new Error(`Workflow not found: ${workflowId}`);

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const nodeStates: Record<string, { status: NodeExecutionStatus; output?: any; error?: string }> = {};
    for (const node of workflow.nodes) {
      nodeStates[node.id] = { status: 'idle' };
    }

    const logs: ExecutionLogItem[] = [
      {
        timestamp: now,
        nodeId: workflow.nodes[0]?.id || 'root',
        message: `Workflow execution started for "${workflow.name}".`,
        level: 'info',
      },
    ];

    const run: WorkflowExecutionRun = {
      id: runId,
      workflowId,
      status: 'running',
      nodeStates,
      logs,
      startedAt: now,
    };

    this.activeRuns.set(runId, run);

    // Sequentially execute nodes in topological or array order
    let previousOutput = initialPayload || { topic: 'Autonomous Creator Launch' };

    for (const node of workflow.nodes) {
      run.currentNodeId = node.id;
      run.nodeStates[node.id] = { status: 'running' };
      run.logs.push({
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        message: `Executing [${node.label}] (${node.subType})...`,
        level: 'info',
      });

      // Check for Human-in-the-loop Approval Checkpoint Gate
      if (node.type === 'human_approval' || node.subType === 'approval_checkpoint') {
        run.nodeStates[node.id] = {
          status: 'paused_for_approval',
          output: previousOutput,
        };
        run.status = 'waiting_approval';
        run.logs.push({
          timestamp: new Date().toISOString(),
          nodeId: node.id,
          message: `PAUSED AT HUMAN APPROVAL GATE: Review generated output before proceeding.`,
          level: 'warn',
        });
        // Stop execution loop until human approves
        this.saveRun(run);
        return run;
      }

      // Execute node action
      try {
        const output = await this.executeNodeAction(node, previousOutput);
        run.nodeStates[node.id] = {
          status: 'completed',
          output,
        };
        run.logs.push({
          timestamp: new Date().toISOString(),
          nodeId: node.id,
          message: `Completed [${node.label}] successfully.`,
          level: 'info',
        });
        previousOutput = output;
      } catch (err: any) {
        run.nodeStates[node.id] = {
          status: 'failed',
          error: err.message,
        };
        run.status = 'failed';
        run.logs.push({
          timestamp: new Date().toISOString(),
          nodeId: node.id,
          message: `Failed [${node.label}]: ${err.message}`,
          level: 'error',
        });
        return run;
      }
    }

    run.status = 'completed';
    run.completedAt = new Date().toISOString();
    run.logs.push({
      timestamp: run.completedAt,
      nodeId: workflow.nodes[workflow.nodes.length - 1]?.id || 'end',
      message: `Workflow completed all ${workflow.nodes.length} nodes cleanly.`,
      level: 'info',
    });

    this.saveRun(run);
    return run;
  }

  /**
   * Resumes workflow paused at a human approval checkpoint
   */
  public static async approveExecutionNode(
    runId: string,
    nodeId: string
  ): Promise<WorkflowExecutionRun> {
    const run = this.getExecutionRun(runId);
    if (!run) throw new Error(`Execution run not found: ${runId}`);

    const workflow = this.getWorkflow(run.workflowId);
    if (!workflow) throw new Error(`Workflow not found: ${run.workflowId}`);

    // Mark approved
    run.nodeStates[nodeId] = { status: 'completed', output: { approved: true, approvedAt: new Date().toISOString() } };
    run.logs.push({
      timestamp: new Date().toISOString(),
      nodeId,
      message: `Human approval granted. Resuming downstream nodes...`,
      level: 'info',
    });

    // Find index of approved node
    const approvedIdx = workflow.nodes.findIndex((n) => n.id === nodeId);
    let previousOutput = { approved: true };

    // Execute remaining nodes after checkpoint
    for (let i = approvedIdx + 1; i < workflow.nodes.length; i++) {
      const node = workflow.nodes[i];
      run.currentNodeId = node.id;
      run.nodeStates[node.id] = { status: 'running' };

      try {
        const output = await this.executeNodeAction(node, previousOutput);
        run.nodeStates[node.id] = { status: 'completed', output };
        run.logs.push({
          timestamp: new Date().toISOString(),
          nodeId: node.id,
          message: `Completed downstream [${node.label}] successfully.`,
          level: 'info',
        });
        previousOutput = output;
      } catch (err: any) {
        run.nodeStates[node.id] = { status: 'failed', error: err.message };
        run.status = 'failed';
        return run;
      }
    }

    run.status = 'completed';
    run.completedAt = new Date().toISOString();
    run.logs.push({
      timestamp: run.completedAt,
      nodeId: 'end',
      message: `Workflow completed after approval checkpoint.`,
      level: 'info',
    });

    this.saveRun(run);
    return run;
  }

  /**
   * Internal Node Action Dispatcher
   */
  private static async executeNodeAction(node: WorkflowNode, inputPayload: any): Promise<any> {
    switch (node.subType) {
      case 'extract_brand':
        return BrandDNASynthesizer.getActiveBrandDNA() || { brandName: 'RIIQX' };

      case 'generate_campaign':
        return await CampaignGenerator.generateCampaign({
          name: inputPayload.topic || 'Autonomous Workflow Campaign',
          objective: 'product_launch',
          targetPlatforms: ['instagram', 'youtube', 'tiktok'],
          durationDays: 14,
          callToAction: 'Deploy your first agent today',
        });

      case 'generate_scene':
        return await ProductService.createProduct({
          name: inputPayload.productName || 'Workflow Autonomous Device',
          category: 'electronics',
          description: 'High-performance smart hardware unit with titanium accents.',
        });

      case 'export_to_video':
        return {
          storyboardId: `sb_wf_${Date.now()}`,
          status: 'ready_to_render',
          aspectRatio: '9:16',
        };

      default:
        return { executed: true, node: node.id, timestamp: new Date().toISOString() };
    }
  }

  /**
   * Save workflow definition to disk
   */
  public static saveWorkflow(wf: Partial<WorkflowDefinition> & { name: string }): WorkflowDefinition {
    const id = wf.id || `wf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const record: WorkflowDefinition = {
      id,
      name: wf.name,
      description: wf.description || '',
      trigger: wf.trigger || 'manual',
      nodes: wf.nodes || [],
      edges: wf.edges || [],
      isTemplate: wf.isTemplate || false,
      createdAt: wf.createdAt || now,
      updatedAt: now,
    };

    try {
      if (!fs.existsSync(this.workflowsDir)) {
        fs.mkdirSync(this.workflowsDir, { recursive: true });
      }
      this.memoryCache.set(id, record);
      fs.writeFileSync(path.join(this.workflowsDir, `${id}.json`), JSON.stringify(record, null, 2), 'utf-8');
    } catch (err: any) {
      console.warn('[WorkflowEngine] Failed to persist workflow:', err.message);
    }

    return record;
  }

  public static getWorkflow(id: string): WorkflowDefinition | null {
    if (this.memoryCache.has(id)) return this.memoryCache.get(id)!;
    const p = path.join(this.workflowsDir, `${id}.json`);
    if (fs.existsSync(p)) {
      try {
        const d = JSON.parse(fs.readFileSync(p, 'utf-8'));
        this.memoryCache.set(id, d);
        return d;
      } catch {}
    }
    return null;
  }

  public static listWorkflows(): WorkflowDefinition[] {
    return Array.from(this.memoryCache.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public static deleteWorkflow(id: string): boolean {
    this.memoryCache.delete(id);
    const p = path.join(this.workflowsDir, `${id}.json`);
    if (fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
        return true;
      } catch {}
    }
    return false;
  }

  public static getExecutionRun(runId: string): WorkflowExecutionRun | null {
    if (this.activeRuns.has(runId)) return this.activeRuns.get(runId)!;
    const p = path.join(this.runsDir, `${runId}.json`);
    if (fs.existsSync(p)) {
      try {
        const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
        this.activeRuns.set(runId, data);
        return data;
      } catch {}
    }
    return null;
  }

  /**
   * Seed 4 Master Workflow Templates
   */
  private static seedMasterTemplates(): void {
    const templates: WorkflowDefinition[] = [
      {
        id: 'template_ecommerce_launch',
        name: 'E-Commerce Commercial Launch',
        description: 'Product photo ➔ Background removal ➔ Scene generation ➔ 9:16 Video Reel ➔ Approval Checkpoint',
        trigger: 'new_asset',
        isTemplate: true,
        nodes: [
          {
            id: 'n1',
            type: 'trigger',
            subType: 'new_product_trigger',
            label: 'New Product Upload',
            x: 80,
            y: 140,
            config: {},
          },
          {
            id: 'n2',
            type: 'ai_action',
            subType: 'generate_scene',
            label: 'AI Commercial Scene',
            x: 320,
            y: 140,
            config: { environment: 'luxury_pedestal' },
          },
          {
            id: 'n3',
            type: 'ai_action',
            subType: 'generate_campaign',
            label: 'Viral Reel Script',
            x: 560,
            y: 140,
            config: { format: '9:16' },
          },
          {
            id: 'n4',
            type: 'human_approval',
            subType: 'approval_checkpoint',
            label: 'Human Review Checkpoint',
            x: 800,
            y: 140,
            config: {},
          },
          {
            id: 'n5',
            type: 'integration',
            subType: 'export_to_video',
            label: 'AI Video Editor Render',
            x: 1040,
            y: 140,
            config: {},
          },
        ],
        edges: [
          { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2', label: 'Extract Features' },
          { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3', label: 'Visual Context' },
          { id: 'e3', sourceNodeId: 'n3', targetNodeId: 'n4', label: 'Submit for Review' },
          { id: 'e4', sourceNodeId: 'n4', targetNodeId: 'n5', label: 'Approved ➔ Render' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'template_weekly_machine',
        name: 'Weekly Content Machine',
        description: 'Trend Scan ➔ 5 Viral Scripts ➔ Multi-Platform Copy ➔ Approval Queue',
        trigger: 'schedule',
        isTemplate: true,
        nodes: [
          { id: 'w1', type: 'trigger', subType: 'schedule_trigger', label: 'Weekly Schedule (Monday 9AM)', x: 80, y: 140, config: {} },
          { id: 'w2', type: 'ai_action', subType: 'extract_brand', label: 'Inject Brand DNA', x: 320, y: 140, config: {} },
          { id: 'w3', type: 'ai_action', subType: 'generate_campaign', label: 'Omnichannel Campaign', x: 560, y: 140, config: {} },
          { id: 'w4', type: 'human_approval', subType: 'approval_checkpoint', label: 'Creator Approval Gate', x: 800, y: 140, config: {} },
        ],
        edges: [
          { id: 'we1', sourceNodeId: 'w1', targetNodeId: 'w2' },
          { id: 'we2', sourceNodeId: 'w2', targetNodeId: 'w3' },
          { id: 'we3', sourceNodeId: 'w3', targetNodeId: 'w4' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const t of templates) {
      this.saveWorkflow(t);
    }
  }

  /**
   * Fallback prompt-to-workflow synthesizer
   */
  private static buildFallbackWorkflowFromPrompt(prompt: string): any {
    return {
      name: 'Custom Autonomous Creative Flow',
      description: prompt,
      trigger: 'manual',
      nodes: [
        { id: 'fn_1', type: 'trigger', subType: 'manual_trigger', label: 'Manual Goal Trigger', x: 80, y: 140, config: {} },
        { id: 'fn_2', type: 'ai_action', subType: 'extract_brand', label: 'Brand DNA Guardrails', x: 320, y: 140, config: {} },
        { id: 'fn_3', type: 'ai_action', subType: 'generate_campaign', label: 'Multi-Channel Creative Engine', x: 560, y: 140, config: {} },
        { id: 'fn_4', type: 'human_approval', subType: 'approval_checkpoint', label: 'Human Approval Checkpoint', x: 800, y: 140, config: {} },
        { id: 'fn_5', type: 'integration', subType: 'export_to_video', label: 'Push to Video Storyboard', x: 1040, y: 140, config: {} },
      ],
      edges: [
        { id: 'fe_1', sourceNodeId: 'fn_1', targetNodeId: 'fn_2' },
        { id: 'fe_2', sourceNodeId: 'fn_2', targetNodeId: 'fn_3' },
        { id: 'fe_3', sourceNodeId: 'fn_3', targetNodeId: 'fn_4', label: 'Requires Sign-off' },
        { id: 'fe_4', sourceNodeId: 'fn_4', targetNodeId: 'fn_5', label: 'Unlocked on Approval' },
      ],
    };
  }
}
