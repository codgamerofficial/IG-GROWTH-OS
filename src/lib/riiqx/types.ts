// =============================================================================
// RIIQX — Master Data Types & Domain Contracts
// One Goal. An AI That Gets It Done.
// =============================================================================

export interface RiiqxSearchCitation {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  confidenceScore: number;
}

export interface RiiqxDocument {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  extractedText: string;
  isSanitized: boolean;
  uploadedAt: string;
}

export interface RiiqxTaskStep {
  id: string;
  order: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed';
  requiresPermission: boolean;
  permissionGranted?: boolean;
  toolUsed?: string;
  output?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface RiiqxTaskPlan {
  id: string;
  goal: string;
  steps: RiiqxTaskStep[];
  status: 'planning' | 'awaiting_permission' | 'executing' | 'completed' | 'failed' | 'halted';
  currentStepIndex: number;
  totalSteps: number;
  createdAt: string;
  updatedAt: string;
}

export interface RiiqxMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  citations?: RiiqxSearchCitation[];
  taskPlan?: RiiqxTaskPlan;
  tokensEstimated?: number;
}

export interface RiiqxConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: RiiqxMessage[];
  projectId?: string;
  isPinned?: boolean;
}

export interface RiiqxProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  customInstructions?: string;
}
