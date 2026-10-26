'use client';

// =============================================================================
// RIIQX — Master State & Application Context Provider
// Type-Safe • Reactive • Online-First • AWS Bedrock & Multi-Model
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RiiqxConversation, RiiqxMessage, RiiqxProject, RiiqxTaskPlan, RiiqxDocument } from '@/lib/riiqx/types';
import { RIIQX_MODELS, RiiqxModel, ProviderHealth } from '@/lib/riiqx/models';
import { RiiqxUser, getDefaultUser } from '@/lib/riiqx/auth';
import {
  loadConversationsFromStorage,
  saveConversationsToStorage,
  loadProjectsFromStorage,
  saveProjectsToStorage,
  exportFullWorkspaceData,
  wipeAllWorkspaceData,
} from '@/lib/riiqx/storage';

export type RiiqxViewTab =
  | 'chat'
  | 'creator'
  | 'autopilot'
  | 'tasks'
  | 'research'
  | 'code'
  | 'analytics'
  | 'settings';

interface RiiqxContextType {
  // Navigation & View
  activeTab: RiiqxViewTab;
  setActiveTab: (tab: RiiqxViewTab) => void;

  // Identity & Session
  user: RiiqxUser;
  setUser: (user: RiiqxUser) => void;

  // Models & Health
  models: RiiqxModel[];
  selectedModel: RiiqxModel;
  setSelectedModel: (model: RiiqxModel) => void;
  providerHealth: {
    bedrock?: ProviderHealth;
    agentrouter?: ProviderHealth;
    ollama?: ProviderHealth;
  } | null;
  refreshHealth: () => Promise<void>;

  // Projects & Conversations
  projects: RiiqxProject[];
  activeProject: RiiqxProject | null;
  setActiveProject: (proj: RiiqxProject | null) => void;
  conversations: RiiqxConversation[];
  activeConversation: RiiqxConversation | null;
  setActiveConversation: (conv: RiiqxConversation | null) => void;
  createNewConversation: (projectId?: string) => RiiqxConversation;

  // Streaming & Message Action
  isGenerating: boolean;
  sendMessage: (content: string) => Promise<void>;
  cancelGeneration: () => void;

  // Features & Capabilities
  enableWebSearch: boolean;
  setEnableWebSearch: (val: boolean) => void;
  attachedDocuments: RiiqxDocument[];
  addAttachedDocument: (doc: RiiqxDocument) => void;
  removeAttachedDocument: (docId: string) => void;

  // Task Planner Modal Gate
  pendingPermissionTask: { stepId: string; description: string } | null;
  grantPermission: () => void;
  denyPermission: () => void;

  // Data Governance
  exportData: () => string;
  wipeData: () => void;
}

const RiiqxContext = createContext<RiiqxContextType | undefined>(undefined);

