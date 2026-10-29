'use client';

// =============================================================================
// RIIQX 2.0 — Modern Creator OS Desktop Sidebar
// Blueprint Specification: Dark Slate #141821 • Vibrant Violet Pills • Pro Plan Card
// =============================================================================

import React from 'react';
import { useRiiqx, RiiqxViewTab } from '@/context/RiiqxContext';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import {
  LayoutDashboard,
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
  ChevronRight,
} from 'lucide-react';

export function RiiqxSidebar() {
  const { activeTab, setActiveTab } = useRiiqx();

  const navItems: { tab: RiiqxViewTab; label: string; icon: React.ElementType }[] = [
    { tab: 'home', label: 'Dashboard', icon: LayoutDashboard },
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
    <aside className="hidden lg:flex h-full w-64 shrink-0 flex-col justify-between border-r border-[#EAE7E1] dark:border-[#2E2E2E] bg-white/85 dark:bg-[#151515]/85 backdrop-blur-xl p-3.5 select-none transition-colors min-h-0 overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 space-y-3">
        {/* Brand Logo Header */}
        <div
          className="flex items-center gap-3 px-3 py-2 shrink-0 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setActiveTab('home')}
        >
          <RiiqxEmblem size={30} glow={false} />
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-[#202124] dark:text-white font-heading">
              RIIQX
            </span>
            <span className="text-[10px] font-semibold text-[#737373] dark:text-[#A3A3A3] tracking-wide -mt-0.5">
              Creator OS • AI Agent
            </span>
          </div>
        </div>

        {/* Primary Navigation Workspaces */}
        <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#FFD43B] text-[#202124] font-bold shadow-xs'
                    : 'text-[#737373] dark:text-[#A3A3A3] hover:bg-[#FAF9F6] dark:hover:bg-[#202020] hover:text-[#202124] dark:hover:text-[#F7F7F7]'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#202124]' : 'text-[#737373] dark:text-[#A3A3A3]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card */}
      <div
        onClick={() => setActiveTab('settings')}
        className="shrink-0 mt-2 rounded-2xl bg-[#FAF9F6] dark:bg-[#202020] p-3 border border-[#EAE7E1] dark:border-[#2E2E2E] hover:border-[#FFD43B] transition-all cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD43B] to-[#FF6B5E] flex items-center justify-center text-[#202124] font-black text-xs shrink-0 shadow-xs">
            <span>R</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#16865D] border-2 border-white dark:border-[#202020]" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#202124] dark:text-white truncate">
                RIIQX Studio
              </span>
              <span className="text-[9px] font-bold text-[#202124] dark:text-[#FFD43B] bg-[#FFD43B]/30 px-1.5 py-0.2 rounded-full border border-[#FFD43B]/40">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] truncate">
              Autonomous Core • Active
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#202124] dark:group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
}
