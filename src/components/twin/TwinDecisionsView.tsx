'use client';

// =============================================================================
// RIIQX — Decision Lab & Price Truth Engine View
// Deterministic Calculations • Multimodal Vision • Real Cross-Retailer Verification
// Zero Fake Products • Canonical Merchant Links • Consumer Protection Compliant
// =============================================================================

import React, { useState, useRef } from 'react';
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
  Image as ImageIcon,
  X,
  Info,
  Check,
} from 'lucide-react';
import { TwinDecisionResponse } from '@/app/api/twin/decide/route';

export function TwinDecisionsView() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<TwinDecisionResponse | null>(null);
  const [selectedBankCard, setSelectedBankCard] = useState('HDFC Bank Credit Card');

  // Screenshot upload state
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotMimeType, setScreenshotMimeType] = useState<string>('image/jpeg');
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleQueries = [
    'https://www.amazon.in/dp/B0BDHW4P5S',
    'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds',
    'Minimalist 10% Vitamin C Face Serum 30ml',
    'Samsung Galaxy S24 Ultra 5G 256GB Titanium Gray',
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8MB. Please upload a smaller screenshot.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Only JPEG, PNG, or WebP screenshots are supported.');
      return;
    }

    setErrorMsg(null);
    setScreenshotFileName(file.name);
    setScreenshotMimeType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setScreenshotBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleClearScreenshot = () => {
    setScreenshotBase64(null);
    setScreenshotFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async (override?: string) => {
    const q = (override || query).trim();
    if (!q && !screenshotBase64) {
      setErrorMsg('Please enter a product title, paste a retailer URL, or upload a product screenshot.');
      return;
    }

    if (override) setQuery(override);
    setErrorMsg(null);
    setLoading(true);

    try {
      const isUrl = q.startsWith('http://') || q.startsWith('https://');
      const res = await fetch('/api/twin/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: isUrl ? undefined : q,
          productUrl: isUrl ? q : undefined,
          screenshotBase64: screenshotBase64 || undefined,
          screenshotMimeType: screenshotBase64 ? screenshotMimeType : undefined,
          cardsOwned: [selectedBankCard, 'Amazon Pay ICICI Card', 'SBI SimplyClick'],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to verify product information.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Verification service temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'verified_jsonld':
        return { label: 'Verified (JSON-LD)', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'provider_reported':
        return { label: 'Provider-Reported', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'extracted_screenshot':
        return { label: 'Captured from Screenshot', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
      default:
        return { label: 'Link Verified', color: 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20' };
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
              Decision Lab &amp; Price Truth Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Compare &amp; Verify Any Purchase
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Real cross-retailer pricing with zero fake numbers. Total checkout calculations inclusive of delivery and platform charges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Anti-Simulation Engine Active</span>
          </span>
        </div>
      </div>

      {/* Input Box: Query or Screenshot */}
      <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-rose-500/20 rounded-lg">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6661]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Paste Amazon, Flipkart, Myntra URL or type product name..."
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] focus:outline-none focus:border-[#FF5722]"
            />
          </div>

          {/* Screenshot Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold rounded-2xl border transition-colors ${
                screenshotBase64
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-[#FAF8F5] dark:bg-[#202025] border-[#EAE3D9] dark:border-[#2E2E33] text-[#6B6661] dark:text-[#A3A3A3] hover:text-[#1A1817] dark:hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>{screenshotFileName ? 'Screenshot Ready' : 'Upload Screenshot'}</span>
            </button>
          </div>

          {/* Bank Card Selector */}
          <div className="flex items-center gap-2">
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
              disabled={(!query.trim() && !screenshotBase64) || loading}
              className="flex items-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 text-xs font-black shadow-xs transition-transform active:scale-95 disabled:opacity-40"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>{loading ? 'Verifying...' : 'Verify Price'}</span>
            </button>
          </div>
        </div>

        {/* Screenshot Preview Chip if Uploaded */}
        {screenshotBase64 && (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] text-xs">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotBase64}
                alt="Product Screenshot"
                className="h-10 w-10 object-cover rounded-lg border border-[#EAE3D9] dark:border-[#2E2E33]"
              />
              <div>
                <span className="font-bold text-[#1A1817] dark:text-white block">{screenshotFileName}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400">
                  Multimodal vision recognition active • Prices labeled &quot;at capture time&quot; until web verification
                </span>
              </div>
            </div>
            <button
              onClick={handleClearScreenshot}
              className="p-1 text-[#6B6661] hover:text-rose-500 rounded-lg hover:bg-rose-500/10"
              title="Remove Screenshot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-bold text-[#6B6661] uppercase shrink-0">Try real examples:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAnalyze(q)}
              className="shrink-0 text-[11px] font-semibold text-[#6B6661] hover:text-[#1A1817] dark:hover:text-white bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] px-3 py-1 rounded-full truncate max-w-[280px]"
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#16865D] text-white text-[10px] font-black uppercase px-2.5 py-0.5">
                  Verified Verdict: {result.verdict.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-[#16865D] font-bold">
                  Identity Confidence: {result.bestPick.twinMatchScore}%
                </span>
                {result.bestPick.verificationSource && (
                  <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] bg-white dark:bg-[#18181C] px-2 py-0.5 rounded-full border border-[#EAE3D9] dark:border-[#26262B]">
                    Source: {result.bestPick.verificationSource}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white font-heading">
                {result.bestPick.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] max-w-2xl">
                {result.subtext}
              </p>
            </div>

            {/* Price Truth Ladder */}
            <div className="rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] p-4 text-right shrink-0 min-w-[220px]">
              <span className="text-[10px] font-bold text-[#6B6661] uppercase">Lowest Verified Floor Price</span>
              <div className="text-3xl font-black text-[#16865D] font-heading">
                ₹{result.pricingMatrix.finalCheckoutPrice.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3] mt-0.5">
                {result.pricingMatrix.totalSavings > 0 ? (
                  <span>Save ₹{result.pricingMatrix.totalSavings.toLocaleString('en-IN')} ({result.pricingMatrix.savingsPercentage}% off highest list)</span>
                ) : (
                  <span>Single merchant listing verified</span>
                )}
              </div>
            </div>
          </div>

          {/* Warning for unknown fees if present */}
          {result.pricingMatrix.hasUnknownFees && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                Note: Some merchants calculate shipping charges dynamically based on your delivery pincode. Price displayed is base selling price.
              </span>
            </div>
          )}

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
                  <span className="text-[#6B6661] dark:text-[#A3A3A3]">Published Reference / MRP</span>
                  <span className="font-bold text-[#6B6661]">
                    ₹{result.pricingMatrix.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EAE3D9] dark:border-[#26262B]">
                  <span className="text-[#6B6661] dark:text-[#A3A3A3]">Cheapest Verified Merchant ({result.pricingMatrix.bestRetailer})</span>
                  <span className="font-bold text-[#1A1817] dark:text-white">
                    ₹{result.pricingMatrix.lowestListedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                {result.pricingMatrix.totalSavings > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-[#EAE3D9] dark:border-[#26262B]">
                    <span className="text-[#6B6661] dark:text-[#A3A3A3]">Cross-Platform Arbitrage Savings</span>
                    <span className="font-bold text-[#16865D]">
                      - ₹{result.pricingMatrix.totalSavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 text-sm font-black text-[#16865D]">
                  <span>Total Payable at Checkout</span>
                  <span>₹{result.pricingMatrix.finalCheckoutPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3] pt-2 border-t border-[#EAE3D9] dark:border-[#26262B]">
                {result.pricingMatrix.calculationExplanation}
              </p>
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
                  Cross-Platform Real Price Comparison
                </h3>
                <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">
                  Sorted deterministically by lowest verified total payable price.
                </p>
              </div>
              <span className="text-xs font-bold text-[#6B6661]">
                {result.pricingMatrix.retailers.length} Verified Offers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {result.pricingMatrix.retailers.map((r, i) => {
                const isBest = r.name === result.pricingMatrix.bestRetailer;
                const badgeInfo = getStatusBadge(r.status);

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isBest
                        ? 'border-[#16865D] bg-[#16865D]/5 ring-1 ring-[#16865D]'
                        : 'border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#202025]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-[#1A1817] dark:text-white truncate">
                          {r.name}
                        </span>
                        {isBest && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#16865D] text-white shrink-0">
                            Lowest Price
                          </span>
                        )}
                      </div>

                      <div className="mt-1">
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeInfo.color}`}>
                          {badgeInfo.label}
                        </span>
                      </div>

                      <div className="text-2xl font-black text-[#1A1817] dark:text-white font-heading mt-3">
                        ₹{r.price.toLocaleString('en-IN')}
                      </div>

                      {r.priceBreakdown && (
                        <div className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] mt-0.5">
                          {r.priceBreakdown}
                        </div>
                      )}

                      <div className="text-[10px] text-[#6B6661] mt-2">
                        Delivery in ~{r.deliveryDays} days • {r.inStock ? 'In Stock' : 'Check Availability'}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE3D9] dark:border-[#26262B]">
                      {r.link ? (
                        <a
                          href={r.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5722] hover:underline"
                        >
                          <span>Visit Verified Store</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#6B6661] italic">Direct store link pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
