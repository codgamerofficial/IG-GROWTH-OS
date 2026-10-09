'use client';

// =============================================================================
// PujaHop Kolkata: Primary Header Component
// Includes: Date Selector with Pre-Puja badge, Live Weather pill, SOS & AI Copilot triggers
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { Logo } from '@/components/brand/Logo';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { PUJA_CALENDAR_2026, isPrePujaDate } from '@/lib/data/kolkata-calendar';
import {
  Sparkles,
  CloudSun,
  AlertOctagon,
  Calendar,
  Compass,
  Train,
  ShieldAlert,
} from 'lucide-react';

export function Header() {
  const {
    selectedDate,
    setSelectedDate,
    weather,
    setCopilotOpen,
    copilotOpen,
    setSosOpen,
    setWizardOpen,
  } = usePujaHop();

  const isPrePuja = isPrePujaDate(selectedDate);
  const currentCal = PUJA_CALENDAR_2026.find((c) => c.date === selectedDate);

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-hidden border-b border-amber-500/10 bg-[#0A0915]/95 backdrop-blur-xl">
      <div className="flex h-14 sm:h-16 items-center justify-between px-2.5 sm:px-4 md:px-6 w-full max-w-full min-w-0 gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
          <Logo variant="horizontal" size="sm" showTagline={false} />
          {isPrePuja && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/30 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              PRE-PUJA MODE
            </span>
          )}
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* 2026 Canonical Date Switcher */}
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-2 sm:px-3 py-1.5 text-xs text-white shadow-sm max-w-[105px] min-[390px]:max-w-[125px] sm:max-w-none min-w-0">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-400 shrink-0" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1 text-xs truncate w-full"
              aria-label="Select Durga Puja trip date"
            >
              {PUJA_CALENDAR_2026.map((day) => (
                <option key={day.date} value={day.date} className="bg-[#121124] text-white py-1">
                  {day.display_label || `${day.date} • ${day.tithi_name}`}
                </option>
              ))}
            </select>
          </div>

          {/* Live Weather Pill */}
          {weather && (
            <div className="hidden lg:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-zinc-200">
              <CloudSun className="w-3.5 h-3.5 text-amber-300" />
              <span>{weather.temperature_c}°C</span>
              <span className="text-[10px] text-zinc-400 font-normal">Kolkata</span>
            </div>
          )}

          {/* Emergency Push Notification Bell */}
          <NotificationBell />

          {/* Emergency SOS Button */}
          <button
            onClick={() => setSosOpen(true)}
            className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors shrink-0"
            title="Emergency SOS & Medical"
            aria-label="Emergency SOS"
          >
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            <span className="hidden md:inline ml-1">SOS</span>
          </button>

          {/* AI Copilot Trigger */}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition-all active:scale-95 shrink-0"
            title="Puja Copilot AI"
            aria-label="Puja Copilot AI"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
            <span className="hidden md:inline ml-1">Copilot</span>
          </button>
        </div>
      </div>
    </header>
  );
}
