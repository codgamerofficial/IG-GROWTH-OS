// =============================================================================
// RIIQX Mobile — Context Provider & Application State
// Reactive • Online-First • AWS Bedrock & Multi-Model
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, MobileModel, MobileChatMessage, MobileAutopilotItem } from '../services/api';

interface RiiqxMobileContextType {
  user: { id: string; name: string; email: string; role: string };
  models: MobileModel[];
  selectedModel: MobileModel | null;
  setSelectedModel: (m: MobileModel) => void;
  messages: MobileChatMessage[];
  isGenerating: boolean;
  sendMessage: (content: string) => Promise<void>;
  autopilotQueue: MobileAutopilotItem[];
  emergencyStop: boolean;
  toggleEmergencyStop: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const RiiqxMobileContext = createContext<RiiqxMobileContextType | undefined>(undefined);

export function RiiqxMobileProvider({ children }: { children: ReactNode }) {
  const [user] = useState({
    id: 'usr_riiqx_mobile',
    name: 'RIIQX Enterprise Admin',
    email: 'admin@riiqx.ai',
    role: 'creator',
  });

  const [models, setModels] = useState<MobileModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<MobileModel | null>(null);
  const [messages, setMessages] = useState<MobileChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'Welcome to **RIIQX Mobile**. One Goal. An AI That Gets It Done.\n\nConnected to online AWS Bedrock Claude Sonnet 4 / 3.7 runtime. How can I assist your goals today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [autopilotQueue, setAutopilotQueue] = useState<MobileAutopilotItem[]>([]);
  const [emergencyStop, setEmergencyStop] = useState(false);

  const refreshAll = useCallback(async () => {
    try {
      const fetchedModels = await api.getModels();
      setModels(fetchedModels);
      if (fetchedModels.length > 0 && !selectedModel) {
        setSelectedModel(fetchedModels[0]);
      }

      const apState = await api.getAutopilotState();
      if (apState.queue) setAutopilotQueue(apState.queue);
      if (typeof apState.emergencyStopActive === 'boolean') {
        setEmergencyStop(apState.emergencyStopActive);
      }
    } catch {
      // Retain offline resilience
    }
  }, [selectedModel]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return;

    const userMsg: MobileChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await api.sendChat({
        messages: [{ role: 'user', content: userMsg.content }],
        model: selectedModel?.id,
        enableSearch: true,
      });

      const assistantMsg: MobileChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: response.message || 'Task processed successfully.',
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Inference failed: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleEmergencyStop = async () => {
    const nextState = !emergencyStop;
    setEmergencyStop(nextState);
    await api.toggleEmergencyStop(nextState);
  };

  return (
    <RiiqxMobileContext.Provider
      value={{
        user,
        models,
        selectedModel,
        setSelectedModel,
        messages,
        isGenerating,
        sendMessage,
        autopilotQueue,
        emergencyStop,
        toggleEmergencyStop,
        refreshAll,
      }}
    >
      {children}
    </RiiqxMobileContext.Provider>
  );
}

export function useRiiqxMobile() {
  const context = useContext(RiiqxMobileContext);
  if (!context) {
    throw new Error('useRiiqxMobile must be used within a RiiqxMobileProvider');
  }
  return context;
}
