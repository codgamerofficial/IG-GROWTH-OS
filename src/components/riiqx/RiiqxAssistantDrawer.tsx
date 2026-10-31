'use client';

// =============================================================================
// RIIQX 2.0 — Contextual AI Assistant Drawer (Section 6 of Blueprint)
// "Hi! How can I help you today?" • Prompt Chips • Tool Synthesis • Direct Actions
// =============================================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { AIThinkingOrb } from '@/components/riiqx/ai/AIThinkingOrb';
import {
  Sparkles,
  Send,
  X,
  Bot,
  Video,
  FileText,
  BarChart2,
  Calendar,
  ChevronRight,
  Maximize2,
  Check,
  Copy,
  AlertTriangle,
} from 'lucide-react';

function renderDrawerText(text: string) {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    let trimmed = line.trim();
    if (!trimmed) return <div key={lIdx} className="h-1.5" />;
    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
    if (isBullet) trimmed = trimmed.slice(2);

    const tokens = trimmed.split(/(\*\*[^*]+\*\*)/g);
    const content = tokens.map((token, tIdx) => {
      if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
        return <strong key={tIdx} className="font-bold text-[#202124] dark:text-white">{token.slice(2, -2)}</strong>;
      }
      return token;
    });

    if (isBullet) {
      return (
        <div key={lIdx} className="flex items-start gap-1.5 my-0.5">
          <span className="w-1 h-1 rounded-full bg-[#FFD43B] mt-1.5 shrink-0" />
          <span className="leading-snug">{content}</span>
        </div>
      );
    }
    return <p key={lIdx} className="leading-snug">{content}</p>;
  });
}

export function RiiqxAssistantDrawer() {
  const {
    activeTab,
    isAiDrawerOpen,
    toggleAiDrawer,
    setActiveTab,
    selectedModel,
    activeConversation,
    isGenerating,
    sendMessage,
    cancelGeneration,
  } = useRiiqx();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messages = useMemo(() => activeConversation?.messages || [], [activeConversation?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = (text?: string) => {
    const query = (text || inputVal).trim();
    if (!query || isGenerating) return;
    sendMessage(query);
    setInputVal('');
  };

  const suggestionChips = [
    { label: 'Create a video idea', icon: Video, prompt: 'Create 3 viral video ideas for short-form creators' },
    { label: 'Write a script', icon: FileText, prompt: 'Write a 30-second viral reel script about AI tools with 3-second hook' },
    { label: 'Analyze my last video', icon: BarChart2, prompt: 'Analyze audience retention and give recommendations for recent videos' },
    { label: 'Schedule a post', icon: Calendar, prompt: 'Stage an Instagram Reel post draft with viral hashtags and schedule' },
  ];

  // If drawer is closed or user is already on the dedicated full chat page, don't render floating drawer
  if (!isAiDrawerOpen || activeTab === 'chat') return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 h-[580px] max-h-[84vh] flex flex-col rounded-[26px] border border-[#EAE7E1] dark:border-white/[0.12] bg-white/95 dark:bg-[#121215]/95 backdrop-blur-2xl shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
      {/* Floating Header */}
      <div className="h-14 border-b border-[#EAE7E1] dark:border-white/[0.08] px-4 flex items-center justify-between shrink-0 bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <AIThinkingOrb state={isGenerating ? 'generating' : 'idle'} size={24} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#202124] dark:text-[#F4F4F6] leading-tight">
              RIIQX Assistant
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] text-[#737373] dark:text-[#A1A1AA]">
                Floating Companion • Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              toggleAiDrawer();
              setActiveTab('chat');
            }}
            title="Expand to Full Dedicated AI Agent Chat"
            className="p-1.5 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-[#F7F7F7] hover:bg-[#FAF9F6] dark:hover:bg-[#151515] transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleAiDrawer}
            title="Close Assistant Panel"
            className="p-1.5 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-[#F7F7F7] hover:bg-[#FAF9F6] dark:hover:bg-[#151515] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.length === 0 ? (
          <div className="pt-2 space-y-4">
            <div className="rounded-2xl p-4 bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#202124] dark:text-[#F7F7F7]">
                <Sparkles className="w-4 h-4 text-[#FFD43B]" />
                <span>Hi! How can I help you today?</span>
              </div>
              <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3] mt-1.5 leading-relaxed">
                I can research trends, draft viral scripts, analyze audience retention, and trigger Creator Studio workflows.
              </p>
            </div>

            {/* Prompt Chips */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider px-1">
                Suggested Actions
              </span>
              <div className="space-y-1.5">
                {suggestionChips.map((chip, idx) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.prompt)}
                      className="w-full text-left p-2.5 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] hover:border-[#FFD43B] dark:hover:border-[#FFD43B] text-[#202124] dark:text-[#F7F7F7] transition flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium">{chip.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#202124] dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id || idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-2xl p-3 max-w-[90%] leading-relaxed text-xs break-words ${
                    isUser
                      ? 'bg-[#202124] text-white dark:bg-[#1E1E22] dark:text-[#F4F4F6] border border-black/10 dark:border-[#FFD43B]/25 rounded-tr-none font-medium'
                      : 'bg-[#FAF9F6] dark:bg-[#18181C] text-[#202124] dark:text-[#F4F4F6] border border-[#EAE7E1] dark:border-white/[0.08] rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="space-y-1">{renderDrawerText(m.content)}</div>
                  )}
                </div>
                <span className="text-[9px] text-[#737373] dark:text-[#A1A1AA] mt-1 px-1">
                  {isUser ? 'You' : m.modelUsed || selectedModel.name}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Composer */}
      <div className="p-3 border-t border-[#EAE7E1] dark:border-white/[0.08] bg-white dark:bg-[#141418] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask RIIQX floating companion..."
            disabled={isGenerating}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-full bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] text-xs text-[#202124] dark:text-[#F7F7F7] placeholder-[#737373] dark:placeholder-[#A3A3A3] focus:outline-none focus:border-[#FFD43B] transition"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isGenerating}
            className="absolute right-1.5 w-7 h-7 rounded-full bg-[#FFD43B] hover:bg-[#FFC928] disabled:opacity-40 text-[#202124] font-bold flex items-center justify-center transition shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
