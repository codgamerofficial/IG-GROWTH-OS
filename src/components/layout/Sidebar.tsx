'use client';

// =============================================================================
// PujaHop Kolkata: Desktop Navigation Sidebar
// =============================================================================

import React from 'react';
import { usePujaHop, NavigationTab } from '@/context/PujaHopContext';
import {
  Home,
  MapPin,
  Route,
  Train,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  ShieldCheck,
  Compass,
  Info,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function Sidebar() {
  const { activeTab, setActiveTab, currentTrip, visits, trafficAlerts } = usePujaHop();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', labelBn: 'মূল পাতা', icon: Home },
    { id: 'explore', label: 'Explore Map', labelBn: 'ম্যাপ দেখুন', icon: MapPin },
    {
      id: 'route',
      label: 'My Route',
      labelBn: 'আমার রুট',
      icon: Route,
      badge: currentTrip ? `${currentTrip.total_pandals}` : undefined,
    },
    { id: 'metro', label: 'Metro', labelBn: 'মেট্রো', icon: Train },
    { id: 'pandals', label: 'Pandals', labelBn: 'প্যান্ডেল তালিকা', icon: Compass },
    {
      id: 'passport',
      label: 'Passport',
      labelBn: 'পাসপোর্ট',
      icon: Award,
      badge: visits.length > 0 ? `${visits.length}` : undefined,
    },
    { id: 'stats', label: 'Trip Stats', labelBn: 'পরিসংখ্যান', icon: BarChart3 },
    {
      id: 'admin',
      label: 'Admin Panel',
      labelBn: 'অ্যাডমিন',
      icon: ShieldCheck,
    },
    { id: 'settings', label: 'API Health', labelBn: 'সেটিংস ও হেলথ', icon: Settings },
    { id: 'about', label: 'About & Creator', labelBn: 'পরিচিতি ও রূপকার', icon: Info },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-[#070611] p-4 text-zinc-300">
      <div className="text-xs font-semibold uppercase tracking-wider text-amber-500/80 px-3 mb-2">
        Kolkata Puja 2026
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600/30 to-amber-500/20 text-white border border-rose-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Traffic Alert Banner */}
      {trafficAlerts.length > 0 && (
        <div className="mt-auto p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
          <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Traffic Advisory Active
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            {trafficAlerts[0].title}
          </p>
        </div>
      )}

      {/* Creator Attribution */}
      <div className="pt-3 mt-2 border-t border-white/5 text-[10px] text-zinc-500 space-y-0.5 px-1">
        <div className="text-zinc-300 font-medium flex items-center justify-between">
          <span>PujaHop Kolkata</span>
          <span className="text-amber-500/80 font-mono text-[9px]">2026</span>
        </div>
        <div className="text-zinc-400">Created &amp; Conceptualized by</div>
        <div className="text-amber-400 font-semibold text-[11px]">Saswata Dey (Riik)</div>
      </div>
    </aside>
  );
}
