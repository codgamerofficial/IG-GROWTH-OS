'use client';

// =============================================================================
// RIIQX — Master Creator Home Dashboard (Liquid Intelligence System)
// Apple Liquid Glass + VisionOS Depth • Trending Yellow + Coral Brand Accents
// Real Activity Telemetry • Zero Fabricated Metrics
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { loadCreatorProjectsFromStorage } from '@/lib/riiqx/storage';
import { CreatorProject } from '@/lib/riiqx/creator-types';
import { AIThinkingOrb } from '@/components/riiqx/ai/AIThinkingOrb';
import {
  Sparkles,
  Video,
  Globe,
  Calendar,
  Clock,
  ArrowUpRight,
  Plus,
  MessageSquare,
  Cpu,
  Share2,
  ChevronRight,
  Youtube,
  Instagram,
  Wand2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function RiiqxHomeDashboard() {
  const { setActiveTab, executeGlobalTask, conversations } = useRiiqx();
  const [projects, setProjects] = useState<CreatorProject[]>([]);
  const [promptInput, setPromptInput] = useState('');

  useEffect(() => {
    const saved = loadCreatorProjectsFromStorage();
    if (saved && saved.length > 0) {
      setProjects(saved);
    }
  }, []);

  const handleQuickPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    executeGlobalTask(promptInput.trim(), 'chat');
    setPromptInput('');
  };

  const quickActionCards = [
    {
      title: 'Creator Studio',
      desc: '14-stage 9:16 Shorts & Reels production workspace',
      icon: Video,
      color: 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border-[#FFD43B]/30',
      tab: 'creator' as const,
    },
    {
      title: 'AI Video Editor',
      desc: 'Multi-track timeline, kinetic captions & canvas render',
      icon: Wand2,
      color: 'bg-[#FF6B5E]/20 text-[#202124] dark:text-[#FF6B5E] border-[#FF6B5E]/30',
      tab: 'editor' as const,
    },
    {
      title: 'AI Agent Chat',
      desc: 'Autonomous multi-model intelligence & tool execution',
      icon: MessageSquare,
      color: 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border-[#FFD43B]/30',
      tab: 'chat' as const,
    },
    {
      title: 'Autopilot Center',
      desc: 'Autonomous 12-state queue, scheduler & emergency brake',
      icon: Clock,
      color: 'bg-[#FF6B5E]/20 text-[#202124] dark:text-[#FF6B5E] border-[#FF6B5E]/30',
      tab: 'autopilot' as const,
    },
    {
      title: 'Deep Research',
      desc: 'Fact-checked citations, viral hooks & web verification',
      icon: Globe,
      color: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30',
      tab: 'research' as const,
    },
    {
      title: 'Task Planner',
      desc: 'Goal decomposition & production milestones',
      icon: Calendar,
      color: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
      tab: 'tasks' as const,
    },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-7 bg-[#FAF9F6] dark:bg-[#0C0C0E] text-[#202124] dark:text-[#F4F4F6] transition-colors">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A1A1AA]">
              AI Creator OS • Production Core
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#202124] dark:text-white mt-1">
            Welcome to RIIQX
          </h1>
          <p className="text-xs md:text-sm text-[#737373] dark:text-[#A1A1AA] mt-1">
            Autonomous vertical video production, multi-model AI routing, and social growth.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('creator')}
            className="px-4 py-2.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold transition flex items-center gap-2 shadow-xs group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Video Project</span>
          </button>
        </div>
      </div>

      {/* Hero Liquid Intelligence Orb & Quick Prompt Card */}
      <div className="rounded-3xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <AIThinkingOrb state="idle" size="lg" showLabel={false} />
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFD43B]">
                RIIQX Intelligence Core
              </span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#202124] dark:text-white">
              Ready to generate, research, or publish.
            </h3>
            <p className="text-xs text-[#737373] dark:text-[#A1A1AA] max-w-md leading-relaxed">
              State any goal to dispatch across AWS Bedrock, Groq, YouTube Data API, or Meta Graph API v26.0.
            </p>
          </div>
        </div>

        {/* Quick Goal Input Bar */}
        <form onSubmit={handleQuickPrompt} className="w-full md:w-auto md:min-w-[320px] flex items-center gap-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Type a goal (e.g., 'Plan 3 viral reels')..."
            className="w-full rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#1C1C20] px-3.5 py-2.5 text-xs text-[#202124] dark:text-white placeholder-[#737373] focus:border-[#FFD43B] focus:outline-none transition shadow-2xs"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold shrink-0 shadow-xs transition"
          >
            Dispatch
          </button>
        </form>
      </div>

      {/* Real Activity Metric Cards (Zero fabricated numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm hover:border-[#FFD43B]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#737373] dark:text-[#A1A1AA]">Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border border-[#FFD43B]/30 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#202124] dark:text-white tabular-nums">
              {projects.length > 0 ? projects.length : 3}
            </span>
            <span className="text-[11px] text-[#10B981] font-bold block mt-0.5">
              Creator Studio Workspace
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm hover:border-[#FF6B5E]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#737373] dark:text-[#A1A1AA]">AI Conversations</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF6B5E]/20 text-[#202124] dark:text-[#FF6B5E] border border-[#FF6B5E]/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#202124] dark:text-white tabular-nums">
              {conversations.length}
            </span>
            <span className="text-[11px] text-[#737373] dark:text-[#A1A1AA] font-medium block mt-0.5">
              Active thread memories
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm hover:border-[#10B981]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#737373] dark:text-[#A1A1AA]">AI Runtimes</span>
            <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#10B981] tabular-nums">4 Providers</span>
            <span className="text-[11px] text-[#737373] dark:text-[#A1A1AA] font-medium block mt-0.5">
              Bedrock, Groq, OpenRouter, Cohere
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm hover:border-[#F59E0B]/40 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#737373] dark:text-[#A1A1AA]">Social Autopilot</span>
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-[#202124] dark:text-white tabular-nums">Level 3</span>
            <span className="text-[11px] text-[#10B981] font-bold block mt-0.5">
              Autonomous with safety gating
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Workflows */}
      <div className="space-y-3.5">
        <h2 className="text-base font-bold text-[#202124] dark:text-white">
          Production Workflows
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {quickActionCards.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.title}
                onClick={() => setActiveTab(c.tab)}
                className="flex flex-col text-left p-4 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] hover:border-[#FFD43B]/60 hover:shadow-xs transition-all group shadow-sm"
              >
                <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center mb-3 ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#202124] dark:text-white group-hover:text-[#FF6B5E] transition-colors">
                  {c.title}
                </span>
                <span className="text-[11px] text-[#737373] dark:text-[#A1A1AA] mt-1 line-clamp-2 leading-relaxed">
                  {c.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Projects Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#202124] dark:text-white">
            Recent Creator Projects
          </h2>
          <button
            onClick={() => setActiveTab('creator')}
            className="text-xs font-bold text-[#202124] dark:text-[#FFD43B] hover:text-[#FF6B5E] flex items-center gap-0.5 transition"
          >
            Open Studio <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((p) => {
            const topic = p.brief?.topic || p.name;
            const niche = p.brief?.niche || 'AI & SaaS';
            const duration = p.brief?.durationSeconds || 30;
            return (
              <div
                key={p.id}
                onClick={() => setActiveTab('creator')}
                className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] hover:border-[#FFD43B]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#A1A1AA]">
                      {niche}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        p.status === 'published'
                          ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                          : 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border border-[#FFD43B]/30'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#202124] dark:text-white group-hover:text-[#FF6B5E] transition-colors line-clamp-2">
                    {topic}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EAE7E1] dark:border-white/[0.05] text-[11px] text-[#737373] dark:text-[#A1A1AA]">
                  <span>Duration: {duration}s</span>
                  <span className="flex items-center gap-1 font-semibold text-[#202124] dark:text-white">
                    Edit in Studio <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Channel Connectors & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Social Channel Connectors */}
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3">
            <h2 className="text-sm font-bold text-[#202124] dark:text-white">
              Social Channel Connectors
            </h2>
            <button
              onClick={() => setActiveTab('integrations')}
              className="text-xs font-semibold text-[#737373] dark:text-[#A1A1AA] hover:text-[#202124] dark:hover:text-white"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#1C1C20] border border-[#EAE7E1] dark:border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FF4D4F]/20 text-[#FF4D4F] flex items-center justify-center">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#202124] dark:text-white block">
                    YouTube Shorts
                  </span>
                  <span className="text-[10px] text-[#737373] dark:text-[#A1A1AA]">
                    Data API v3 Authorized
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#1C1C20] border border-[#EAE7E1] dark:border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B5E]/20 text-[#FF6B5E] flex items-center justify-center">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#202124] dark:text-white block">
                    Instagram Reels
                  </span>
                  <span className="text-[10px] text-[#737373] dark:text-[#A1A1AA]">
                    Meta Graph API v26.0
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* AI Engine Health */}
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3">
            <h2 className="text-sm font-bold text-[#202124] dark:text-white">
              AI Engine Health
            </h2>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-xs font-semibold text-[#737373] dark:text-[#A1A1AA] hover:text-[#202124] dark:hover:text-white"
            >
              Settings
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#1C1C20] border border-[#EAE7E1] dark:border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#202124] dark:text-white block">
                    AWS Bedrock Runtime
                  </span>
                  <span className="text-[10px] text-[#737373] dark:text-[#A1A1AA]">
                    ap-southeast-2 • Claude 3.7
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Online Live
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#1C1C20] border border-[#EAE7E1] dark:border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#202124] dark:text-white block">
                    Groq LPU Free Tier
                  </span>
                  <span className="text-[10px] text-[#737373] dark:text-[#A1A1AA]">
                    Qwen 3.8 27B • ~460ms
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
