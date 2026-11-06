'use client';

// =============================================================================
// BANZA — AI Twin Interactive Decision Workspace
// "Before you decide, ask your AI Twin."
// Live Arbitrage & Cross-Platform Price Stacking • Direct Consumer Verdicts
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Tag,
  Star,
  RefreshCw,
  ThumbsUp,
  Sliders,
  DollarSign,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { TwinDecisionResponse } from '@/app/api/twin/decide/route';

interface BanzaTwinWorkspaceProps {
  initialPrompt?: string;
  initialShowConfigModal?: boolean;
  onBackToLanding: () => void;
}

export function BanzaTwinWorkspace({ initialPrompt = '', initialShowConfigModal = false, onBackToLanding }: BanzaTwinWorkspaceProps) {
  const [inputQuery, setInputQuery] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<TwinDecisionResponse | null>(null);
  const [selectedRetailer, setSelectedRetailer] = useState<string>('Amazon India');
  const [showConfigModal, setShowConfigModal] = useState(initialShowConfigModal);

  // User Twin Profile State
  const [twinProfile, setTwinProfile] = useState({
    budgetTier: 'Balanced Value',
    cards: ['HDFC Bank Credit Card', 'Amazon Pay ICICI Card', 'SBI SimplyClick'],
    skinType: 'Oily / Sensitive',
    preferredBrands: ['Sony', 'Apple', 'Minimalist', 'Asics'],
    avoidKeywords: ['Fast Fashion Polyester', 'Uncertified UV Filters', '8GB RAM Laptops'],
  });

  const popularPrompts = [
    'Suggest a good tote bag for office and commute under ₹3,000',
    'Which sunscreen doesn’t leave a white cast for oily Indian skin?',
    'Should I buy iPhone 15 now or wait for 16?',
    'Best noise cancelling headphones under ₹8,000 with mic',
    'Philips Air Fryer vs Agaro: which is more durable?',
  ];

  const handleAskTwin = async (overridePrompt?: string) => {
    const q = (overridePrompt || inputQuery).trim();
    if (!q) return;

    if (overridePrompt) {
      setInputQuery(overridePrompt);
    }

    setLoading(true);
    try {
      const res = await fetch('/api/twin/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          cardsOwned: twinProfile.cards,
        }),
      });

      if (res.ok) {
        const data: TwinDecisionResponse = await res.json();
        setDecision(data);
        if (data.pricingMatrix?.bestRetailer) {
          setSelectedRetailer(data.pricingMatrix.bestRetailer);
        }
      }
    } catch (err) {
      console.error('Failed to query AI Twin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      handleAskTwin(initialPrompt);
    } else {
      // Default to tote bag query
      handleAskTwin('Suggest a good tote bag for office and commute under ₹3,000');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] transition-colors py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Workspace Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF7A00] flex items-center justify-center text-white text-xs font-black shadow-xs">
                T
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white font-heading">
                Ask Your AI Twin
              </h1>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                100% Unbiased
              </span>
            </div>
            <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">
              Paste any product link or ask any buying dilemma. Your Twin evaluates cross-platform pricing and card offers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] hover:border-[#FF5722] px-3.5 py-2 text-xs font-bold transition-colors"
            >
              <Sliders className="h-3.5 w-3.5 text-[#FF5722]" />
              <span>Twin Settings</span>
            </button>
            <button
              onClick={onBackToLanding}
              className="rounded-full border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] px-3.5 py-2 text-xs font-bold text-[#6B6661] dark:text-[#A3A3A3] hover:text-[#1A1817] dark:hover:text-white transition-colors"
            >
              Back to Overview
            </button>
          </div>
        </div>

        {/* Search & Prompt Box */}
        <div className="rounded-3xl border-2 border-[#FF5722]/40 bg-white dark:bg-[#18181C] p-3 shadow-lg shadow-[#FF5722]/5 space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[#9E9E9E] shrink-0 ml-2" />
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskTwin()}
              placeholder="Paste Amazon / Flipkart / Myntra URL or ask e.g. 'Best sunscreen for oily skin under ₹600'..."
              className="w-full bg-transparent text-sm font-medium text-[#1A1817] dark:text-white placeholder-[#9E9E9E] focus:outline-none"
            />
            <button
              onClick={() => handleAskTwin()}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] disabled:opacity-50 text-white px-5 py-2.5 text-xs font-black shadow-xs transition-transform active:scale-95 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Ask Twin</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-[#EAE3D9] dark:border-[#26262B]">
            <span className="text-[10px] font-bold text-[#9E9E9E] shrink-0">Try:</span>
            {popularPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleAskTwin(p)}
                className="whitespace-nowrap rounded-full bg-[#FAF8F5] dark:bg-[#202024] hover:bg-[#FF5722]/10 hover:text-[#FF5722] text-[11px] font-semibold text-[#6B6661] dark:text-[#A3A3A3] px-3 py-1 transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        {decision && (
          <div className="space-y-6">
            
            {/* Top Verdict Banner */}
            <div className="rounded-[32px] border-2 border-[#FF5722] bg-[#FFFDF9] dark:bg-[#18181C] p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FF5722] text-white px-3 py-0.5 text-xs font-black uppercase tracking-wider">
                      ★ My Pick For You
                    </span>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-2.5 py-0.5">
                      {decision.bestPick.twinMatchScore}% Twin Match
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white mt-2">
                    {decision.bestPick.title}
                  </h2>
                  <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] mt-1">
                    Brand: <span className="font-bold text-[#1A1817] dark:text-white">{decision.bestPick.brand}</span> • Category: {decision.bestPick.category}
                  </p>
                </div>

                {/* Final Price Box */}
                <div className="sm:text-right p-4 rounded-2xl bg-white dark:bg-[#121214] border border-[#EAE3D9] dark:border-[#26262B]">
                  <span className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3] font-semibold">Final Floor Price You Pay:</span>
                  <div className="flex items-baseline gap-2 sm:justify-end">
                    <span className="text-3xl font-black text-[#FF5722]">
                      ₹{decision.pricingMatrix.finalCheckoutPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#9E9E9E] line-through">
                      ₹{decision.pricingMatrix.mrp.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Save ₹{decision.pricingMatrix.totalSavings.toLocaleString()} ({decision.pricingMatrix.savingsPercentage}% OFF)
                  </span>
                </div>
              </div>

              {/* Specs Pills */}
              <div className="flex flex-wrap gap-2">
                {decision.bestPick.specs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl bg-[#FAF8F5] dark:bg-[#202024] border border-[#EAE3D9] dark:border-[#26262B] text-xs font-bold text-[#1A1817] dark:text-white px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {spec}
                  </span>
                ))}
              </div>

              {/* Price Arbitrage Ladder */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#1A1817] dark:text-white flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-[#FF5722]" />
                  <span>How Your Twin Stacks This Floor Price:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121214] border border-[#EAE3D9] dark:border-[#26262B] p-3.5">
                    <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] font-bold block">1. Best Market Listing</span>
                    <span className="text-base font-black text-[#1A1817] dark:text-white">₹{decision.pricingMatrix.lowestListedPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">on {decision.pricingMatrix.bestRetailer}</span>
                  </div>

                  <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121214] border border-[#EAE3D9] dark:border-[#26262B] p-3.5">
                    <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] font-bold block">2. Bank Card Discount</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">-₹{decision.pricingMatrix.cardDiscountApplied.toLocaleString()}</span>
                    <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] block truncate">{decision.pricingMatrix.cardOfferName}</span>
                  </div>

                  <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#121214] border border-[#EAE3D9] dark:border-[#26262B] p-3.5">
                    <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] font-bold block">3. Token Arbitrage</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">-₹{decision.pricingMatrix.twinArbitrageSavings.toLocaleString()}</span>
                    <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] block">Banza verified coupon</span>
                  </div>
                </div>
              </div>

              {/* Retailers Direct Comparison Strip */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#6B6661] dark:text-[#A3A3A3]">
                  Live Retailer Price Comparison:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {decision.pricingMatrix.retailers.map((ret, idx) => (
                    <a
                      key={idx}
                      href={ret.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                        ret.name.includes(decision.pricingMatrix.bestRetailer)
                          ? 'border-[#FF5722] bg-[#FF5722]/5 shadow-xs'
                          : 'border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#141418] hover:border-[#9E9E9E]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1A1817] dark:text-white truncate">{ret.name}</span>
                        <ExternalLink className="h-3 w-3 text-[#9E9E9E]" />
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-black text-[#1A1817] dark:text-white">₹{ret.price.toLocaleString()}</span>
                        {ret.badge && (
                          <span className="text-[9px] font-bold text-[#FF5722] block">{ret.badge}</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Why This Pick & What Platforms Hide (Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EAE3D9] dark:border-[#26262B]">
                {/* Why It Wins */}
                <div className="rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Why Your Twin Recommends This:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#1A1817] dark:text-slate-300">
                    {decision.whyThisPick.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What Platforms Hide */}
                <div className="rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 p-4 space-y-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> What Seller Marketplaces Hide:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#1A1817] dark:text-slate-300">
                    {decision.whatPlatformsHide.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Direct Buy Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">
                  {decision.userTwinNote}
                </span>
                <a
                  href="https://www.amazon.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white px-7 py-3.5 text-xs font-black shadow-md transition-transform active:scale-95 shrink-0"
                >
                  <span>Checkout at Lowest Price (₹{decision.pricingMatrix.finalCheckoutPrice.toLocaleString()})</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Twin Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[32px] border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-[#FF5722]" />
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white">
                  My AI Twin Profile &amp; Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-xs font-bold text-[#9E9E9E] hover:text-[#1A1817] dark:hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#1A1817] dark:text-white block mb-1">
                  Budget Priority:
                </label>
                <select
                  value={twinProfile.budgetTier}
                  onChange={(e) => setTwinProfile({ ...twinProfile, budgetTier: e.target.value })}
                  className="w-full rounded-xl border border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#121214] p-2.5 text-xs font-bold text-[#1A1817] dark:text-white focus:outline-none"
                >
                  <option>Strict Floor Price (Save Maximum Money)</option>
                  <option>Balanced Value (Best Quality per Rupee)</option>
                  <option>Premium Only (Zero Compromises)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1A1817] dark:text-white block mb-1">
                  Active Wallet / Credit Cards (For Instant Discounts):
                </label>
                <div className="space-y-1.5">
                  {['HDFC Bank Credit Card', 'Amazon Pay ICICI Card', 'SBI SimplyClick', 'Axis Bank Neo', 'OneCard Metal'].map((card) => {
                    const isChecked = twinProfile.cards.includes(card);
                    return (
                      <label key={card} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setTwinProfile({
                                ...twinProfile,
                                cards: twinProfile.cards.filter((c) => c !== card),
                              });
                            } else {
                              setTwinProfile({
                                ...twinProfile,
                                cards: [...twinProfile.cards, card],
                              });
                            }
                          }}
                          className="rounded text-[#FF5722] focus:ring-[#FF5722]"
                        />
                        <span>{card}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1A1817] dark:text-white block mb-1">
                  Skin Type / Physiology:
                </label>
                <input
                  type="text"
                  value={twinProfile.skinType}
                  onChange={(e) => setTwinProfile({ ...twinProfile, skinType: e.target.value })}
                  className="w-full rounded-xl border border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#121214] p-2.5 text-xs font-bold text-[#1A1817] dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full rounded-full bg-[#FF5722] text-white py-3 text-xs font-black shadow-xs hover:bg-[#E64A19] transition-transform active:scale-95"
            >
              Save Twin Context
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
