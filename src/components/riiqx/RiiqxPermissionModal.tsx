'use client';

// =============================================================================
// RIIQX — Consequential Action Boundary Confirmation Modal
// Protects Against Accidental Data Loss, Public Publishing & Spending Overrides
// =============================================================================

import React from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export function RiiqxPermissionModal() {
  const { pendingPermissionTask, grantPermission, denyPermission } = useRiiqx();

  if (!pendingPermissionTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#070D1F] p-6 shadow-2xl space-y-5 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Authorization Required</h2>
            <p className="text-xs text-[#94A3B8]">Consequential Action Boundary Gate</p>
          </div>
        </div>

        <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 text-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Proposed Action
          </span>
          <p className="font-mono text-white leading-relaxed">
            {pendingPermissionTask.description}
          </p>
        </div>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          RIIQX enforces bounded Level 3 autonomy. This operation involves external side effects or system changes. Do you authorize this execution?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={denyPermission}
            className="flex items-center gap-1.5 rounded-xl border border-[#1E2A4A] bg-[#0B132B] px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white transition"
          >
            <XCircle className="h-4 w-4" />
            <span>Deny &amp; Halt</span>
          </button>
          <button
            onClick={grantPermission}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-900/40 hover:brightness-110 transition"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Authorize Execution</span>
          </button>
        </div>
      </div>
    </div>
  );
}
