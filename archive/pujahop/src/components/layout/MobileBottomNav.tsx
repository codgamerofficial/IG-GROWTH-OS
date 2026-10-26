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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08070D]/95 backdrop-blur-2xl border-t border-white/10 px-3 pt-2 pb-[max(0.65rem,calc(env(safe-area-inset-bottom,0px)+0.35rem))] flex items-center justify-around shadow-[0_-12px_32px_rgba(0,0,0,0.8)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`relative flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-2xl text-[10px] font-medium transition-all duration-200 active:scale-95 ${
              isActive
                ? 'text-[#F5D887] font-bold bg-[#D6A84F]/10 border border-[#D6A84F]/25 shadow-sm shadow-amber-950/50'
                : 'text-[#B7B1BC] hover:text-[#FFF7E8]'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'text-[#D6A84F] scale-110 drop-shadow-[0_0_8px_rgba(214,168,79,0.5)]' : 'text-[#B7B1BC]'
                }`}
              />
              {item.id === 'route' && currentTrip && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#E53935] animate-pulse" />
              )}
            </div>
            <span className="tracking-tight">{item.label}</span>
            {isActive && (
              <span className="absolute -bottom-0.5 w-3 h-0.5 rounded-full bg-[#D6A84F] shadow-[0_0_6px_#D6A84F]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
