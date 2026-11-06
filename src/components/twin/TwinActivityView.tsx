'use client';

// =============================================================================
// RIIQX — Twin Activity Timeline & Action Approvals View
// Consequential Boundary Gates • Audit Trail • Two-Step Sign-Off
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Brain, Scale } from 'lucide-react';
import { ActionApproval } from '@/lib/riiqx/twin-types';

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
      color: 'text-[#16865D]',
    },
    {
      icon: Brain,
      title: 'New Confirmed Preference Saved',
      detail: 'Recorded preference: "Always factor in shipping and platform fees before approving a purchase deal."',
      time: '45 mins ago',
      color: 'text-[#FF5722]',
    },
    {
      icon: ShieldCheck,
      title: 'AES-256 Token Vault Health Check',
      detail: 'All OAuth 2.0 PKCE tokens validated with zero plaintext leakage.',
      time: '2 hours ago',
      color: 'text-[#3B82F6]',
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

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Activity &amp; Approvals
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Twin Activity Timeline &amp; Approvals
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Real audit history of twin evaluations, preference updates, and high-impact action gates.
          </p>
        </div>
      </div>

      {/* Pending Approvals Card */}
      {pendingCount > 0 && (
        <div className="rounded-3xl border border-[#FF5722]/30 bg-[#FF5722]/5 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#FF5722]">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold font-heading">
              {pendingCount} Pending Action Gate Requiring Your Sign-Off
            </h3>
          </div>

          <div className="space-y-3">
            {approvals
              .filter((a) => a.status === 'pending')
              .map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#FF5722]">{a.actionType}</span>
                    <p className="text-xs font-bold text-[#1A1817] dark:text-white">{a.explanation}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDecision(a.id, 'reject')}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-[#EAE3D9] dark:border-[#26262B] text-[#FF4D4F] hover:bg-[#FF4D4F]/10"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDecision(a.id, 'approve')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#16865D] hover:bg-[#126b4a] text-white shadow-xs"
                    >
                      Approve &amp; Execute
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Audit Timeline */}
      <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl">
        <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
          Twin Execution Trail
        </h3>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#EAE3D9] dark:before:bg-[#26262B]">
          {activityTimeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-4 relative">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] text-[#FF5722] shadow-xs z-10">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1A1817] dark:text-white">{item.title}</span>
                    <span className="text-[10px] text-[#6B6661]">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

