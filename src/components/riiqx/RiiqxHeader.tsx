'use client';

// =============================================================================
// RIIQX — Modern Autonomous Twin Top Header
// Personal Twin Search (⌘K / Ctrl+K) • Twin Companion Toggle • Notifications • Obsidian Glass
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxEmblem } from './RiiqxEmblem';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Command,
  Menu,
  X,
  LogOut,
  User,
  ShieldCheck,
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
    executeGlobalTask(searchVal.trim(), 'twin');
    setSearchVal('');
  };

  const resolvedDisplayName =
    user?.name && user.name !== 'RIIQX Creator' && user.name !== 'RIIQX Studio'
      ? user.name
      : 'RIIQX Twin';

  const userInitial = resolvedDisplayName.slice(0, 1).toUpperCase();

  return (
    <header className="relative z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.06] bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-2xl px-4 md:px-6 transition-colors">
      {/* Left: Mobile Menu Trigger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-zinc-500 hover:bg-[#FAF9F6] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          className="flex lg:hidden items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab('home')}
        >
          <RiiqxEmblem size={26} glow={true} />
          <span className="font-black text-lg tracking-tight text-[#202124] dark:text-white font-heading">
            RIIQX
          </span>
        </div>
      </div>

      {/* Center: Global Personal Twin Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full group">
          <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            id="riiqx-global-search"
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search decisions, products, stores, memories... [Ctrl + K]"
            className="w-full pl-9 pr-14 py-2 rounded-2xl bg-[#FAF9F6] dark:bg-zinc-950/70 border border-[#EAE7E1] dark:border-white/[0.08] text-xs text-[#202124] dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#EAE7E1] dark:bg-zinc-900 border border-transparent dark:border-white/[0.06] text-[10px] font-bold text-zinc-600 dark:text-zinc-400 select-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </form>

      {/* Right Controls: AI Assistant Toggle, Theme, Notifications, Profile Avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Floating Twin Companion Toggle Button */}
        <button
          onClick={toggleAiDrawer}
          title={isAiDrawerOpen ? 'Close Floating Companion' : 'Open Twin Companion'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            isAiDrawerOpen
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/20 border border-orange-400/40'
              : 'bg-[#FAF9F6] dark:bg-zinc-950/70 text-zinc-600 dark:text-zinc-300 hover:text-[#202124] dark:hover:text-white border border-[#EAE7E1] dark:border-white/[0.08] hover:border-orange-500/30'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isAiDrawerOpen ? 'text-white' : 'text-orange-400'}`} />
          <span className="hidden md:inline">Twin Companion</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-zinc-500 hover:text-[#202124] dark:hover:text-white hover:bg-[#FAF9F6] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Notifications Bell */}
        <button
          title="Notifications"
          className="p-2 rounded-xl text-zinc-500 hover:text-[#202124] dark:hover:text-white hover:bg-[#FAF9F6] dark:hover:bg-white/[0.05] transition-colors relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]" />
        </button>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative pl-2 border-l border-[#EAE7E1] dark:border-white/[0.08]">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-orange-500/20">
              <span>{userInitial}</span>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#09090b] shadow-[0_0_6px_#10b981]" />
            </div>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-11 w-60 p-2.5 rounded-2xl bg-white dark:bg-[#09090b]/95 backdrop-blur-2xl border border-[#EAE7E1] dark:border-white/[0.12] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="p-2.5 border-b border-[#EAE7E1] dark:border-white/[0.08] mb-1.5">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <p className="text-xs font-bold text-[#202124] dark:text-white truncate">
                    {resolvedDisplayName}
                  </p>
                  <span className="text-[9px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 rounded-full">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {user.email || 'twin@riiqx.ai'}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Level 2 Autonomy • Active</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-[#202124] dark:text-zinc-200 hover:bg-[#FAF9F6] dark:hover:bg-white/[0.06] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Account &amp; Twin Settings</span>
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  signOut();
                }}
                className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer mt-1 transition-colors"
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
        <div className="lg:hidden fixed inset-x-0 top-14 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-2xl border-b border-[#EAE7E1] dark:border-white/[0.08] p-4 shadow-2xl z-50 space-y-1">
          {[
            { tab: 'home', label: 'Home' },
            { tab: 'twin', label: 'My Twin' },
            { tab: 'decisions', label: 'Decisions' },
            { tab: 'opportunities', label: 'Opportunities' },
            { tab: 'lifestyle', label: 'Lifestyle' },
            { tab: 'rewards', label: 'Rewards' },
            { tab: 'digest', label: 'Weekly Intelligence' },
            { tab: 'connections', label: 'Connections' },
            { tab: 'activity', label: 'Activity' },
            { tab: 'settings', label: 'Settings' },
          ].map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setActiveTab(item.tab as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-white font-bold border border-orange-500/30'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-[#FAF9F6] dark:hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
