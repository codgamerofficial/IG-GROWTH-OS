'use client';

// =============================================================================
// IG GrowthOS: 15-Section Sidebar Navigation
// =============================================================================

import React from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import {
  LayoutDashboard,
  Calendar,
  Lightbulb,
  FileText,
  CheckSquare,
  Clock,
  Send,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Zap,
  Instagram,
  Tag,
  Settings,
} from 'lucide-react';

import { Logo } from '@/components/brand/Logo';

export function Sidebar() {
  const { activeTab, setActiveTab, contentItems } = useGrowthOS();

  const pendingApprovalsCount = contentItems.filter(
    (item) => item.approval_status === 'PENDING'
  ).length;

  const scheduledCount = contentItems.filter(
    (item) => item.status === 'SCHEDULED'
  ).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      icon: Clock,
      badge: scheduledCount > 0 ? scheduledCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    { id: 'published', label: 'Published', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'studio', label: 'AI Studio', icon: Sparkles },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'connection', label: 'Instagram Connection', icon: Instagram },
    { id: 'brands', label: 'Brands', icon: Tag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-[#070812] p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Sidebar Header Brand Lockup (Section 13) */}
      <div className="px-2 pt-1 pb-4 mb-2 border-b border-white/10">
        <Logo variant="horizontal" size="sm" showTagline={true} />
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-2">
        Command Center
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/10 text-white border border-rose-500/30 shadow-sm'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-rose-400' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.badgeColor || 'bg-white/10 text-zinc-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Brand Pill in footer */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">RIIQX Fashion</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Active Brand • Gen Z Streetwear</p>
        </div>
      </div>
    </aside>
  );
}
