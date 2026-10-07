'use client';

// =============================================================================
// IG GrowthOS: AI Growth Copilot Drawer (Section 32)
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { Bot, X, Send, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';

import { Logo } from '@/components/brand/Logo';

export function GrowthCopilotDrawer() {
  const { copilotOpen, setCopilotOpen, copilotMessages, copilotLoading, sendCopilotMessage } =
    useGrowthOS();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Run today's workflow",
    'What should I post today?',
    "Why did yesterday's Reel perform badly?",
    'Create 3 ideas for the Double-Zip Hoodie',
    'Prepare next week\'s content calendar',
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || copilotLoading) return;
    const text = input;
    setInput('');
    await sendCopilotMessage(text);
  };

  useEffect(() => {
    if (copilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, copilotOpen]);

  if (!copilotOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#0d0e18] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-[#070812]">
        <div className="flex items-center gap-3">
          <Logo variant="icon" size="sm" animated={copilotLoading} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm">Growth Copilot</h3>
              <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-pink-400 border border-violet-500/20">
                Amazon Bedrock
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">RIIQX AI Agent Intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setCopilotOpen(false)}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="border-b border-white/5 bg-[#151519]/50 p-3 overflow-x-auto no-scrollbar flex gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendCopilotMessage(prompt)}
            className="shrink-0 flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-zinc-300 hover:border-rose-500/40 hover:text-white transition-all"
          >
            <Sparkles className="h-3 w-3 text-rose-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-rose-600 text-white rounded-br-none shadow-md shadow-rose-600/20'
                  : 'bg-white/5 border border-white/10 text-zinc-200 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {copilotLoading && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-white/5 rounded-2xl px-4 py-3 w-fit border border-white/10">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Copilot is analyzing brand data & generating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="border-t border-white/10 p-3 bg-[#09090B]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot anything about RIIQX..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-12 text-xs text-zinc-200 placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || copilotLoading}
            className="absolute right-1.5 rounded-lg bg-rose-600 p-2 text-white hover:bg-rose-500 disabled:opacity-50 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
