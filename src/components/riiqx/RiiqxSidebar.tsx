'use client';

// =============================================================================
// RIIQX 2.0 — Modern Creator OS Desktop Sidebar
// Matching Image 1 Visual Hierarchy • Pro Plan Credit Ring • Clean Light Design
// =============================================================================

import React from 'react';
import { useRiiqx, RiiqxViewTab } from '@/context/RiiqxContext';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import {
  Home,
  MessageSquare,
  Video,
  Rocket,
  CheckSquare,
  Search,
  Code2,
  Boxes,
  BarChart3,
  FolderOpen,
  Settings,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export function RiiqxSidebar() {
  const { activeTab, setActiveTab } = useRiiqx();

  const navItems: { tab: RiiqxViewTab; label: string; icon: React.ElementType }[] = [
    { tab: 'home', label: 'Home', icon: Home },
    { tab: 'chat', label: 'AI Agent Chat', icon: MessageSquare },
    { tab: 'creator', label: 'Creator Studio', icon: Video },
    { tab: 'autopilot', label: 'Autopilot Center', icon: Rocket },
    { tab: 'tasks', label: 'Task Planner', icon: CheckSquare },
    { tab: 'research', label: 'Deep Research', icon: Search },
    { tab: 'code', label: 'Code Studio', icon: Code2 },
    { tab: 'integrations', label: 'Integrations', icon: Boxes },
    { tab: 'analytics', label: 'Analytics & Growth', icon: BarChart3 },
    { tab: 'files', label: 'Library', icon: FolderOpen },
    { tab: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex h-full w-60 flex-col justify-between border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 select-none text-slate-800 dark:text-slate-200">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2.5 px-3 py-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-xs">
            <RiiqxEmblem size={20} />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            RIIQX
          </span>
        </div>

        {/* Primary Navigation Workspaces */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pro Plan Card (Matching Image 1) */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white">Pro Plan</span>
          <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Circular Progress & Credit Indicator */}
        <div className="flex items-center gap-3 mb-3">
          {/* SVG Circular Ring for 68% */}
          <div className="relative w-10 h-10 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-violet-600"
                strokeDasharray="68, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-900 dark:text-white">68%</span>
            </div>
          </div>

          <div className="text-[11px]">
            <p className="font-bold text-slate-800 dark:text-slate-200">1,360 / 2,000</p>
            <p className="text-slate-400">credits remaining</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('settings')}
          className="w-full py-1.5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-violet-600 transition-colors shadow-2xs"
        >
          Upgrade Plan
        </button>
      </div>
    </aside>
  );
}