export function RiiqxProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<RiiqxViewTab>('chat');
  const [user, setUser] = useState<RiiqxUser>(getDefaultUser());
  const [models] = useState<RiiqxModel[]>(RIIQX_MODELS);
  const [selectedModel, setSelectedModel] = useState<RiiqxModel>(RIIQX_MODELS[0]); // Default: AWS Bedrock Claude Sonnet
  const [providerHealth, setProviderHealth] = useState<{
    bedrock?: ProviderHealth;
    agentrouter?: ProviderHealth;
    ollama?: ProviderHealth;
  } | null>(null);

  const [projects, setProjects] = useState<RiiqxProject[]>([
    {
      id: 'prj_starter_intel',
      userId: 'usr_riiqx_primary',
      title: 'Enterprise AI Strategy',
      description: 'Online agent execution, AWS Bedrock integration, and autonomous content generation.',
      color: '#06B6D4',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [activeProject, setActiveProject] = useState<RiiqxProject | null>(projects[0]);

  const [conversations, setConversations] = useState<RiiqxConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<RiiqxConversation | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [attachedDocuments, setAttachedDocuments] = useState<RiiqxDocument[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [pendingPermissionTask, setPendingPermissionTask] = useState<{
    stepId: string;
    description: string;
  } | null>(null);

  const refreshHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/riiqx/models');
      if (res.ok) {
        const data = await res.json();
        if (data.health) {
          setProviderHealth(data.health);
        }
      }
    } catch {
      // Backend probe handled
    }
  }, []);

  // Initialize Storage & Health Probes on Mount
  useEffect(() => {
    const loadedConversations = loadConversationsFromStorage();
    const loadedProjects = loadProjectsFromStorage();

    if (loadedProjects.length > 0) {
      setProjects(loadedProjects);
      setActiveProject(loadedProjects[0]);
    }

    if (loadedConversations.length > 0) {
      setConversations(loadedConversations);
      setActiveConversation(loadedConversations[0]);
    } else {
      const initialConv: RiiqxConversation = {
        id: `conv_${Date.now()}`,
        title: 'Welcome to RIIQX',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_welcome_${Date.now()}`,
            role: 'assistant',
            content: `**Welcome to RIIQX — One Goal. An AI That Gets It Done.**\n\nI am your online-first autonomous intelligence platform. Here is how we execute:\n\n- **Online-First Cloud AI:** Powered directly by **AWS Bedrock Runtime** (\`au.anthropic.claude-sonnet-4-6\`) in region \`ap-southeast-2\`. Zero local setup required.\n- **Autonomous 9:16 Creator Studio:** Script, storyboard, and render vertical videos for Instagram Reels and YouTube Shorts with safe-margins checking.\n- **Level 3 Social Autopilot:** Continuous queue with automated posting rules, retry buffers, and an instant Emergency STOP circuit breaker.\n- **Multi-Step Task Planner:** Decompose complex projects into sequential milestones with explicit authorization prompts before any consequential action.\n\nType your goal below or select a workspace to get started.`,
            timestamp: new Date().toISOString(),
            modelUsed: selectedModel.name,
          },
        ],
      };
      setConversations([initialConv]);
      setActiveConversation(initialConv);
      saveConversationsToStorage([initialConv]);
    }

    refreshHealth();
  }, [refreshHealth, selectedModel.name]);

  const createNewConversation = useCallback(
    (projectId?: string): RiiqxConversation => {
      const newConv: RiiqxConversation = {
        id: `conv_${Date.now()}`,
        title: 'New Goal Discussion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        projectId: projectId || activeProject?.id,
      };

      setConversations((prev) => {
        const updated = [newConv, ...prev];
        saveConversationsToStorage(updated);
        return updated;
      });
      setActiveConversation(newConv);
      return newConv;
    },
    [activeProject]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isGenerating) return;

      let currentConv = activeConversation;
      if (!currentConv) {
        currentConv = createNewConversation();
      }

      const userMsg: RiiqxMessage = {
        id: `msg_usr_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const assistantMsgId = `msg_ast_${Date.now()}`;
      const initialAssistantMsg: RiiqxMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        modelUsed: selectedModel.name,
      };

      const updatedMessages = [...currentConv.messages, userMsg, initialAssistantMsg];
      const updatedConv: RiiqxConversation = {
        ...currentConv,
        title:
          currentConv.messages.length === 0
            ? content.slice(0, 36) + (content.length > 36 ? '...' : '')
            : currentConv.title,
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      };

      setActiveConversation(updatedConv);
      setConversations((prev) => {
        const list = prev.map((c) => (c.id === updatedConv.id ? updatedConv : c));
        saveConversationsToStorage(list);
        return list;
      });

      setIsGenerating(true);
      const controller = new AbortController();
      setAbortController(controller);

      try {
        const payload = {
          modelId: selectedModel.id,
          provider: selectedModel.provider,
          messages: updatedMessages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
          enableWebSearch,
          documents: attachedDocuments,
        };

        const res = await fetch('/api/riiqx/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Inference returned HTTP ${res.status}`);
        }

        const data = await res.json();
        const replyText = data.reply || data.error || 'Execution finished.';

        setActiveConversation((prev) => {
          if (!prev) return null;
          const msgs = prev.messages.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: replyText,
                  citations: data.citations || [],
                  taskPlan: data.taskPlan || undefined,
                  tokensEstimated: data.tokensEstimated || 50,
                }
              : m
          );
          const finalConv = { ...prev, messages: msgs };
          setConversations((all) => {
            const list = all.map((c) => (c.id === finalConv.id ? finalConv : c));
            saveConversationsToStorage(list);
            return list;
          });
          return finalConv;
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Handled cancellation
        } else {
          const errorText =
            err instanceof Error ? err.message : 'Unknown network connection failure';
          setActiveConversation((prev) => {
            if (!prev) return null;
            const msgs = prev.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: `> ⚠️ **RIIQX Service Error:** ${errorText}\n> Please check provider connection in Settings or try again.`,
                  }
                : m
            );
            return { ...prev, messages: msgs };
          });
        }
      } finally {
        setIsGenerating(false);
        setAbortController(null);
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

  const addAttachedDocument = useCallback((doc: RiiqxDocument) => {
    setAttachedDocuments((prev) => [...prev, doc]);
  }, []);

  const removeAttachedDocument = useCallback((docId: string) => {
    setAttachedDocuments((prev) => prev.filter((d) => d.id !== docId));
  }, []);

  const grantPermission = useCallback(() => {
    setPendingPermissionTask(null);
  }, []);

  const denyPermission = useCallback(() => {
    setPendingPermissionTask(null);
  }, []);

  const exportData = useCallback(() => exportFullWorkspaceData(), []);
  const wipeData = useCallback(() => {
    wipeAllWorkspaceData();
    setConversations([]);
    setActiveConversation(null);
  }, []);

  return (
    <RiiqxContext.Provider
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
        pendingPermissionTask,
        grantPermission,
        denyPermission,
        exportData,
        wipeData,
      }}
    >
      {children}
    </RiiqxContext.Provider>
  );
}

export function useRiiqx() {
  const context = useContext(RiiqxContext);
  if (!context) {
    throw new Error('useRiiqx must be used within a RiiqxProvider');
  }
  return context;
}
