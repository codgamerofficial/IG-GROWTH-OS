'use client';

// =============================================================================
// RIIQX — Rewards Ledger & Secure Referral Hub View
// Append-Only Ledger • Verified Transactions • Zero Fake Balances
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Gift,
  Copy,
  Check,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { RewardAccount, RewardLedgerEntry } from '@/lib/riiqx/twin-types';

export function TwinRewardsView() {
  const [account, setAccount] = useState<RewardAccount | null>(null);
  const [ledger, setLedger] = useState<RewardLedgerEntry[]>([]);
  const [referralCode, setReferralCode] = useState('RIIQX-TWIN2026');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRewards() {
      try {
        setLoading(true);
        const res = await fetch('/api/twin/rewards');
        if (res.ok) {
          const data = await res.json();
          setAccount(data.account);
          setLedger(data.ledger || []);
          if (data.referral?.code) setReferralCode(data.referral.code);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, []);

  const referralUrl = `https://riiqx.vercel.app/?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <Gift className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
              Rewards &amp; Referral Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading mt-2">
            Verified Rewards &amp; Earning
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Append-only reward ledger backed by authentic merchant and referral campaigns.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
          <ShieldCheck className="h-4 w-4" />
          <span>Zero Simulated Balances</span>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Available Balance */}
        <div className="rounded-3xl border border-white/[0.08] hover:border-white/[0.18] bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Available Balance</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight my-3">
            ₹{account?.availableBalance !== undefined ? account.availableBalance.toFixed(2) : '0.00'}
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Redeemable toward brand gift vouchers once verified threshold is reached.
          </p>
        </div>

        {/* Pending Verification */}
        <div className="rounded-3xl border border-white/[0.08] hover:border-white/[0.18] bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Pending Verification</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono tracking-tight my-3">
            ₹{account?.pendingBalance !== undefined ? account.pendingBalance.toFixed(2) : '0.00'}
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Awaiting merchant 30-day return policy clearance and settlement.
          </p>
        </div>

        {/* Lifetime Earned */}
        <div className="rounded-3xl border border-white/[0.08] hover:border-white/[0.18] bg-zinc-900/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden group transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Lifetime Earned</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Gift className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight my-3">
            ₹{account?.lifetimeEarned !== undefined ? account.lifetimeEarned.toFixed(2) : '0.00'}
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Total audited rewards credited since account creation.
          </p>
        </div>
      </div>

      {/* Referral Program Card */}
      <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-zinc-900/80 to-zinc-900/80 backdrop-blur-xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white font-heading">
              Invite Friends to RIIQX Twin
            </h3>
            <p className="text-xs text-zinc-300">
              Earn ₹250 verified voucher credit when a friend joins and verifies their first price truth comparison.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 relative z-10">
          <div className="flex-1 w-full p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] font-mono text-xs text-white font-bold truncate shadow-inner">
            {referralUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-7 py-3.5 text-xs font-black shadow-lg shadow-orange-500/25 transition-transform active:scale-95 shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Referral Link'}</span>
          </button>
        </div>
      </div>

      {/* Append-Only Ledger Table */}
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white font-heading">
                Append-Only Reward Ledger
              </h3>
              <p className="text-xs text-zinc-400">Cryptographically auditable balance journal</p>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider bg-zinc-950/80 px-2.5 py-1 rounded-full border border-white/[0.06]">
            Immutable Audit Trail
          </span>
        </div>

        {ledger.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-zinc-950/70 border border-dashed border-white/[0.1] space-y-2">
            <Gift className="h-8 w-8 text-zinc-500 mx-auto opacity-30" />
            <p className="text-xs font-bold text-white">No transactions recorded yet</p>
            <p className="text-[11px] text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Transactions appear here automatically when genuine partner campaigns or verified referral credits clear.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {ledger.map((entry) => (
              <div key={entry.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-zinc-800/20 px-2 rounded-xl transition-colors">
                <div>
                  <div className="font-bold text-white">{entry.description}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{new Date(entry.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right font-mono">
                  <div className={`font-black ${entry.entryType === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {entry.entryType === 'credit' ? '+' : '-'}₹{entry.amount.toFixed(2)}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400">{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
