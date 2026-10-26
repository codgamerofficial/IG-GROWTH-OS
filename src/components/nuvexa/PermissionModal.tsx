'use client';

import React from 'react';
import { useNuvexa } from '@/context/NuvexaContext';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export function PermissionModal() {
  const { pendingPermission, closePermissionModal } = useNuvexa();

  if (!pendingPermission || !pendingPermission.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-amber-500/40 bg-[#070D1F] p-6 shadow-2xl">
        <button
          onClick={closePermissionModal}
          className="absolute right-4 top-4 text-[#64748B] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Consequential Action Authorization</h3>
            <span className="text-[11px] font-mono text-amber-400">Policy: Human-in-the-Loop Required</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#1E2A4A] bg-[#030712] p-3 text-xs space-y-1.5">
          <div className="text-[#94A3B8]">
            <strong className="text-white">Step:</strong> {pendingPermission.stepTitle}
          </div>
          <div className="text-[#94A3B8]">
            <strong className="text-white">Tool Target:</strong>{' '}
            <code className="text-cyan-400 font-mono">{pendingPermission.toolName}</code>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
            {pendingPermission.description}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={pendingPermission.onDeny}
            className="rounded-xl border border-[#1E2A4A] bg-[#0B132B] px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-[#132147] transition"
          >
            Deny & Pause
          </button>
          <button
            onClick={pendingPermission.onApprove}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-500 active:scale-95 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Authorize Action</span>
          </button>
        </div>
      </div>
    </div>
  );
}
