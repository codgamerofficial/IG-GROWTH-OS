'use client';

// =============================================================================
// RIIQX — Master State & Application Context Provider
// Type-Safe • Reactive • Online-First • AWS Bedrock & Multi-Model
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RiiqxConversation, RiiqxMessage, RiiqxProject, RiiqxTaskPlan, RiiqxDocument, RiiqxSearchCitation } from '@/lib/riiqx/types';
import { RIIQX_MODELS, RiiqxModel, ProviderHealth } from '@/lib/riiqx/models';
import { RiiqxUser, getDefaultUser } from '@/lib/riiqx/user';
import { supabase } from '@/lib/supabase/client';
import {
  loadConversationsFromStorage,
  saveConversationsToStorage,
  loadProjectsFromStorage,
  saveProjectsToStorage,
  exportFullWorkspaceData,
  wipeAllWorkspaceData,
} from '@/lib/riiqx/storage';

export type RiiqxViewTab =
  | 'home'
  | 'chat'
  | 'creator'
  | 'editor'
  | 'autopilot'
  | 'tasks'
  | 'research'
  | 'code'
  | 'integrations'
  | 'files'
  | 'analytics'
  | 'settings';

interface RiiqxContextType {
  // Navigation & View
  activeTab: RiiqxViewTab;
  setActiveTab: (tab: RiiqxViewTab) => void;

  // Visual Theme (Light/Dark)
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Right Contextual AI Drawer
  isAiDrawerOpen: boolean;
  toggleAiDrawer: () => void;
  setIsAiDrawerOpen: (open: boolean) => void;

  // Global Quick Prompt / Task Handoff
  globalPrompt: string;
  setGlobalPrompt: (val: string) => void;
  executeGlobalTask: (prompt: string, targetTab?: RiiqxViewTab) => void;

