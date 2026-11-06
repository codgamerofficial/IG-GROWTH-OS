'use client';

// =============================================================================
// RIIQX — Floating Autonomous Twin Companion Drawer
// Quick Personal Intelligence • Verified Product Scans • Meal Plans • Savings Radar
// =============================================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { AIThinkingOrb } from '@/components/riiqx/ai/AIThinkingOrb';
import {
  Sparkles,
  Send,
  X,
  Scale,
  Utensils,
  Compass,
  TrendingUp,
  ChevronRight,
  Maximize2,
  ShieldCheck,
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
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0 shadow-[0_0_6px_#f97316]" />
          <span className="leading-snug text-zinc-300">{content}</span>
        </div>
      );
    }
    return <p key={lIdx} className="leading-snug text-zinc-200">{content}</p>;
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
  } = useRiiqx();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    {
      label: 'Compare Product Deals',
      icon: Scale,
      prompt: 'Compare real prices and find lowest verified deals for noise-cancelling headphones across Indian retailers',
    },
    {
      label: 'What Should I Eat Today?',
      icon: Utensils,
      prompt: 'Suggest a healthy, high-protein dinner recipe based on fresh seasonal ingredients under 30 minutes',
    },
    {
      label: 'Check Monthly Savings',
      icon: TrendingUp,
      prompt: 'Analyze my verified savings progress and recommend optimal purchases for my tech upgrade goal',
    },
    {
      label: 'Active Promo Radar',
      icon: Compass,
      prompt: 'Scan verified bank card offers and active promo codes across Amazon, Flipkart and Myntra',
    },
  ];

  // If drawer is closed or user is already on the dedicated full twin chat page, don't render floating drawer
  if (!isAiDrawerOpen || activeTab === 'twin') return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 h-[580px] max-h-[84vh] flex flex-col rounded-[28px] border border-[#EAE7E1] dark:border-white/[0.12] bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-2xl shadow-2xl shadow-black/80 transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 overflow-hidden">
      {/* Floating Header */}
      <div className="h-14 border-b border-[#EAE7E1] dark:border-white/[0.08] px-4 flex items-center justify-between shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <AIThinkingOrb state={isGenerating ? 'generating' : 'idle'} size={24} />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#202124] dark:text-white leading-tight">
                RIIQX Twin Companion
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider px-1 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Level 2 Autonomy • Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              toggleAiDrawer();
              setActiveTab('twin');
            }}
            title="Expand to Full Dedicated Twin Chat"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleAiDrawer}
            title="Close Companion Panel"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar">
        {messages.length === 0 ? (
          <div className="pt-2 space-y-4">
            <div className="rounded-2xl p-4 bg-[#FAF9F6] dark:bg-white/[0.03] border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[#202124] dark:text-white">
                <Sparkles className="w-4 h-4 text-orange-400 drop-shadow-[0_0_8px_rgba(255,87,34,0.4)]" />
                <span>Hi! How can your Twin assist you today?</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                I can cross-verify live product pricing, track your budget goals, suggest nutrition-conscious meals, and surface authentic savings.
              </p>
            </div>

            {/* Suggested Twin Actions */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-1">
                Suggested Twin Actions
              </span>
              <div className="space-y-1.5">
                {suggestionChips.map((chip, idx) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.prompt)}
                      className="w-full text-left p-2.5 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white dark:bg-zinc-950/60 hover:border-orange-500/40 hover:bg-orange-500/[0.04] text-[#202124] dark:text-zinc-200 transition flex items-center justify-between group shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                          {chip.label}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all" />
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
                      ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-white border border-orange-500/30 rounded-tr-none font-medium shadow-sm'
                      : 'bg-[#FAF9F6] dark:bg-zinc-950/80 text-[#202124] dark:text-zinc-200 border border-[#EAE7E1] dark:border-white/[0.08] rounded-tl-none shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="space-y-1">{renderDrawerText(m.content)}</div>
                  )}
                </div>
                <span className="text-[9px] text-zinc-500 dark:text-zinc-500 mt-1 px-1">
                  {isUser ? 'You' : m.modelUsed || selectedModel.name}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Composer */}
      <div className="p-3 border-t border-[#EAE7E1] dark:border-white/[0.08] bg-white dark:bg-zinc-950/90 shrink-0">
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
            placeholder="Ask your Twin anything..."
            disabled={isGenerating}
            className="w-full pl-3.5 pr-10 py-2.5 rounded-full bg-[#FAF9F6] dark:bg-zinc-900 border border-[#EAE7E1] dark:border-white/[0.1] text-xs text-[#202124] dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/20 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isGenerating}
            className="absolute right-1.5 w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white font-bold flex items-center justify-center transition-all shadow-md shadow-orange-500/30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
