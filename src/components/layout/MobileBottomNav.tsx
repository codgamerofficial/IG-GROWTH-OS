'use client';

// =============================================================================
// PujaHop Kolkata: Mobile Bottom Navigation Bar (PWA-Ready)
// =============================================================================

import React from 'react';
import { usePujaHop, NavigationTab } from '@/context/PujaHopContext';
import { Home, MapPin, Route, Train, Award, Settings, Compass } from 'lucide-react';

export function MobileBottomNav() {
  const { activeTab, setActiveTab, currentTrip, visits } = usePujaHop();

  const navItems: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: MapPin },
    { id: 'route', label: 'Route', icon: Route },
    { id: 'pandals', label: 'Puja', icon: Compass },
    { id: 'passport', label: 'Passport', icon: Award },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090814]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
              isActive ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 scale-110' : 'text-zinc-400'}`} />
              {item.id === 'route' && currentTrip && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
