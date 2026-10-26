'use client';

// =============================================================================
// RIIQX 2.0 — Modern Creator Home Dashboard
// Warm Light Aesthetic • Real Tool Shortcuts • Responsive • Touch-Friendly
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Sparkles,
  Search,
  Paperclip,
  Mic,
  ArrowRight,
  Globe,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  Grid,
  CheckCircle2,
  Instagram,
  Youtube,
  TrendingUp,
  Clock,
  Play,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

export function RiiqxHomeDashboard() {
  const { setActiveTab, executeGlobalTask } = useRiiqx();
  const [promptText, setPromptText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;
    executeGlobalTask(promptText.trim(), 'chat');
  };

  const quickActionCards = [
    {
      title: 'Create a Reel',
      desc: 'Turn your photos & videos into viral shorts',
      icon: Video,
      color: 'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/40',
      tab: 'creator' as const,
    },
    {
      title: 'Deep Research',
      desc: 'Find real information with sources',
      icon: Globe,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40',
      tab: 'research' as const,
    },
    {
      title: 'Build a Website',
      desc: 'From idea to live web app',
      icon: Layers,
      color: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/40',
      tab: 'code' as const,
    },
    {
      title: 'Analyze Files',
      desc: 'PDF, Docs, Images, Data',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/40',
      tab: 'files' as const,
    },
    {
      title: 'Code Anything',
      desc: 'Build, debug, and deploy',
      icon: Grid,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/40',
      tab: 'code' as const,
    },
    {
      title: 'Content Autopilot',
      desc: 'Plan, create, and post automatically',
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/40',
      tab: 'autopilot' as const,
    },
  ];

  const recentProjects = [
    {
      title: 'Darjeeling Travel Reel',
      meta: '9:16 · 00:32',
      thumb: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80',
      category: 'Travel Vlog',
    },
    {
      title: 'Product Promo',
      meta: '9:16 · 00:28',
      thumb: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      category: 'E-Commerce',
    },
    {
      title: 'AI News Shorts',
      meta: '9:16 · 00:45',
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      category: 'Tech News',
    },
    {
      title: 'Fitness Reel',
      meta: '9:16 · 00:35',
      thumb: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      category: 'Health & Fitness',
    },
  ];

  const todayTasks = [
    { title: 'Create 3 viral reels for Instagram', progress: 80, status: '80%' },
    { title: 'Research trending topics (India)', progress: 100, status: 'Done' },
    { title: 'Edit product video', progress: 60, status: '60%' },
    { title: 'Schedule YouTube upload', progress: 0, status: 'Pending' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-8 bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      {/* Top Greeting & Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Greeting + Input + Tool Pills */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Good Morning 👋</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              What will <span className="riiqx-gradient-text">RIIQX</span> do for you today?
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
              Plan. Create. Automate. Grow. All in one place.
            </p>
          </div>

          {/* Prominent Task Input Box */}
          <form
            onSubmit={handleSubmit}
            className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm focus-within:shadow-md focus-within:border-violet-400 dark:focus-within:border-violet-600 transition-all p-3"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ask RIIQX anything or give a task..."
                className="w-full bg-transparent text-sm md:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  title="Voice input"
                  className={`p-2 rounded-full transition-colors ${
                    isRecording
                      ? 'bg-red-50 text-red-600 dark:bg-red-950/40'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('files')}
                  title="Attach files"
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!promptText.trim()}
                  className="w-10 h-10 rounded-full bg-slate-900 hover:bg-violet-600 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-slate-900 shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Quick Tool Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => executeGlobalTask('Search web for latest trends', 'research')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors shrink-0 shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Search Web</span>
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors shrink-0 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              <span>Analyze Files</span>
            </button>
            <button
              onClick={() => executeGlobalTask('Create a hyper-realistic image', 'creator')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors shrink-0 shadow-2xs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>Create Image</span>
            </button>
            <button
              onClick={() => setActiveTab('creator')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors shrink-0 shadow-2xs"
            >
              <Video className="w-3.5 h-3.5 text-rose-500" />
              <span>Generate Video</span>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors shrink-0 shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Plan Task</span>
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition-colors shrink-0 shadow-2xs"
            >
              <Grid className="w-3.5 h-3.5 text-slate-500" />
              <span>More Tools</span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Agent Mascot Card (Matching Image 1) */}
        <div className="lg:col-span-4 relative rounded-3xl bg-gradient-to-br from-violet-50/70 via-purple-50/40 to-pink-50/60 dark:from-violet-950/20 dark:via-purple-950/10 dark:to-pink-950/20 border border-violet-100 dark:border-violet-900/30 p-5 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                Your AI Agent
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Checklist */}
            <div className="mt-4 space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Understands</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Plans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Uses Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Gets It Done</span>
              </div>
            </div>
          </div>

          {/* Tagline Speech Banner */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 p-3 text-white shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-violet-100">One Goal.</p>
              <p className="text-xs font-bold">An AI That Gets It Done.</p>
            </div>
            <button
              onClick={() => setActiveTab('chat')}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Quick Action Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {quickActionCards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.title}
              onClick={() => setActiveTab(c.tab)}
              className="flex flex-col text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                {c.title}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {c.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4-Card Dashboard Grid (Recent Projects, Tasks, Connected Accounts, Growth) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Recent Projects */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Projects</h2>
              <button
                onClick={() => setActiveTab('creator')}
                className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-0.5"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {recentProjects.map((p) => (
                <div
                  key={p.title}
                  onClick={() => setActiveTab('editor')}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:shadow-xs transition-all"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={p.thumb}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{p.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Today's Tasks */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Today&apos;s Tasks</h2>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {todayTasks.map((t) => (
                <div key={t.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                      {t.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'Done'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                          : t.status === 'Pending'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                          : 'bg-violet-50 text-violet-600 dark:bg-violet-950/40'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full transition-all"
                      style={{ width: `${t.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 transition-colors"
          >
            + Create New Task
          </button>
        </div>

        {/* Card 3: Connected Accounts */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Connected Accounts</h2>
              <button
                onClick={() => setActiveTab('integrations')}
                className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3">
              {/* Instagram */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Instagram</p>
                    <p className="text-[10px] text-slate-400">@yourname</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                  Connected
                </span>
              </div>

              {/* YouTube */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">YouTube</p>
                    <p className="text-[10px] text-slate-400">@yourchannel</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                  Connected
                </span>
              </div>

              {/* TikTok */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-500/10 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                    TK
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">TikTok</p>
                    <p className="text-[10px] text-slate-400">Not connected</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('integrations')}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white hover:bg-violet-600 transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: This Month Growth (Matching Image 1 Dark Metric Card) */}
        <div className="rounded-3xl bg-[#0F172A] text-white p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300">This Month</span>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                Last 30 days v
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-2">
              <div>
                <p className="text-xl font-extrabold text-white">1.2M</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Total Views</span>
                  <span className="text-emerald-400 font-bold">+42%</span>
                </div>
              </div>

              <div>
                <p className="text-xl font-extrabold text-white">58K</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Likes</span>
                  <span className="text-emerald-400 font-bold">+36%</span>
                </div>
              </div>

              <div>
                <p className="text-xl font-extrabold text-white">8.4K</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Comments</span>
                  <span className="text-emerald-400 font-bold">+28%</span>
                </div>
              </div>

              <div>
                <p className="text-xl font-extrabold text-white">3.1K</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Shares</span>
                  <span className="text-emerald-400 font-bold">+51%</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('analytics')}
            className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/70 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
          >
            <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
            <span>Open Detailed Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}
