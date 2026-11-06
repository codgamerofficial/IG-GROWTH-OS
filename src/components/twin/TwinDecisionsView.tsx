'use client';

// =============================================================================
// RIIQX — Decision Lab & Price Truth Engine View
// Deterministic Calculations • What Platforms Hide • Real Cross-Retailer Comparison
// =============================================================================

import React, { useState } from 'react';
import {
  Scale,
  Search,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { TwinDecisionResponse } from '@/app/api/twin/decide/route';

export function TwinDecisionsView() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TwinDecisionResponse | null>(null);
  const [selectedBankCard, setSelectedBankCard] = useState('HDFC Bank Credit Card');

  const sampleQueries = [
    'Should I buy Apple AirPods Pro 2 or Sony WF-1000XM5?',
    'Minimalist 10% Vitamin C Serum vs The Ordinary',
    'Philips Digital Air Fryer HD9252 vs Agaro',
    'Asics Gel-Kayano 30 Running Shoes',
  ];

  const handleAnalyze = async (override?: string) => {
    const q = (override || query).trim();
    if (!q) return;

    if (override) setQuery(override);
    setLoading(true);

    try {
      const res = await fetch('/api/twin/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          cardsOwned: [selectedBankCard, 'Amazon Pay ICICI Card', 'SBI SimplyClick'],
        }),
      });

      if (res.ok) {
        const data: TwinDecisionResponse = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Decision Lab &amp; Price Truth
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Compare &amp; Verify Any Purchase
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Calculate true net payable cost after platform fees, taxes, and bank card stacking.
          </p>
        </div>
      </div>

      {/* Input Box: Query or Screenshot */}
      <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6661]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste product name, URL, or ask a comparison..."
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] focus:outline-none focus:border-[#FF5722]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedBankCard}
              onChange={(e) => setSelectedBankCard(e.target.value)}
              className="text-xs py-3 px-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] font-bold text-[#1A1817] dark:text-white"
            >
              <option value="HDFC Bank Credit Card">HDFC Bank Card (10% Instant)</option>
              <option value="Amazon Pay ICICI Card">ICICI Amazon Card (5% Cashback)</option>
              <option value="SBI SimplyClick">SBI Card (5% Online)</option>
              <option value="Axis Flipkart Card">Axis Flipkart (5% Unlimited)</option>
            </select>

            <button
              onClick={() => handleAnalyze()}
              disabled={!query.trim() || loading}
              className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 text-xs font-black shadow-xs transition-transform active:scale-95 disabled:opacity-40"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Verify Price</span>
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-bold text-[#6B6661] uppercase shrink-0">Try:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAnalyze(q)}
              className="shrink-0 text-[11px] font-semibold text-[#6B6661] hover:text-[#1A1817] dark:hover:text-white bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] px-3 py-1 rounded-full"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Results Container */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Banner Verdict */}
          <div className="rounded-3xl border border-[#16865D]/30 bg-[#16865D]/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#16865D] text-white text-[10px] font-black uppercase px-2.5 py-0.5">
                  Twin Verdict: {result.verdict.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-[#16865D] font-bold">
                  Match Score: {result.bestPick.twinMatchScore}%
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white font-heading">
                {result.headline}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] max-w-2xl">
                {result.subtext}
              </p>
            </div>

            {/* Price Truth Ladder */}
            <div className="rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] p-4 text-right shrink-0 min-w-[200px]">
              <span className="text-[10px] font-bold text-[#6B6661] uppercase">True Net Floor Price</span>
              <div className="text-3xl font-black text-[#16865D] font-heading">
                ₹{result.pricingMatrix.finalCheckoutPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3] mt-0.5">
                Saved ₹{result.pricingMatrix.totalSavings.toLocaleString('en-IN')} ({result.pricingMatrix.savingsPercentage}% off MRP)
              </div>
            </div>
          </div>

          {/* Pricing Math Breakdown & What Platforms Hide */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price Truth Calculation Steps */}
            <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#16865D]" />
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
                  Price Truth Math
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D9] dark:border-[#26262B]">
                  <span className="text-[#6B6661] dark:text-[#A3A3A3]">Published MRP</span>
                  <span className="font-bold line-through text-[#6B6661]">
                    ₹{result.pricingMatrix.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D9] dark:border-[#26262B]">
                  <span className="text-[#6B6661] dark:text-[#A3A3A3]">Lowest Listed Merchant ({result.pricingMatrix.bestRetailer})</span>
                  <span className="font-bold text-[#1A1817] dark:text-white">
                    ₹{result.pricingMatrix.lowestListedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D9] dark:border-[#26262B]">
                  <span className="text-[#6B6661] dark:text-[#A3A3A3]">{result.pricingMatrix.cardOfferName}</span>
                  <span className="font-bold text-[#16865D]">
                    - ₹{result.pricingMatrix.cardDiscountApplied.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D9] dark:border-[#26262B]">
                  <span className="text-[#6B6661] dark:text-[#A3A3A3]">Direct Twin Arbitrage Optimization</span>
                  <span className="font-bold text-[#16865D]">
                    - ₹{result.pricingMatrix.twinArbitrageSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-black text-[#16865D]">
                  <span>Total Payable at Checkout</span>
                  <span>₹{result.pricingMatrix.finalCheckoutPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* What Platforms Hide */}
            <div className="rounded-3xl border border-[#FF5722]/30 bg-[#FF5722]/5 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#FF5722]" />
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
                  What Marketplaces Hide
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-[#1A1817] dark:text-white">
                {result.whatPlatformsHide.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-[#FF5722] font-black text-sm shrink-0">✕</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-[#FF5722]/20">
                <span className="text-[11px] font-bold text-[#6B6661] dark:text-[#A3A3A3]">
                  Twin Note: {result.userTwinNote}
                </span>
              </div>
            </div>
          </div>

          {/* Cross-Retailer Comparison Grid */}
          <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
              Cross-Platform Real Price Comparison
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.pricingMatrix.retailers.map((r, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition-all ${
                    r.name === result.pricingMatrix.bestRetailer
                      ? 'border-[#16865D] bg-[#16865D]/5'
                      : 'border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#202025]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1817] dark:text-white">{r.name}</span>
                    {r.badge && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#16865D] text-white">
                        {r.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-black text-[#1A1817] dark:text-white font-heading mt-2">
                    ₹{r.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#6B6661] mt-1">
                    Delivery in {r.deliveryDays} days • {r.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#FF5722] hover:underline"
                  >
                    <span>Inspect Merchant</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
