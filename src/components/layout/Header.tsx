'use client';

// =============================================================================
// IG GrowthOS: Top Header & Natural Language Command Bar
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import {
  Sparkles,
  Command,
  Play,
  Instagram,
  Bot,
  Sun,
  Moon,
  Laptop,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

import { Logo } from '@/components/brand/Logo';

export function Header() {
  const {
    brand,
    account,
    workflowRunning,
    runTodayWorkflow,
    commandInput,
    setCommandInput,
    executeCommand,
    setCopilotOpen,
    copilotOpen,
  } = useGrowthOS();

  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    const msg = await executeCommand(commandInput);
    setCommandFeedback(msg);
    setCommandInput('');
    setTimeout(() => setCommandFeedback(null), 4000);
  };

  const isMock = true; // In development mode

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070812]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand Identity & Official Logo */}
        <div className="flex items-center gap-3">
          <Logo variant="horizontal" size="sm" showTagline={false} href="/" priority />
          <span className="hidden sm:inline-flex rounded-full bg-pink-500/10 px-2 py-0.5 text-[10px] font-semibold text-pink-400 border border-pink-500/20">
            {brand?.name || 'RIIQX'}
          </span>
        </div>

        {/* Natural Language Command Bar (Section 31) */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-8">
          <form onSubmit={handleCommandSubmit} className="relative w-full">
            <div className="relative flex items-center">
              <Command className="absolute left-3.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder='Ask Copilot or type command: "Run today&apos;s workflow", "Create 5 Reel ideas"...'
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-24 text-xs text-zinc-200 placeholder-zinc-500 focus:border-rose-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-white/20 transition-colors"
              >
                Run
              </button>
            </div>
            {commandFeedback && (
              <div className="absolute top-12 left-0 right-0 rounded-lg bg-[#151519] border border-rose-500/30 px-3 py-1.5 text-xs text-rose-300 shadow-xl z-50 animate-fade-in flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{commandFeedback}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Action Suite */}
        <div className="flex items-center gap-3">
          {/* Mock Mode Alert Badge (Section 35) */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 text-[11px] font-medium text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>DEVELOPMENT / MOCK MODE</span>
          </div>

          {/* Instagram Account Status Card (Section 7) */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5">
            <div className="relative">
              <Instagram className="h-4 w-4 text-pink-400" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#09090B]" />
            </div>
            <div className="text-left text-[11px]">
              <div className="font-semibold text-white leading-tight">@{account?.username || 'riiqx.official'}</div>
              <div className="text-[10px] text-emerald-400 font-medium">Connected ●</div>
            </div>
          </div>

          {/* Primary CTA: Run Today's Workflow (Section 6) */}
          <button
            onClick={runTodayWorkflow}
            disabled={workflowRunning}
            className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {workflowRunning ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Running Workflow...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Run Today&apos;s Workflow</span>
                </>
              )}
            </div>
          </button>

          {/* AI Growth Copilot Trigger */}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
              copilotOpen
                ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
            }`}
          >
            <Bot className="h-4 w-4 text-rose-400" />
            <span className="hidden md:inline">Copilot</span>
          </button>
        </div>
      </div>
    </header>
  );
}
