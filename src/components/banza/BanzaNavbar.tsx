'use client';

// =============================================================================
// BANZA — AI Twin Header Navigation
// Warm Ivory Canvas • Signature Banza Orange Pill • Seamless Workspace Switching
// =============================================================================

import React from 'react';
import { Sparkles, ArrowRight, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useRiiqx } from '@/context/RiiqxContext';

interface BanzaNavbarProps {
  currentMode: 'landing' | 'twin_live' | 'profile';
  onModeChange: (mode: 'landing' | 'twin_live' | 'profile') => void;
}

export function BanzaNavbar({ currentMode, onModeChange }: BanzaNavbarProps) {
  const { theme, toggleTheme } = useRiiqx();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5]/90 dark:bg-[#0E0E10]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div
          onClick={() => onModeChange('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF7A00] text-white shadow-xs transition-transform group-hover:scale-105">
            <span className="font-black text-lg tracking-tighter">b</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
              banza
            </span>
            <span className="h-2 w-2 rounded-full bg-[#FF5722]" />
          </div>
        </div>

        {/* Navigation Mode Pills */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-[#EAE3D9] dark:border-[#26262B] bg-white/60 dark:bg-[#18181C]/60 p-1 backdrop-blur-sm">
          <button
            onClick={() => onModeChange('landing')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              currentMode === 'landing'
                ? 'bg-[#1A1817] text-white dark:bg-white dark:text-[#1A1817] shadow-xs'
                : 'text-[#6B6661] dark:text-[#A3A3A3] hover:text-[#1A1817] dark:hover:text-white'
            }`}
          >
            Overview &amp; Story
          </button>
          <button
            onClick={() => onModeChange('twin_live')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              currentMode === 'twin_live'
                ? 'bg-[#FF5722] text-white shadow-xs'
                : 'text-[#6B6661] dark:text-[#A3A3A3] hover:text-[#FF5722]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ask Your Twin (Live)</span>
          </button>
          <button
            onClick={() => onModeChange('profile')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              currentMode === 'profile'
                ? 'bg-[#1A1817] text-white dark:bg-white dark:text-[#1A1817] shadow-xs'
                : 'text-[#6B6661] dark:text-[#A3A3A3] hover:text-[#1A1817] dark:hover:text-white'
            }`}
          >
            Twin Profile &amp; Memory
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-[#6B6661] dark:text-[#A3A3A3] hover:bg-[#EAE3D9]/50 dark:hover:bg-[#26262B] transition-colors"
            title="Toggle Light / Dark"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => onModeChange('twin_live')}
            className="flex items-center gap-2 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white px-4 py-2 text-xs font-black shadow-xs transition-transform active:scale-95"
          >
            <span>Ask AI Twin</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

