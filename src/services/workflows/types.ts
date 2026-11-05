// =============================================================================
// RIIQX — Master AI Workflow Builder Types
// Node Graph • Natural Language Synthesis • Human Checkpoints • Execution Logs
// =============================================================================

export type WorkflowNodeType =
  | 'trigger'
  | 'ai_action'
  | 'logic'
  | 'integration'
  | 'human_approval';

export type WorkflowTriggerType = 'manual' | 'schedule' | 'new_asset' | 'social_event';

export type NodeExecutionStatus =
  | 'idle'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused_for_approval';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  subType: string;
  label: string;
  description?: string;
  x: number;
  y: number;
  config: Record<string, any>;
  status?: NodeExecutionStatus;
  lastExecution?: {
    startedAt?: string;
    completedAt?: string;
    durationMs?: number;
    input?: any;
    output?: any;
    error?: string;
  };
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTriggerType;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionLogItem {
  timestamp: string;
  nodeId: string;
  message: string;
  level: 'info' | 'warn' | 'error';
}

export interface WorkflowExecutionRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'waiting_approval';
  currentNodeId?: string;
  nodeStates: Record<string, { status: NodeExecutionStatus; output?: any; error?: string }>;
  logs: ExecutionLogItem[];
  startedAt: string;
  completedAt?: string;
}
