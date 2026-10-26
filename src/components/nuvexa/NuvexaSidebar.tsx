'use client';

import React, { useState } from 'react';
import { useNuvexa, NuvexaViewTab } from '@/context/NuvexaContext';
import {
  MessageSquare,
  Search,
  Code2,
  CheckSquare,
  Settings,
  FolderKanban,
  Trash2,
  Pin,
  ShieldCheck,
  Server,
  Plus,
  Filter,
  Video,
  Rocket,
  BarChart3,
} from 'lucide-react';

export function NuvexaSidebar() {
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
    user,
  } = useNuvexa();

  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { tab: NuvexaViewTab; label: string; icon: React.ElementType }[] = [
    { tab: 'chat', label: 'AI Chat', icon: MessageSquare },
    { tab: 'creator', label: 'Creator Studio', icon: Video },
    { tab: 'autopilot', label: 'Autopilot Center', icon: Rocket },
    { tab: 'research', label: 'Research & Citations', icon: Search },
    { tab: 'code', label: 'Code Workspace', icon: Code2 },
    { tab: 'tasks', label: 'Task Planner', icon: CheckSquare },
    { tab: 'analytics', label: 'Analytics & Growth', icon: BarChart3 },
    { tab: 'settings', label: 'Settings & Privacy', icon: Settings },
  ];

  const isOllamaOnline = providerHealth?.ollama.status === 'online';

  const filteredConversations = conversations.filter((c) =>
    (c.title || 'Untitled Chat').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[#1E2A4A] bg-[#070D1F] p-3 text-sm select-none">
      {/* Primary Navigation Tabs */}
      <div className="space-y-1 mb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-[#94A3B8] hover:bg-[#0B132B] hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-[#64748B]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Projects Scoping */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
          <span>Projects</span>
          <FolderKanban className="h-3 w-3" />
        </div>
        <div className="mt-1 space-y-1">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProject(p)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition ${
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

      {/* Conversations History */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
          <span>Conversations ({conversations.length})</span>
          <button
            onClick={() => createNewConversation()}
            className="text-cyan-400 hover:text-cyan-300"
            title="Start New Chat"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search Bar for Chats */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter chats..."
            className="w-full rounded-md border border-[#1E2A4A] bg-[#030712] py-1 pl-7 pr-2 text-[11px] text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-[#64748B]">
              {searchQuery ? 'No matching chats found.' : 'No conversations yet.'}
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = activeConversation?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConversation(c);
                    setActiveTab('chat');
                  }}
                  className={`group flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs transition ${
                    isSelected
                      ? 'bg-[#0B132B] text-white border border-cyan-500/30 font-medium'
                      : 'text-[#94A3B8] hover:bg-[#0B132B]/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {c.isPinned && <Pin className="h-3 w-3 text-cyan-400 shrink-0" />}
                    <span className="truncate">{c.title || 'Untitled Chat'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Status & Session Info */}
      <div className="mt-auto border-t border-[#1E2A4A] pt-3 space-y-2">
        {/* Local Provider Health */}
        <div className="flex items-center justify-between rounded-lg bg-[#030712] p-2 text-xs border border-[#1E2A4A]">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] text-[#94A3B8]">Ollama Engine</span>
          </div>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isOllamaOnline
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isOllamaOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {/* User Isolation Badge */}
        <div className="flex items-center justify-between px-1 text-[11px] text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="truncate max-w-[120px]">{user.name}</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">NON-FIREBASE</span>
        </div>
      </div>
    </aside>
  );
}
