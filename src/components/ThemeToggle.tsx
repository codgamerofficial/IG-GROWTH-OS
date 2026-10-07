'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, Theme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'segmented' | 'compact';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'segmented',
  className = '',
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const getTooltip = () => {
    if (theme === 'dark') return 'Dark mode';
    if (theme === 'light') return 'Light mode';
    return 'System appearance';
  };

  if (variant === 'compact') {
    const isDark = resolvedTheme === 'dark';
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center h-9 w-16 p-1 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EFA3B5] ${
          isDark
            ? 'bg-[#151519] border-white/10 shadow-[0_0_15px_rgba(239,163,181,0.15)]'
            : 'bg-white border-[#E9DFDA] shadow-sm'
        } ${className}`}
        aria-label={`Current: ${getTooltip()}. Click to switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch appearance (${getTooltip()})`}
      >
        <span className="sr-only">Toggle appearance mode</span>

        {/* Sliding Thumb */}
        <span
          className={`pointer-events-none flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-300 ease-out shadow-sm ${
            isDark
              ? 'translate-x-7 bg-gradient-to-tr from-[#1B1B21] to-[#25252D] text-[#EFA3B5] border border-white/15'
              : 'translate-x-0 bg-gradient-to-tr from-white to-[#F5F0EC] text-[#C87588] border border-[#E9DFDA]'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 transition-transform duration-300 rotate-0" />
          ) : (
            <Sun className="w-3.5 h-3.5 transition-transform duration-300 rotate-0" />
          )}
        </span>

        {/* Inactive Icon in Background */}
        <span
          className={`absolute flex items-center justify-center w-7 h-7 pointer-events-none transition-opacity duration-200 text-xs ${
            isDark
              ? 'left-1 text-[#817980] opacity-40 hover:opacity-70'
              : 'right-1 text-[#8A8184] opacity-40 hover:opacity-70'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </span>
      </button>
    );
  }

  // Segmented 3-Way Control: [ ☀ Light | ◐ System | ☾ Dark ]
  const options: { id: Theme; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'system', label: 'System', icon: Laptop },
    { id: 'dark', label: 'Dark', icon: Moon },
  ];

  return (
    <div
      role="group"
      aria-label="Theme appearance options"
      title={`Switch appearance (${getTooltip()})`}
      className={`inline-flex items-center p-1 rounded-full border transition-all duration-300 ${
        resolvedTheme === 'dark'
          ? 'bg-[#111114]/90 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.35)]'
          : 'bg-[#F5F0EC]/80 border-[#E9DFDA] shadow-sm'
      } ${className}`}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={`relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-250 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EFA3B5] ${
              isActive
                ? resolvedTheme === 'dark'
                  ? 'bg-[#1B1B21] text-[#FAF7F8] shadow-[0_2px_10px_rgba(0,0,0,0.4)] border border-white/10'
                  : 'bg-white text-[#171416] shadow-sm border border-[#E9DFDA]'
                : resolvedTheme === 'dark'
                ? 'text-[#B9B2B7] hover:text-[#FAF7F8] hover:bg-white/5'
                : 'text-[#6F6769] hover:text-[#171416] hover:bg-black/5'
            }`}
            aria-pressed={isActive}
            aria-label={`${opt.label} mode`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isActive
                  ? resolvedTheme === 'dark'
                    ? 'text-[#EFA3B5] scale-105'
                    : 'text-[#C87588] scale-105'
                  : ''
              }`}
            />
            <span className="hidden sm:inline text-[11px] font-sans tracking-wide">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
