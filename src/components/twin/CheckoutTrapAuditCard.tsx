'use client';

// =============================================================================
// RIIQX — Checkout Trap & Deceptive Fee Audit Component
// Obsidian Glassmorphism • Zero Hallucination • Actionable Uncheck Checklist
// =============================================================================

import React, { useState } from 'react';
import { DeceptiveFeeAuditResult, DarkPatternCategory } from '@/services/product-intelligence/types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  Check,
  Sparkles,
} from 'lucide-react';

interface Props {
  audit: DeceptiveFeeAuditResult;
  onReset?: () => void;
}

function getCategoryPill(category: DarkPatternCategory) {
  switch (category) {
    case 'pre_ticked_opt_in':
      return { label: 'Pre-Ticked Opt-In', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
    case 'fake_insurance':
      return { label: 'Redundant Warranty / Cover', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    case 'convenience_fee':
      return { label: 'Convenience / Platform Surcharge', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
    case 'cancellation_trap':
      return { label: 'Paid Cancellation Shield', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    case 'artificial_urgency':
      return { label: 'Artificial Urgency Trap', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' };
    case 'hidden_surcharge':
    default:
      return { label: 'Hidden Surcharge', color: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30' };
  }
}

export function CheckoutTrapAuditCard({ audit, onReset }: Props) {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isSevere = audit.truthScore < 50;
  const isModerate = audit.truthScore >= 50 && audit.truthScore < 85;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Master Verdict Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-7 border backdrop-blur-xl relative overflow-hidden shadow-2xl ${
          isSevere
            ? 'bg-rose-950/20 border-rose-500/30'
            : isModerate
            ? 'bg-amber-950/20 border-amber-500/30'
            : 'bg-emerald-950/20 border-emerald-500/30'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                isSevere
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/10'
                  : isModerate
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-amber-500/10'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/10'
              }`}
            >
              {isSevere ? (
                <ShieldAlert className="w-8 h-8" />
              ) : isModerate ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <ShieldCheck className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    isSevere
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : isModerate
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {isSevere
                    ? 'Severe Dark Patterns'
                    : isModerate
                    ? 'Moderate Deceptive Friction'
                    : 'Transparent Checkout'}
                </span>
                <span className="text-xs text-zinc-400 font-semibold">&bull; {audit.merchantName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {audit.potentialInstantSavings > 0
                  ? `Avoid ₹${audit.potentialInstantSavings.toLocaleString('en-IN')} in Sneaky Checkout Fees`
                  : 'No Deceptive Add-ons Found on Screen'}
              </h2>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">{audit.summary}</p>
            </div>
          </div>

          {/* Truth Score Gauge */}
          <div className="flex items-center gap-4 bg-zinc-950/70 border border-white/[0.08] p-4 rounded-2xl shrink-0">
            <div className="text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Truth Score
              </span>
              <span
                className={`text-3xl font-black ${
                  isSevere ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {audit.truthScore}
                <span className="text-sm font-normal text-zinc-500">/100</span>
              </span>
            </div>
            {audit.potentialInstantSavings > 0 && (
              <div className="pl-4 border-l border-white/[0.08] text-center">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Instant Savings
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  ₹{audit.potentialInstantSavings.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Truth Math: Published vs Honest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Published Total */}
        <div className="rounded-2xl bg-zinc-900/60 border border-white/[0.08] p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold mb-2">
            <span>Published Screen Total</span>
            <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded">Before Audit</span>
          </div>
          <span className="text-2xl font-black text-zinc-200">
            {audit.publishedTotal > 0 ? `₹${audit.publishedTotal.toLocaleString('en-IN')}` : 'Variable Cart'}
          </span>
          <p className="text-[11px] text-zinc-500 mt-1">Includes default auto-ticked and platform extras</p>
        </div>

        {/* Sneaky Surcharges */}
        <div className="rounded-2xl bg-rose-950/15 border border-rose-500/20 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-rose-400 text-xs font-semibold mb-2">
            <span>Removable Surcharges</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-rose-400">
            {audit.removableSurchargesTotal > 0
              ? `-₹${audit.removableSurchargesTotal.toLocaleString('en-IN')}`
              : '₹0'}
          </span>
          <p className="text-[11px] text-zinc-400 mt-1">
            {audit.deceptiveItems.length} deceptive items detected on page
          </p>
        </div>

        {/* Honest Payable Floor */}
        <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-2">
            <span>Honest Net Payable</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400">
            {audit.honestPayablePrice > 0
              ? `₹${audit.honestPayablePrice.toLocaleString('en-IN')}`
              : 'Base Items Only'}
          </span>
          <p className="text-[11px] text-emerald-300/80 mt-1">True payable cost if all traps are opted out</p>
        </div>
      </div>

      {/* 3. Interactive Uncheck Action Checklist */}
      <div className="rounded-3xl bg-zinc-900/60 border border-white/[0.08] p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Action Plan: Steps to Remove Unwanted Charges
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Check off steps as you uncheck them on your checkout page
          </span>
        </div>

        <div className="space-y-2.5">
          {audit.stepByStepUncheckGuide.map((step, idx) => {
            const isDone = Boolean(checkedSteps[idx]);
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-zinc-950/70 border-white/[0.08] hover:border-orange-500/40 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-black font-black'
                        : 'border-zinc-600 group-hover:border-orange-400'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-medium leading-relaxed ${isDone ? 'line-through opacity-70' : ''}`}>
                    {step}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-wider">
                  {isDone ? 'COMPLETED' : 'CLICK TO CONFIRM'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Itemized Deceptive Surcharges Audit */}
      <div className="rounded-3xl bg-zinc-900/60 border border-white/[0.08] p-6 sm:p-7 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-orange-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Itemized Forensic Audit ({audit.deceptiveItems.length} Surcharges Analyzed)
          </h3>
        </div>

        {audit.deceptiveItems.length === 0 ? (
          <p className="text-xs text-zinc-400">Zero sneaky add-ons detected. The merchant bill is clear.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {audit.deceptiveItems.map((item) => {
              const pill = getCategoryPill(item.category);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2 hover:border-white/[0.15] transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white leading-snug">{item.name}</span>
                    <span className="text-xs font-mono font-black text-rose-400 shrink-0">
                      +₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${pill.color}`}
                    >
                      {pill.label}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        item.isRemovable
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {item.isRemovable ? 'Opt-Out Available' : 'Mandatory Extortion'}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 leading-relaxed bg-white/[0.02] p-2 rounded-xl border border-white/[0.04]">
                    👉 <strong className="text-white">How to fix:</strong> {item.actionableStep}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

