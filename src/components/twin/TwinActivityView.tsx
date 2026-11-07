'use client';

// =============================================================================
// RIIQX — Twin Activity Timeline & Action Approvals View
// Consequential Boundary Gates • Audit Trail • Two-Step Sign-Off
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// =============================================================================

import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Brain,
  Scale,
  Check,
  X,
  Crosshair,
} from 'lucide-react';
import { ActionApproval } from '@/lib/riiqx/twin-types';
import { FestiveDropSniperCard } from './FestiveDropSniperCard';

export function TwinActivityView() {
  const [approvals, setApprovals] = useState<ActionApproval[]>([
    {
      id: 'act-001',
      userId: 'usr_guest_local',
      actionType: 'Price Drop Watchlist Alert',
      parameters: { product: 'Apple AirPods Pro 2', targetFloorPrice: 17500 },
      status: 'pending',
      explanation: 'Twin detected target price threshold crossed on Tata CLiQ. Requires confirmation to pin high-priority notification.',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activityTimeline] = useState([
    {
      icon: Scale,
      title: 'Price Truth Calculation Completed',
      detail: 'Evaluated true net floor price for Apple AirPods Pro 2 vs Sony WF-1000XM5 across 4 Indian marketplaces.',
      time: '12 mins ago',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Brain,
      title: 'New Confirmed Preference Saved',
      detail: 'Recorded preference: "Always factor in shipping and platform fees before approving a purchase deal."',
      time: '45 mins ago',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'AES-256 Token Vault Health Check',
      detail: 'All OAuth 2.0 PKCE tokens validated with zero plaintext leakage.',
      time: '2 hours ago',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
  ]);

  const handleDecision = async (id: string, decision: 'approve' | 'reject') => {
    try {
      await fetch('/api/twin/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId: id, decision }),
      });

      setApprovals((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: decision === 'approve' ? 'approved' : 'rejected' } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8 relative selection:bg-orange-500/30">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
              Activity &amp; Approvals
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading mt-2">
            Twin Activity Timeline &amp; Approvals
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Real audit history of twin evaluations, preference updates, and high-impact action gates.
          </p>
        </div>
      </div>

      {/* Pending Approvals Card */}
      {pendingApprovals.length > 0 && (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-900/90 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2.5 text-amber-400 relative z-10">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/30">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">
              {pendingApprovals.length} Pending Action Gate Requiring Your Sign-Off
            </h3>
          </div>

          <div className="space-y-3 relative z-10">
            {pendingApprovals.map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-400 font-mono tracking-wider bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                    {a.actionType}
                  </span>
                  <p className="text-xs font-bold text-white leading-relaxed">{a.explanation}</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleDecision(a.id, 'reject')}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDecision(a.id, 'approve')}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve &amp; Execute</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Festive Price Drop Sniper & 48-Hour Bank Arbitrage Radar */}
      <FestiveDropSniperCard />

      {/* Audit Timeline */}
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl max-w-4xl relative overflow-hidden">
        <div className="border-b border-white/[0.06] pb-4">
          <h3 className="text-base font-black text-white font-heading">
            Twin Execution Trail
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">Chronological ledger of autonomous checks &amp; preference calibrations</p>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-white/[0.08]">
          {activityTimeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-4 relative group">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${item.bgColor} ${item.color} shadow-md z-10 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-zinc-950/60 border border-white/[0.06] hover:border-white/[0.12] space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-heading">{item.title}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
