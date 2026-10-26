'use client';

// =============================================================================
// NUVEXA AI — Master State & Application Context Provider
// Type-Safe • Reactive • Multi-Model • Zero-Fabrication Health Tracking
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { NuvexaConversation, NuvexaMessage, NuvexaProject, NuvexaTaskPlan, NuvexaDocument } from '@/lib/nuvexa/types';
import { NUVEXA_MODELS, NuvexaModel, ProviderHealth } from '@/lib/nuvexa/models';
import { NuvexaUser, getDefaultUser } from '@/lib/nuvexa/auth';

export type NuvexaViewTab =
  | 'chat'
  | 'creator'
  | 'autopilot'
  | 'research'
  | 'code'
  | 'tasks'
  | 'analytics'
  | 'settings';

interface NuvexaContextType {
  // Navigation & View
  activeTab: NuvexaViewTab;
  setActiveTab: (tab: NuvexaViewTab) => void;

  // Identity & Session
  user: NuvexaUser;
  setUser: (user: NuvexaUser) => void;

  // Models & Health
  models: NuvexaModel[];
  selectedModel: NuvexaModel;
  setSelectedModel: (model: NuvexaModel) => void;
  providerHealth: {
    ollama: ProviderHealth;
    openaiCompatible: ProviderHealth;
    bedrock?: ProviderHealth;
  } | null;
  refreshHealth: () => Promise<void>;

  // Projects & Conversations
  projects: NuvexaProject[];
  activeProject: NuvexaProject | null;
  setActiveProject: (proj: NuvexaProject | null) => void;
  conversations: NuvexaConversation[];
  activeConversation: NuvexaConversation | null;
  setActiveConversation: (conv: NuvexaConversation | null) => void;
  createNewConversation: (projectId?: string) => NuvexaConversation;

  // Streaming & Message Action
  isGenerating: boolean;
  sendMessage: (content: string) => Promise<void>;
  cancelGeneration: () => void;

  // Features & Capabilities
  enableWebSearch: boolean;
  setEnableWebSearch: (val: boolean) => void;
  attachedDocuments: NuvexaDocument[];
  addAttachedDocument: (doc: NuvexaDocument) => void;
  removeAttachedDocument: (docId: string) => void;

  // Task Planner
  tasks: NuvexaTaskPlan[];
  activeTask: NuvexaTaskPlan | null;
  setActiveTask: (task: NuvexaTaskPlan | null) => void;
  createTask: (goal: string) => Promise<void>;
  advanceTask: (taskId: string, permissionGranted?: boolean) => Promise<void>;

  // Permission Prompt Modal
  pendingPermission: {
    isOpen: boolean;
    stepTitle: string;
    description: string;
    toolName: string;
    onApprove: () => void;
    onDeny: () => void;
  } | null;
  closePermissionModal: () => void;

  // Privacy & Data
  exportData: () => void;
  wipeData: () => Promise<void>;
}

const NuvexaContext = createContext<NuvexaContextType | null>(null);