  // Identity & Session
  user: RiiqxUser;
  setUser: (user: RiiqxUser) => void;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; preferredLanguage?: 'en' | 'bn' | 'hi'; avatarUrl?: string }) => Promise<void>;

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
  retryLastMessage: () => Promise<void>;
  clearCurrentConversation: () => void;
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
  const [activeTab, setActiveTab] = useState<RiiqxViewTab>('home');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [globalPrompt, setGlobalPrompt] = useState<string>('');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  const toggleAiDrawer = useCallback(() => {
    setIsAiDrawerOpen((prev) => !prev);
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('riiqx_theme', newTheme);
      } catch {}
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('riiqx_theme') as 'light' | 'dark' | null;
        if (saved === 'dark' || saved === 'light') {
          setTheme(saved);
        }
      } catch {}
    }
  }, [setTheme]);

  const executeGlobalTask = useCallback((prompt: string, targetTab?: RiiqxViewTab) => {
    setGlobalPrompt(prompt);
    if (targetTab) {
      setActiveTab(targetTab);
    } else {
      setActiveTab('chat');
    }
  }, []);

  const [user, setUser] = useState<RiiqxUser>(getDefaultUser());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.profile?.displayName || data.user.name || data.user.email.split('@')[0],
            role: data.profile?.role || data.user.role || 'creator',
            createdAt: data.user.createdAt || new Date().toISOString(),
            preferences: {
              theme: (typeof window !== 'undefined' && localStorage.getItem('riiqx_theme') as 'dark' | 'midnight') || 'dark',
              defaultLanguage: (data.profile?.preferredLanguage as 'en' | 'bn' | 'hi') || 'en',
              autoSave: true,
              streamResponses: true,
            },
          });
          return;
        }
      }
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      await supabase.auth.signOut();
    } catch {
      // Proceed with local signout
    }
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }, []);

  const updateUserProfile = useCallback(
    async (data: { displayName?: string; preferredLanguage?: 'en' | 'bn' | 'hi'; avatarUrl?: string }) => {
      try {
        const res = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const result = await res.json();
          if (result.profile) {
            setUser((prev) => ({
              ...prev,
              name: result.profile.displayName || prev.name,
              preferences: {
                ...prev.preferences,
                defaultLanguage: (result.profile.preferredLanguage as 'en' | 'bn' | 'hi') || prev.preferences.defaultLanguage,
              },
            }));
          }
        }
      } catch (err) {
        console.error('Failed to update profile:', err);
      }
    },
    []
  );

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

  // Initialize Storage, Real Session & Health Probes on Mount
  useEffect(() => {
    refreshSession();

    // Real-time Supabase auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        refreshSession();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    const loadedConversations = loadConversationsFromStorage();
    const loadedProjects = loadProjectsFromStorage();

    if (loadedProjects.length > 0) {
      setProjects(loadedProjects);
      setActiveProject(loadedProjects[0]);
    }

    if (loadedConversations.length > 0) {
      // Purge any corrupted or empty placeholder assistant messages from past sessions
      const cleaned = loadedConversations.map((c) => ({
        ...c,
        messages: c.messages.filter(
          (m) => m.content && typeof m.content === 'string' && m.content.trim().length > 0
        ),
      }));

      const activeList = cleaned.filter((c) => c.messages.length > 0);
      if (activeList.length > 0) {
        setConversations(activeList);
        setActiveConversation(activeList[0]);
        saveConversationsToStorage(activeList);
      } else {
        createDefaultWelcomeConv();
      }
    } else {
      createDefaultWelcomeConv();
    }

    function createDefaultWelcomeConv() {
      const initialConv: RiiqxConversation = {
        id: `conv_${Date.now()}`,
        title: 'Welcome to RIIQX',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_welcome_${Date.now()}`,
            role: 'assistant',
            content: `**Welcome to RIIQX — One Goal. An AI That Gets It Done.**\n\nI am your online-first autonomous intelligence platform. Here is how we execute:\n\n- **Online-First Cloud AI:** High-precision reasoning via **Llama 3.3 70B** and **DeepSeek Chat V3** with multi-cloud redundancy.\n- **Autonomous 9:16 Creator Studio:** Script, storyboard, and render vertical videos for Instagram Reels and YouTube Shorts with safe-margins checking.\n- **Level 3 Social Autopilot:** Continuous queue with automated posting rules, retry buffers, and an instant Emergency STOP circuit breaker.\n- **Multi-Step Task Planner:** Decompose complex projects into sequential milestones with explicit authorization prompts before any consequential action.\n\nType your goal below or select a workspace to get started.`,
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

  const clearCurrentConversation = useCallback(() => {
    if (!activeConversation) return;
    const cleared: RiiqxConversation = {
      ...activeConversation,
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setActiveConversation(cleared);
    setConversations((prev) => {
      const list = prev.map((c) => (c.id === cleared.id ? cleared : c));
      saveConversationsToStorage(list);
      return list;
    });
  }, [activeConversation]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isGenerating) return;

      let currentConv = activeConversation;
      if (!currentConv) {
        currentConv = createNewConversation();
      }

      // Filter out any prior empty messages before adding the new user message
      const sanitizedHistory = currentConv.messages.filter(
        (m) => m.content && typeof m.content === 'string' && m.content.trim().length > 0
      );

      const userMsg: RiiqxMessage = {
        id: `msg_usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      const assistantMsgId = `msg_ast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const initialAssistantMsg: RiiqxMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        modelUsed: selectedModel.name,
      };

      const updatedMessages = [...sanitizedHistory, userMsg, initialAssistantMsg];
      const updatedConv: RiiqxConversation = {
        ...currentConv,
        title:
          sanitizedHistory.length === 0
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
          messages: [...sanitizedHistory, userMsg].map((m) => ({ role: m.role, content: m.content })),
          enableWebSearch,
          documents: attachedDocuments,
          stream: true,
        };

        const res = await fetch('/api/riiqx/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Inference returned HTTP ${res.status}`);
        }

        const isStream = res.headers.get('content-type')?.includes('text/event-stream');

        if (isStream && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let accumulatedText = '';
          let metaModel = selectedModel.name;
          let metaCitations: RiiqxSearchCitation[] = [];
          let metaTaskPlan: any = undefined;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data:')) continue;
              const dataStr = trimmed.slice(5).trim();
              if (dataStr === '[DONE]') break;

              try {
                const ev = JSON.parse(dataStr);
                if (ev.type === 'meta') {
                  if (ev.modelUsed) metaModel = ev.modelUsed;
                  if (ev.citations) metaCitations = ev.citations;
                  if (ev.taskPlan) metaTaskPlan = ev.taskPlan;
                } else if (ev.type === 'chunk' && ev.text) {
                  accumulatedText += ev.text;
                  setActiveConversation((prev) => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      messages: prev.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                      ),
                    };
                  });
                } else if (ev.type === 'done') {
                  if (ev.fullReply && !accumulatedText) {
                    accumulatedText = ev.fullReply;
                  }
                } else if (ev.type === 'error') {
                  accumulatedText = `> ⚠️ **Provider Error:** ${ev.error}`;
                }
              } catch {}
            }
          }

          // Persist the completed conversation
          const finalText = accumulatedText.trim() || 'Execution finished.';
          setActiveConversation((prev) => {
            if (!prev) return null;
            const finalConv = {
              ...prev,
              messages: prev.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: finalText,
                      citations: metaCitations,
                      taskPlan: metaTaskPlan,
                      modelUsed: metaModel,
                    }
                  : m
              ),
            };
            setConversations((all) => {
              const list = all.map((c) => (c.id === finalConv.id ? finalConv : c));
              saveConversationsToStorage(list);
              return list;
            });
            return finalConv;
          });
        } else {
          // Non-streaming JSON fallback
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
                    modelUsed: data.modelUsed || selectedModel.name,
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
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Handled user cancellation
          setActiveConversation((prev) => {
            if (!prev) return null;
            const msgs = prev.messages.map((m) =>
              m.id === assistantMsgId && !m.content
                ? { ...m, content: '*[Inference stopped by user]*' }
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
        } else {
          const errorText =
            err instanceof Error ? err.message : 'Unknown network connection failure';
          const errorMsg = `> ⚠️ **RIIQX Service Error:** ${errorText}\n> Please check your network connection, or switch to another model in the top selector.`;
          setActiveConversation((prev) => {
            if (!prev) return null;
            const msgs = prev.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: errorMsg,
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
        }
      } finally {
        setIsGenerating(false);
        setAbortController(null);
      }
    },
    [activeConversation, createNewConversation, isGenerating, selectedModel, enableWebSearch, attachedDocuments]
  );

  const retryLastMessage = useCallback(async () => {
    if (!activeConversation || isGenerating) return;
    const msgs = activeConversation.messages;
    const lastUserIdx = msgs.map((m) => m.role).lastIndexOf('user');
    if (lastUserIdx === -1) return;
    const lastUserPrompt = msgs[lastUserIdx].content;

    // Prune up to the last user message
    const pruned = msgs.slice(0, lastUserIdx);
    const updatedConv = {
      ...activeConversation,
      messages: pruned,
    };
    setActiveConversation(updatedConv);
    await sendMessage(lastUserPrompt);
  }, [activeConversation, isGenerating, sendMessage]);

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
        theme,
        toggleTheme,
        setTheme,
        isAiDrawerOpen,
        toggleAiDrawer,
        setIsAiDrawerOpen,
        globalPrompt,
        setGlobalPrompt,
        executeGlobalTask,
        user,
        setUser,
        isAuthenticated,
        isAuthLoading,
        signOut,
        refreshSession,
        updateUserProfile,
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
        clearCurrentConversation,
        retryLastMessage,
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
