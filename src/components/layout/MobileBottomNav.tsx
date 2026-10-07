'use client';

// =============================================================================
// IG GrowthOS: Mobile Bottom Navigation
// =============================================================================

import React from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { LayoutDashboard, Calendar, Sparkles, CheckSquare, BarChart3 } from 'lucide-react';

export function MobileBottomNav() {
  const { activeTab, setActiveTab, contentItems } = useGrowthOS();

  const pendingApprovalsCount = contentItems.filter(
    (item) => item.approval_status === 'PENDING'
  ).length;

  const items = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'calendar', label: 'Content', icon: Calendar },
    { id: 'studio', label: 'Create', icon: Sparkles },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, badge: pendingApprovalsCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-white/10 bg-[#09090B]/95 backdrop-blur-xl px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-pink-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