export function NuvexaProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<NuvexaViewTab>('chat');
  const [user, setUser] = useState<NuvexaUser>(getDefaultUser());
  const [models] = useState<NuvexaModel[]>(NUVEXA_MODELS);
  const [selectedModel, setSelectedModel] = useState<NuvexaModel>(NUVEXA_MODELS[0]);
  const [providerHealth, setProviderHealth] = useState<{
    ollama: ProviderHealth;
    openaiCompatible: ProviderHealth;
    bedrock?: ProviderHealth;
  } | null>(null);

  const [projects] = useState<NuvexaProject[]>([
    {
      id: 'prj_starter_research',
      userId: 'usr_local_dev_01',
      title: 'Open Source Intelligence',
      description: 'AI model exploration, architecture designs, and local inference testing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: '#06B6D4',
      icon: 'Terminal',
    },
  ]);
  const [activeProject, setActiveProject] = useState<NuvexaProject | null>(projects[0]);

  const [conversations, setConversations] = useState<NuvexaConversation[]>([
    {
      id: 'conv_welcome_nuvexa',
      projectId: 'prj_starter_research',
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

NUVEXA is a production-oriented, open-source multi-model platform designed for private computing and zero proprietary vendor lock-in.

#### 🛡️ Active Safeguards & System Highlights
- **Local & Open-Weight First:** Connects directly to **Ollama** (\`llama3.2\`, \`mistral\`, \`qwen2.5-coder\`, \`deepseek-r1\`) with zero fake availability.
- **Untrusted Document Sandbox:** Parse PDFs, Markdown, and Code wrapped in security markers to prevent prompt injection.
- **Live Research with Citations:** Real search queries through SearXNG/Open-Web with verifiable source URLs and citation markers.
- **Autonomous Task Planner:** Step-by-step task decomposition with an explicit user permission prompt before high-consequence operations.
- **100% Non-Firebase Architecture:** Isolated local sessions, cryptographic PBKDF2 hashing, and full JSON data export.

Select a model above or enter a prompt below to begin.`,
          createdAt: new Date().toISOString(),
          modelUsed: 'Nuvexa System',
        },
      ],
    },
  ]);
  const [activeConversation, setActiveConversation] = useState<NuvexaConversation | null>(conversations[0]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [attachedDocuments, setAttachedDocuments] = useState<NuvexaDocument[]>([]);

  const [tasks, setTasks] = useState<NuvexaTaskPlan[]>([]);
  const [activeTask, setActiveTask] = useState<NuvexaTaskPlan | null>(null);

  const [pendingPermission, setPendingPermission] = useState<{
    isOpen: boolean;
    stepTitle: string;
    description: string;
    toolName: string;
    onApprove: () => void;
    onDeny: () => void;
  } | null>(null);

  // Health probe fetcher
  const refreshHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/nuvexa/models');
      if (res.ok) {
        const data = await res.json();
        if (data.health) {
          setProviderHealth(data.health);
        }
      }
    } catch {
      // offline
    }
  }, []);

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 12000);
    return () => clearInterval(interval);
  }, [refreshHealth]);

  // Create new conversation
  const createNewConversation = useCallback(
    (projectId?: string): NuvexaConversation => {
      const newConv: NuvexaConversation = {
        id: `conv_${Date.now()}`,
        projectId: projectId || activeProject?.id,
        userId: user.id,
        title: 'New Conversation',
        modelId: selectedModel.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
        tags: [],
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversation(newConv);
      setActiveTab('chat');
      return newConv;
    },
    [activeProject, user.id, selectedModel.id]
  );

  // Send message with streaming
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isGenerating) return;

      let conv = activeConversation;
      if (!conv) {
        conv = createNewConversation();
      }

      const userMsg: NuvexaMessage = {
        id: `msg_u_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      const assistantMsgId = `msg_a_${Date.now()}`;
      const assistantMsgPlaceholder: NuvexaMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
        isStreaming: true,
        modelUsed: selectedModel.name,
      };

      const updatedMessages = [...conv.messages, userMsg];

      // Update conversation title if first message
      const convTitle =
        conv.messages.length === 0
          ? content.length > 28
            ? content.slice(0, 26) + '...'
            : content
          : conv.title;

      const workingConv: NuvexaConversation = {
        ...conv,
        title: convTitle,
        updatedAt: new Date().toISOString(),
        messages: [...updatedMessages, assistantMsgPlaceholder],
      };

      setActiveConversation(workingConv);
      setConversations((prev) => prev.map((c) => (c.id === workingConv.id ? workingConv : c)));
      setIsGenerating(true);

      const controller = new AbortController();
      setAbortController(controller);

      try {
        const docContext = attachedDocuments.map((d) => d.extractedText).join('\n\n');

        const res = await fetch('/api/nuvexa/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            modelId: selectedModel.id,
            enableWebSearch,
            documentContext: docContext,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP Error ${res.status}`);
        }

        if (!res.body) {
          throw new Error('Readable stream not supported');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.type === 'chunk') {
                  accumulated += parsed.content;
                } else if (parsed.type === 'citations') {
                  accumulated += parsed.content;
                }

                // Update assistant message state
                setActiveConversation((prev) => {
                  if (!prev) return null;
                  const msgs = prev.messages.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: accumulated } : m
                  );
                  return { ...prev, messages: msgs };
                });
              } catch {
                // partial JSON frame
              }
            }
          }
        }
      } catch (err: unknown) {
        const errorText = err instanceof Error ? err.message : 'Prompt interrupted';
        setActiveConversation((prev) => {
          if (!prev) return null;
          const msgs = prev.messages.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content:
                    m.content ||
                    `> ⚠️ **Error:** Generation was interrupted or aborted (${errorText}).`,
                  isStreaming: false,
                }
              : m
          );
          return { ...prev, messages: msgs };
        });
      } finally {
        setIsGenerating(false);
        setAbortController(null);
        setActiveConversation((prev) => {
          if (!prev) return null;
          const msgs = prev.messages.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          );
          const finalConv = { ...prev, messages: msgs };
          setConversations((all) => all.map((c) => (c.id === finalConv.id ? finalConv : c)));
          return finalConv;
        });
      }
    },
    [activeConversation, createNewConversation, isGenerating, selectedModel, enableWebSearch, attachedDocuments]
  );

  const cancelGeneration = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setIsGenerating(false);
      setAbortController(null);
    }
  }, [abortController]);

  // Documents
  const addAttachedDocument = useCallback((doc: NuvexaDocument) => {
    setAttachedDocuments((prev) => [...prev, doc]);
  }, []);

  const removeAttachedDocument = useCallback((docId: string) => {
    setAttachedDocuments((prev) => prev.filter((d) => d.id !== docId));
  }, []);

  // Tasks
  const createTask = useCallback(async (goal: string) => {
    try {
      const res = await fetch('/api/nuvexa/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', goal }),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks((prev) => [data.task, ...prev]);
        setActiveTask(data.task);
        setActiveTab('tasks');
      }
    } catch {
      // task creation failed
    }
  }, []);

  const advanceTask = useCallback(async (taskId: string, permissionGranted?: boolean) => {
    try {
      const res = await fetch('/api/nuvexa/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'advance', taskId, permissionGranted }),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.task as NuvexaTaskPlan;
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setActiveTask(updated);

        if (data.actionRequired === 'permission') {
          const step = updated.steps[updated.currentStepIndex];
          setPendingPermission({
            isOpen: true,
            stepTitle: step.title,
            description: step.description,
            toolName: step.toolName || 'system_tool',
            onApprove: () => {
              setPendingPermission(null);
              advanceTask(taskId, true);
            },
            onDeny: () => {
              setPendingPermission(null);
            },
          });
        }
      }
    } catch {
      // task advance failed
    }
  }, []);

  const closePermissionModal = useCallback(() => {
    setPendingPermission(null);
  }, []);

  // Export & Wipe Data
  const exportData = useCallback(() => {
    window.open('/api/nuvexa/export', '_blank');
  }, []);

  const wipeData = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete all conversations, tasks, and data? This action cannot be undone.')) {
      try {
        const res = await fetch('/api/nuvexa/auth', { method: 'DELETE' });
        if (res.ok) {
          setConversations([]);
          setActiveConversation(null);
          setTasks([]);
          setActiveTask(null);
          setAttachedDocuments([]);
          alert('All user data wiped successfully.');
        }
      } catch {
        alert('Failed to delete data.');
      }
    }
  }, []);

  return (
    <NuvexaContext.Provider
      value={{
        activeTab,
        setActiveTab,
        user,
        setUser,
        models,
        selectedModel,
        setSelectedModel,
        providerHealth,
        refreshHealth,
        projects,
        activeProject,
        setActiveProject,
        conversations,
        activeConversation,
        setActiveConversation,
        createNewConversation,
        isGenerating,
        sendMessage,
        cancelGeneration,
        enableWebSearch,
        setEnableWebSearch,
        attachedDocuments,
        addAttachedDocument,
        removeAttachedDocument,
        tasks,
        activeTask,
        setActiveTask,
        createTask,
        advanceTask,
        pendingPermission,
        closePermissionModal,
        exportData,
        wipeData,
      }}
    >
      {children}
    </NuvexaContext.Provider>
  );
}

export function useNuvexa() {
  const context = useContext(NuvexaContext);
  if (!context) {
    throw new Error('useNuvexa must be used within a NuvexaProvider');
  }
  return context;
}
