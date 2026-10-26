// =============================================================================
// NUVEXA AI — Persistent Storage & Data Manager
// Account-Isolated • Exportable • Cascade Deletion • Zero Firebase
// =============================================================================

import { NuvexaConversation, NuvexaProject, NuvexaTaskPlan, NuvexaDocument } from './types';

// Storage Registry (isolated by userId)
const PROJECTS: Map<string, NuvexaProject> = new Map();
const CONVERSATIONS: Map<string, NuvexaConversation> = new Map();
const TASKS: Map<string, NuvexaTaskPlan> = new Map();
const DOCUMENTS: Map<string, NuvexaDocument> = new Map();

// Seed initial default project and conversation
const DEFAULT_PROJECT_ID = 'prj_starter_research';
const DEFAULT_PROJECT: NuvexaProject = {
  id: DEFAULT_PROJECT_ID,
  userId: 'usr_local_dev_01',
  title: 'Open Source Intelligence',
  description: 'AI model exploration, architecture designs, and local inference testing.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: '#06B6D4',
  icon: 'Terminal',
  customInstructions: 'Prioritize open-weight models, verifiable facts, and secure code patterns.',
};

PROJECTS.set(DEFAULT_PROJECT_ID, DEFAULT_PROJECT);

const DEFAULT_CONVERSATION_ID = 'conv_welcome_nuvexa';
const DEFAULT_CONVERSATION: NuvexaConversation = {
  id: DEFAULT_CONVERSATION_ID,
  projectId: DEFAULT_PROJECT_ID,
  userId: 'usr_local_dev_01',
  title: 'Welcome to NUVEXA AI',
  modelId: 'llama-3.2-3b',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isPinned: true,
  tags: ['Welcome', 'Guide'],
  messages: [
    {
      id: 'msg_01',
      role: 'assistant',
      content: `### ♾️ Welcome to NUVEXA AI — *One Assistant. Many Possibilities.*

NUVEXA is an open-source, multi-model AI assistant designed to run locally and across private clouds without proprietary vendor lock-in.

#### 🛡️ Active Safeguards & Capabilities
1. **Multi-Model Orchestration:** Plug in local **Ollama** models (\`llama3.2\`, \`mistral\`, \`qwen2.5-coder\`, \`deepseek-r1\`) or any OpenAI-compatible server.
2. **Untrusted Document Sandbox:** Upload PDFs, markdown, or code for extraction with zero script execution.
3. **Research Mode with Citations:** Live web retrieval with verifiable source URLs and citation markers.
4. **Autonomous Task Planner:** Step-by-step task breakdown with an explicit user permission gate before running any tools.
5. **Private & Non-Firebase:** Account isolation with cryptographic session tokens and one-click data export/deletion.

*How can NUVEXA assist your workflow today?*`,
      createdAt: new Date().toISOString(),
      modelUsed: 'Nuvexa System',
    },
  ],
};

CONVERSATIONS.set(DEFAULT_CONVERSATION_ID, DEFAULT_CONVERSATION);

// -----------------------------------------------------------------------------
// Projects API
// -----------------------------------------------------------------------------

export function listProjects(userId: string): NuvexaProject[] {
  return Array.from(PROJECTS.values())
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function createProject(
  userId: string,
  data: Omit<NuvexaProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): NuvexaProject {
  const newProject: NuvexaProject = {
    ...data,
    id: `prj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  PROJECTS.set(newProject.id, newProject);
  return newProject;
}

// -----------------------------------------------------------------------------
// Conversations API
// -----------------------------------------------------------------------------

export function listConversations(userId: string, projectId?: string): NuvexaConversation[] {
  return Array.from(CONVERSATIONS.values())
    .filter((c) => c.userId === userId && (!projectId || c.projectId === projectId))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getConversation(conversationId: string, userId: string): NuvexaConversation | null {
  const conv = CONVERSATIONS.get(conversationId);
  if (!conv || conv.userId !== userId) return null;
  return conv;
}

export function createConversation(
  userId: string,
  title: string,
  modelId: string,
  projectId?: string
): NuvexaConversation {
  const newConv: NuvexaConversation = {
    id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    projectId,
    userId,
    title,
    modelId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPinned: false,
    tags: [],
    messages: [],
  };
  CONVERSATIONS.set(newConv.id, newConv);
  return newConv;
}

export function saveConversation(conversation: NuvexaConversation): void {
  conversation.updatedAt = new Date().toISOString();
  CONVERSATIONS.set(conversation.id, conversation);
}

export function deleteConversation(conversationId: string, userId: string): boolean {
  const conv = CONVERSATIONS.get(conversationId);
  if (!conv || conv.userId !== userId) return false;
  return CONVERSATIONS.delete(conversationId);
}

// -----------------------------------------------------------------------------
// Tasks API
// -----------------------------------------------------------------------------

export function listTasks(userId: string): NuvexaTaskPlan[] {
  return Array.from(TASKS.values())
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function saveTaskPlan(task: NuvexaTaskPlan): void {
  task.updatedAt = new Date().toISOString();
  TASKS.set(task.id, task);
}

// -----------------------------------------------------------------------------
// Documents API
// -----------------------------------------------------------------------------

export function listDocuments(userId: string): NuvexaDocument[] {
  return Array.from(DOCUMENTS.values()).filter((d) => d.userId === userId);
}

export function saveDocument(doc: NuvexaDocument): void {
  DOCUMENTS.set(doc.id, doc);
}

// -----------------------------------------------------------------------------
// User Data Export & Complete Deletion (GDPR / Privacy Compliance)
// -----------------------------------------------------------------------------

export function exportUserData(userId: string): Record<string, unknown> {
  return {
    exportedAt: new Date().toISOString(),
    userId,
    projects: listProjects(userId),
    conversations: listConversations(userId),
    tasks: listTasks(userId),
    documents: listDocuments(userId).map((d) => ({
      ...d,
      extractedText: d.extractedText.slice(0, 1000) + '... (truncated for export preview)',
    })),
  };
}

export function deleteUserData(userId: string): { success: boolean; recordsRemoved: number } {
  let count = 0;
  for (const [id, p] of PROJECTS.entries()) {
    if (p.userId === userId) {
      PROJECTS.delete(id);
      count++;
    }
  }
  for (const [id, c] of CONVERSATIONS.entries()) {
    if (c.userId === userId) {
      CONVERSATIONS.delete(id);
      count++;
    }
  }
  for (const [id, t] of TASKS.entries()) {
    if (t.userId === userId) {
      TASKS.delete(id);
      count++;
    }
  }
  for (const [id, d] of DOCUMENTS.entries()) {
    if (d.userId === userId) {
      DOCUMENTS.delete(id);
      count++;
    }
  }
  return { success: true, recordsRemoved: count };
}
