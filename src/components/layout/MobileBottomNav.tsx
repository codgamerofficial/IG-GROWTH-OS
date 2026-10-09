'use client';

// =============================================================================
// PujaHop Kolkata: Mobile Bottom Navigation Bar (PWA-Ready)
// =============================================================================

import React from 'react';
import { usePujaHop, NavigationTab } from '@/context/PujaHopContext';
import { Home, MapPin, Route, Train, Award, Settings, Compass } from 'lucide-react';

export function MobileBottomNav() {
  const { activeTab, setActiveTab, currentTrip } = usePujaHop();

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: MapPin },
    { id: 'route', label: 'Route', icon: Route },
    { id: 'pandals', label: 'Puja', icon: Compass },
    { id: 'passport', label: 'Passport', icon: Award },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (_) {}
    }
    setActiveTab(tabId);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090814]/95 backdrop-blur-xl border-t border-white/10 px-3 pt-2 pb-[max(0.65rem,calc(env(safe-area-inset-bottom,0px)+0.35rem))] flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-[10px] font-medium transition-all duration-200 active:scale-95 ${
              isActive ? 'text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 shadow-sm shadow-amber-950/40' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-amber-400 scale-110' : 'text-zinc-400'}`} />
              {item.id === 'route' && currentTrip && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
