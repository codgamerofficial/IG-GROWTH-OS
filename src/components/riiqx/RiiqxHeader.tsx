'use client';

// =============================================================================
// RIIQX 2.0 — Modern Creator OS Top Header
// Global Search (⌘K) • Notifications • Theme Toggle • Profile Avatar
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxEmblem } from './RiiqxEmblem';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  Sparkles,
  Command,
} from 'lucide-react';

export function RiiqxHeader() {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    executeGlobalTask,
  } = useRiiqx();

  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    executeGlobalTask(searchVal.trim(), 'chat');
    setSearchVal('');
  };

  return (
    <header className="relative z-30 flex h-14 md:h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-6 transition-colors">
      {/* Left: Mobile Menu Trigger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex lg:hidden items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white shadow-xs">
            <RiiqxEmblem size={16} />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            RIIQX
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar (Matching Image 1) */}
      <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search tools, files, projects..."
            className="w-full pl-9 pr-12 py-1.5 md:py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-xs md:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </form>

      {/* Right Controls: Theme Toggle, Notifications, Profile Avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Bell with unread dot */}
        <div className="relative">
          <button
            title="Notifications"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white dark:ring-slate-900" />
        </div>

        {/* Profile Avatar Badge (Matching Image 1) */}
        <div
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover ring-2 ring-violet-500/20"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              RIIQX Pro
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">Pro Plan</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block ml-0.5" />
        </div>
      </div>

      {/* Mobile Navigation Drawer Modal */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-72 bg-white dark:bg-slate-900 h-full p-4 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white">
                    <RiiqxEmblem size={16} />
                  </div>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">RIIQX</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { tab: 'home' as const, label: 'Home' },
                  { tab: 'chat' as const, label: 'AI Agent Chat' },
                  { tab: 'creator' as const, label: 'Creator Studio' },
                  { tab: 'editor' as const, label: 'AI Video Editor' },
                  { tab: 'autopilot' as const, label: 'Autopilot Center' },
                  { tab: 'tasks' as const, label: 'Task Planner' },
                  { tab: 'research' as const, label: 'Deep Research' },
                  { tab: 'code' as const, label: 'Code Studio' },
                  { tab: 'integrations' as const, label: 'Integrations' },
                  { tab: 'analytics' as const, label: 'Analytics' },
                  { tab: 'files' as const, label: 'Library' },
                  { tab: 'settings' as const, label: 'Settings' },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      activeTab === item.tab
                        ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200">RIIQX 2.0</p>
              <p className="text-[10px] text-slate-400">One Goal. An AI That Gets It Done.</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
