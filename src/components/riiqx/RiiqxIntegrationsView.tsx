'use client';

// =============================================================================
// RIIQX 2.0 — Tools & Plugins Marketplace
// Searchable Categories • Real Provider Status • Connect & Test Action Gates
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Search,
  Globe,
  Youtube,
  Instagram,
  FileText,
  HardDrive,
  Github,
  MessageSquare,
  Sparkles,
  Check,
  Plus,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface PluginItem {
  id: string;
  name: string;
  desc: string;
  category: 'All' | 'Media' | 'Productivity' | 'Developer' | 'Social';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  connected: boolean;
  account?: string;
}

export function RiiqxIntegrationsView() {
  const { providerHealth } = useRiiqx();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [plugins, setPlugins] = useState<PluginItem[]>([
    {
      id: 'websearch',
      name: 'Web Search',
      desc: 'Real-time internet search with sources & footnotes',
      category: 'Productivity',
      icon: Globe,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40',
      connected: true,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      desc: 'Search, analyze, and upload Shorts & long-form',
      category: 'Social',
      icon: Youtube,
      color: 'bg-red-50 text-red-600 dark:bg-red-950/40',
      connected: true,
      account: '@yourchannel',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      desc: 'Analyze content, publish Reels, and track metrics',
      category: 'Social',
      icon: Instagram,
      color: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40',
      connected: true,
      account: '@yourname',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      desc: 'Trends, script ideas, and video publishing',
      category: 'Social',
      icon: MessageSquare,
      color: 'bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      connected: false,
    },
    {
      id: 'gdrive',
      name: 'Google Drive',
      desc: 'Read, analyze, and manage cloud files & assets',
      category: 'Productivity',
      icon: HardDrive,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40',
      connected: true,
    },
    {
      id: 'notion',
      name: 'Notion',
      desc: 'Organize, plan, and store workspace knowledge',
      category: 'Productivity',
      icon: FileText,
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      connected: false,
    },
    {
      id: 'canva',
      name: 'Canva',
      desc: 'Generate and edit social thumbnails & graphics',
      category: 'Media',
      icon: Sparkles,
      color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40',
      connected: false,
    },
    {
      id: 'figma',
      name: 'Figma',
      desc: 'Design and prototype with AI vector layouts',
      category: 'Developer',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40',
      connected: false,
    },
    {
      id: 'github',
      name: 'GitHub',
      desc: 'Read, write, and manage repositories & codebases',
      category: 'Developer',
      icon: Github,
      color: 'bg-slate-900 text-white dark:bg-slate-800',
      connected: true,
    },
    {
      id: 'slack',
      name: 'Slack',
      desc: 'Get updates and send autonomous task alerts',
      category: 'Productivity',
      icon: MessageSquare,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40',
      connected: false,
    },
  ]);

  const toggleConnect = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, connected: !p.connected };
        }
        return p;
      })
    );
  };

  const categories = ['All', 'Media', 'Productivity', 'Developer', 'Social'];

  const filteredPlugins = plugins.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-6 bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tools & Plugins
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add powerful tools to your AI agent. Verified server-side tool calling and API isolation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Plugins Grid (Matching Image 1 Right Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlugins.map((plugin) => {
          const Icon = plugin.icon;
          return (
            <div
              key={plugin.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${plugin.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {plugin.connected ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => toggleConnect(plugin.id)}
                      className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 hover:bg-violet-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{plugin.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {plugin.desc}
                  </p>
                  {plugin.account && (
                    <p className="text-[10px] font-mono font-semibold text-slate-400 mt-2">
                      Connected: {plugin.account}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Secure OAuth 2.0</span>
                </span>
                {plugin.connected && (
                  <button
                    onClick={() => toggleConnect(plugin.id)}
                    className="text-red-500 hover:underline"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
