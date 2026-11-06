'use client';

// =============================================================================
// RIIQX — Rewards Ledger & Secure Referral Hub View
// Append-Only Ledger • Verified Transactions • Zero Fake Balances
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Users, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://riiqx.vercel.app/?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Rewards &amp; Referral Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Verified Rewards &amp; Earning
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Append-only reward ledger backed by authentic merchant and referral campaigns.
          </p>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6">
          <span className="text-xs font-bold text-[#6B6661]">Available Balance</span>
          <div className="text-3xl font-black text-[#16865D] font-heading my-2">
            ₹{account?.availableBalance.toFixed(2) || '0.00'}
          </div>
          <p className="text-[11px] text-[#6B6661]">Redeemable toward brand gift vouchers once threshold reached.</p>
        </div>

        <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6">
          <span className="text-xs font-bold text-[#6B6661]">Pending Verification</span>
          <div className="text-3xl font-black text-[#FF9800] font-heading my-2">
            ₹{account?.pendingBalance.toFixed(2) || '0.00'}
          </div>
          <p className="text-[11px] text-[#6B6661]">Awaiting merchant 30-day return policy clearance.</p>
        </div>

        <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6">
          <span className="text-xs font-bold text-[#6B6661]">Lifetime Earned</span>
          <div className="text-3xl font-black text-[#1A1817] dark:text-white font-heading my-2">
            ₹{account?.lifetimeEarned.toFixed(2) || '0.00'}
          </div>
          <p className="text-[11px] text-[#6B6661]">Total audited rewards credited since account creation.</p>
        </div>
      </div>

      {/* Referral Program Card */}
      <div className="rounded-3xl border border-[#FF5722]/30 bg-[#FF5722]/5 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF5722] text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1A1817] dark:text-white font-heading">
              Invite Friends to RIIQX Twin
            </h3>
            <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">
              Earn ₹250 verified voucher credit when a friend joins and verifies their first price truth comparison.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="flex-1 w-full p-3 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] font-mono text-xs text-[#1A1817] dark:text-white font-bold truncate">
            https://riiqx.vercel.app/?ref={referralCode}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy Referral Link'}</span>
          </button>
        </div>
      </div>

      {/* Append-Only Ledger Table */}
      <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#16865D]" />
            <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
              Append-Only Reward Ledger
            </h3>
          </div>
          <span className="text-[10px] text-[#6B6661] uppercase font-bold">
            Immutable Audit Trail
          </span>
        </div>

        {ledger.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-dashed border-[#EAE3D9] dark:border-[#2E2E33] space-y-2">
            <Gift className="h-8 w-8 text-[#6B6661] mx-auto opacity-30" />
            <p className="text-xs font-bold text-[#1A1817] dark:text-white">No transactions recorded yet</p>
            <p className="text-[11px] text-[#6B6661] max-w-sm mx-auto">
              Transactions appear here automatically when genuine partner campaigns or verified referral credits clear.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EAE3D9] dark:divide-[#26262B]">
            {ledger.map((entry) => (
              <div key={entry.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#1A1817] dark:text-white">{entry.description}</div>
                  <div className="text-[10px] text-[#6B6661]">{new Date(entry.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className={`font-black ${entry.entryType === 'credit' ? 'text-[#16865D]' : 'text-[#FF4D4F]'}`}>
                    {entry.entryType === 'credit' ? '+' : '-'}₹{entry.amount.toFixed(2)}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-[#6B6661]">{entry.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
