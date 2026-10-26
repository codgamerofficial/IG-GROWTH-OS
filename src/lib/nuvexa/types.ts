// =============================================================================
// NUVEXA AI — Master System Types & Protocol Definitions
// Production-Oriented • Type-Safe • Progressive AI Assistant
// =============================================================================

import { NuvexaModel } from './models';
import { NuvexaUser } from './auth';

export type TaskStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface NuvexaCitation {
  id: number;
  url: string;
  title: string;
  snippet: string;
  sourceDomain: string;
}

export interface NuvexaMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  createdAt: string;
  modelUsed?: string;
  tokensEstimated?: number;
  citations?: NuvexaCitation[];
  thinkingTrace?: string;
  isStreaming?: boolean;
  toolCalls?: {
    toolName: string;
    input: Record<string, unknown>;
    output?: unknown;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
  }[];
}

export interface NuvexaConversation {
  id: string;
  projectId?: string;
  userId: string;
  title: string;
  modelId: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  messages: NuvexaMessage[];
  tags: string[];
}

export interface NuvexaProject {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  icon?: string;
  customInstructions?: string;
}

export interface NuvexaSubTask {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: TaskStatus;
  requiresPermission: boolean;
  permissionGranted?: boolean;
  toolName?: string;
  outputLog?: string[];
  errorMessage?: string;
}

export interface NuvexaTaskPlan {
  id: string;
  userId: string;
  title: string;
  goal: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  steps: NuvexaSubTask[];
  currentStepIndex: number;
  canRetry: boolean;
}

export interface NuvexaDocument {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  extractedText: string;
  summary?: string;
  isUntrusted: boolean;
  sanitized: boolean;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  relevanceScore?: number;
}
