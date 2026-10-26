'use client';

// =============================================================================
// RIIQX — Primary Navigation Workspace Sidebar
// Focused Hierarchy • Compact Tabs • Zero Developer Jargon Clutter
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx, RiiqxViewTab } from '@/context/RiiqxContext';
import {
  MessageSquare,
  Video,
  Rocket,
  Search,
  Code2,
  CheckSquare,
  BarChart3,
  Settings,
  FolderKanban,
  Trash2,
  Cloud,
} from 'lucide-react';

export function RiiqxSidebar() {
  const {
    activeTab,
    setActiveTab,
    conversations,
    activeConversation,
    setActiveConversation,
    createNewConversation,
    projects,
    activeProject,
    setActiveProject,
    providerHealth,
  } = useRiiqx();

  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { tab: RiiqxViewTab; label: string; icon: React.ElementType }[] = [
    { tab: 'chat', label: 'AI Agent Chat', icon: MessageSquare },
    { tab: 'creator', label: 'Creator Studio', icon: Video },
    { tab: 'autopilot', label: 'Autopilot Center', icon: Rocket },
    { tab: 'tasks', label: 'Task Planner', icon: CheckSquare },
    { tab: 'research', label: 'Deep Research', icon: Search },
    { tab: 'code', label: 'Code Studio', icon: Code2 },
    { tab: 'analytics', label: 'Analytics & Growth', icon: BarChart3 },
    { tab: 'settings', label: 'Settings & Cloud', icon: Settings },
  ];

  const isBedrockOnline = providerHealth?.bedrock?.status === 'online';

  const filteredConversations = conversations.filter((c) =>
    (c.title || 'Untitled Goal').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[#1E2A4A] bg-[#070D1F] p-3 text-sm select-none">
      {/* Primary Navigation Workspaces */}
      <div className="space-y-1 mb-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-[#94A3B8] hover:bg-[#0B132B] hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-[#64748B]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Projects Scoping */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
          <span>Active Strategy</span>
          <FolderKanban className="h-3 w-3" />
        </div>
        <div className="space-y-1">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProject(p)}
              className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs transition ${
                activeProject?.id === p.id
                  ? 'bg-[#0B132B] text-white border border-[#2D4170]'
                  : 'text-[#94A3B8] hover:bg-[#0B132B]/60 hover:text-white'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="truncate">{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation / Goal History */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
          <span>Goals ({conversations.length})</span>
        </div>

        {/* Filter Input */}
        <div className="relative mb-2 px-1">
          <Search className="absolute left-3 top-2.5 h-3 w-3 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals..."
            className="w-full rounded-lg border border-[#1E2A4A] bg-[#030712] py-1.5 pl-8 pr-2 text-xs text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {filteredConversations.map((c) => {
            const isSelected = activeConversation?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setActiveConversation(c);
                  setActiveTab('chat');
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition ${
                  isSelected
                    ? 'bg-[#0B132B] text-cyan-400 font-semibold border border-cyan-500/30'
                    : 'text-[#94A3B8] hover:bg-[#0B132B]/50 hover:text-white'
                }`}
              >
                <span className="truncate pr-2">{c.title || 'Untitled Goal'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Cloud Engine Indicator */}
      <div className="mt-auto border-t border-[#1E2A4A] pt-3 px-1">
        <div className="flex items-center justify-between rounded-xl bg-[#030712] p-2 text-[11px] border border-[#1E2A4A]">
          <div className="flex items-center gap-2">
            <Cloud className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-white font-medium">AWS Bedrock</span>
          </div>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              isBedrockOnline
                ? 'bg-emerald-500/15 text-emerald-400'
                : 'bg-purple-500/15 text-purple-400'
            }`}
          >
            {isBedrockOnline ? 'ONLINE' : 'ACTIVE'}
          </span>
        </div>
      </div>
    </aside>
  );
}
