'use client';

// =============================================================================
// RIIQX 2.0 — Modern Creator OS Top Header
// Global Search (⌘K / Ctrl+K) • AI Assistant Toggle • Theme Toggle • Profile Avatar
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxEmblem } from './RiiqxEmblem';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Bot,
  Command,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';

export function RiiqxHeader() {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    executeGlobalTask,
    isAiDrawerOpen,
    toggleAiDrawer,
    user,
    signOut,
  } = useRiiqx();

  const [searchVal, setSearchVal] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('riiqx-global-search');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    executeGlobalTask(searchVal.trim(), 'chat');
    setSearchVal('');
  };

  return (
    <header className="relative z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] bg-white/80 dark:bg-[#151515]/80 backdrop-blur-md px-4 md:px-6 transition-colors">
      {/* Left: Mobile Menu Trigger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-[#737373] hover:bg-[#FAF9F6] dark:hover:bg-[#202020] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          className="flex lg:hidden items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <RiiqxEmblem size={26} glow={false} />
          <span className="font-black text-lg tracking-tight text-[#202124] dark:text-white font-heading">
            RIIQX
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="riiqx-global-search"
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search tasks, videos, scripts... [Ctrl + K]"
            className="w-full pl-9 pr-14 py-2 rounded-2xl bg-[#FAF9F6] dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-xs text-[#202124] dark:text-white placeholder-[#737373] focus:outline-none focus:border-[#FFD43B] transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#EAE7E1] dark:bg-[#2E2E2E] text-[10px] font-bold text-[#737373] dark:text-[#A3A3A3]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </form>

      {/* Right Controls: AI Assistant Toggle, Theme, Notifications, Profile Avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Floating AI Assistant Toggle Button */}
        <button
          onClick={toggleAiDrawer}
          title={isAiDrawerOpen ? 'Close Floating Companion' : 'Open Floating Companion'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
            isAiDrawerOpen
              ? 'bg-[#FFD43B] text-[#202124] font-bold shadow-xs border border-[#FFD43B]'
              : 'bg-[#FAF9F6] dark:bg-[#202020] text-[#737373] dark:text-[#A3A3A3] hover:text-[#202124] dark:hover:text-white border border-[#EAE7E1] dark:border-[#2E2E2E]'
          }`}
        >
          <Bot className={`w-4 h-4 ${isAiDrawerOpen ? 'text-[#202124]' : 'text-[#FFD43B]'}`} />
          <span className="hidden md:inline">Companion</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-[#FAF9F6] dark:hover:bg-[#202020] transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FFD43B]" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications Bell */}
        <button
          title="Notifications"
          className="p-2 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-[#FAF9F6] dark:hover:bg-[#202020] transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4D4F]" />
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative pl-2 border-l border-[#EAE7E1] dark:border-[#2E2E2E]">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 cursor-pointer focus:outline-hidden"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD43B] to-[#FF6B5E] flex items-center justify-center text-[#202124] font-black text-xs shadow-xs">
              <span>{user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#16865D] border-2 border-white dark:border-[#151515]" />
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-11 w-56 p-2 rounded-2xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="p-2 border-b border-[#EAE7E1] dark:border-[#2E2E2E] mb-1">
                <p className="text-xs font-bold text-[#202124] dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-[#737373] dark:text-[#A3A3A3] truncate">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#202124] dark:text-white hover:bg-[#FAF9F6] dark:hover:bg-[#151515] flex items-center gap-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#737373]" />
                <span>Account &amp; Settings</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  signOut();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#FF4D4F] hover:bg-[#FF4D4F]/10 flex items-center gap-2 cursor-pointer mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 bg-white/95 dark:bg-[#151515]/95 backdrop-blur-xl border-b border-[#EAE7E1] dark:border-[#2E2E2E] p-4 shadow-xl z-50 space-y-1">
          {[
            { tab: 'home', label: 'Dashboard' },
            { tab: 'chat', label: 'AI Agent Chat' },
            { tab: 'creator', label: 'Creator Studio' },
            { tab: 'autopilot', label: 'Autopilot Center' },
            { tab: 'tasks', label: 'Task Planner' },
            { tab: 'research', label: 'Deep Research' },
            { tab: 'code', label: 'Code Studio' },
            { tab: 'integrations', label: 'Integrations' },
            { tab: 'analytics', label: 'Analytics & Growth' },
            { tab: 'files', label: 'Library' },
            { tab: 'settings', label: 'Settings' },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab as any);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                activeTab === item.tab
                  ? 'bg-[#FFD43B] text-[#202124] font-bold shadow-xs'
                  : 'text-[#737373] dark:text-[#A3A3A3] hover:bg-[#FAF9F6] dark:hover:bg-[#202020]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
