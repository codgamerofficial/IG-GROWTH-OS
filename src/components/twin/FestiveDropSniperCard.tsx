'use client';

// =============================================================================
// RIIQX — Festive Price Drop Sniper & 48-Hour Bank Arbitrage Card
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// Real-Time Bank Partner Rotation • Precision Price Floor Alerts
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  TrendingDown,
  Calendar,
  CreditCard,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  BankCycleSchedule,
  FestiveSniperDashboardReport,
  SniperWatchlistItem,
} from '@/services/product-intelligence/festive-drop-sniper';

export function FestiveDropSniperCard() {
  const [report, setReport] = useState<FestiveSniperDashboardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCurrentPrice, setNewCurrentPrice] = useState('');
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [newBank, setNewBank] = useState('HDFC Bank Credit Card');
  const [submitting, setSubmitting] = useState(false);

  const fetchSniperData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/twin/price-sniper');
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReport(data.report);
        }
      }
    } catch (err) {
      console.error('Failed to load price sniper report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSniperData();
  }, []);

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCurrentPrice || !newTargetPrice) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/twin/price-sniper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productTitle: newTitle,
          currentPrice: Number(newCurrentPrice),
          targetPrice: Number(newTargetPrice),
          preferredBank: newBank,
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewCurrentPrice('');
        setNewTargetPrice('');
        setIsAddOpen(false);
        await fetchSniperData();
      }
    } catch (err) {
      console.error('Failed to add sniper item:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !report) {
    return (
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <RefreshCw className="w-5 h-5 animate-spin text-orange-400" />
          <span>Calibrating 48-Hour Bank Rotation Radar...</span>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* 1. Header with Live Status & Add Target Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Crosshair className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-black">
              Festive Price Drop Sniper
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              48h Cycle Active
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Bank Partner Rotation &amp; Price Floor Sniper
          </h3>
          <p className="text-xs text-zinc-400">
            Autonomous radar tracking 48h card rotations (HDFC &bull; ICICI &bull; SBI &bull; Axis) to alert at mathematical floor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
          >
            {isAddOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddOpen ? 'Cancel' : 'Snipe New Product'}</span>
          </button>
        </div>
      </div>

      {/* 2. Add New Target Expandable Form */}
      {isAddOpen && (
        <form
          onSubmit={handleAddTarget}
          className="rounded-2xl border border-orange-500/30 bg-orange-950/15 p-5 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              Set Autonomous Snipe Threshold
            </h4>
            <span className="text-[11px] text-zinc-400 font-mono">Zero fake drops &bull; True net floor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-3">
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Product Title or Link</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 or paste Amazon/Flipkart URL"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-white text-xs placeholder-zinc-500 focus:outline-hidden focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Current Price (₹)</label>
              <input
                type="number"
                value={newCurrentPrice}
                onChange={(e) => setNewCurrentPrice(e.target.value)}
                placeholder="24990"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-white text-xs placeholder-zinc-500 focus:outline-hidden focus:border-orange-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Target Snipe Price (₹)</label>
              <input
                type="number"
                value={newTargetPrice}
                onChange={(e) => setNewTargetPrice(e.target.value)}
                placeholder="19990"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-white text-xs placeholder-zinc-500 focus:outline-hidden focus:border-orange-500 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Primary Bank Card</label>
              <select
                value={newBank}
                onChange={(e) => setNewBank(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-white text-xs focus:outline-hidden focus:border-orange-500"
              >
                <option value="HDFC Bank Credit Card">HDFC Bank Credit Card</option>
                <option value="ICICI Bank Credit Card">ICICI Bank Credit Card</option>
                <option value="SBI Card">SBI Card</option>
                <option value="Axis Bank Credit Card">Axis Bank Credit Card</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Registering Target...' : 'Deploy Sniper'}
            </button>
          </div>
        </form>
      )}

      {/* 3. 48-Hour Shifting Bank Cycle Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono uppercase tracking-wider text-[11px] text-zinc-500 font-bold">
            48-Hour Bank Offer Shifting Cycles
          </span>
          <span className="text-[11px] text-amber-400 font-mono">
            {report.currentActiveBank.hoursRemaining
              ? `${report.currentActiveBank.hoursRemaining}h remaining in current cycle`
              : 'Cycle Shift Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {report.weeklyCycle.map((cycle, idx) => {
            const isActive = cycle.status === 'active_now';
            const isNext = cycle.status === 'upcoming_next';

            return (
              <div
                key={idx}
                className={`rounded-2xl p-4 border transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-950/40 via-zinc-900/80 to-zinc-950 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : isNext
                    ? 'bg-gradient-to-br from-amber-950/30 via-zinc-900/60 to-zinc-950 border-amber-500/30'
                    : 'bg-zinc-950/70 border-white/[0.06] opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isNext
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {isActive ? 'Active Window' : isNext ? 'Up Next' : 'Scheduled'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{cycle.activeDays.join(' & ')}</span>
                </div>

                <h4 className="text-sm font-black text-white tracking-tight">{cycle.bankName}</h4>
                <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                  {cycle.discountPercentage}% Instant Discount (up to ₹{cycle.maxDiscountCap.toLocaleString('en-IN')})
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">Min Order: ₹{cycle.minTransaction.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">{cycle.cardTypeRequired}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Active Watchlist Sniper Items */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono uppercase tracking-wider text-[11px] text-zinc-500 font-bold">
              Active Sniper Watchlist ({report.watchlist.length})
            </span>
            {report.snipeReadyCount > 0 && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {report.snipeReadyCount} Target Hit
              </span>
            )}
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            Total Potential Savings: <strong className="text-emerald-400">₹{report.totalPotentialSavings.toLocaleString('en-IN')}</strong>
          </span>
        </div>

        <div className="space-y-2.5">
          {report.watchlist.map((item) => {
            const isHit = item.targetHit;
            const progress = Math.min(
              100,
              Math.max(10, Math.round(((item.initialObservedPrice - item.netPayableAfterBankDiscount) / (item.initialObservedPrice - item.targetSnipePrice)) * 100))
            );

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-4.5 transition-all ${
                  isHit
                    ? 'bg-gradient-to-r from-emerald-950/30 via-zinc-900/80 to-zinc-950 border-emerald-500/30 shadow-md shadow-emerald-500/5'
                    : 'bg-zinc-950/70 border-white/[0.06]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-zinc-300 bg-zinc-800 border border-white/[0.08] px-2 py-0.5 rounded-md">
                        {item.retailerName}
                      </span>
                      {isHit ? (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Target Price Reached
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/[0.06]">
                          Monitoring Price Shifts
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-amber-300">
                        Optimal: {item.optimalBuyWindow}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-white tracking-tight leading-snug">
                      {item.productTitle}
                    </h5>

                    <div className="flex items-center gap-4 text-xs font-mono pt-0.5">
                      <span className="text-zinc-500 line-through">
                        Original: ₹{item.initialObservedPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-zinc-300">
                        Target Floor: <strong className="text-white">₹{item.targetSnipePrice.toLocaleString('en-IN')}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        Net Payable: ₹{item.netPayableAfterBankDiscount.toLocaleString('en-IN')} ({item.bestApplicableBank})
                      </span>
                    </div>

                    {/* Progress Bar towards target */}
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-white/[0.04] mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHit ? 'bg-emerald-400' : 'bg-orange-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Buy / View Action */}
                  <div className="flex items-center sm:flex-col justify-end gap-2 shrink-0">
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                        isHit
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.08]'
                      }`}
                    >
                      <span>{isHit ? 'Snipe Deal Now' : 'Check Store Page'}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

