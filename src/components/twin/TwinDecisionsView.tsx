'use client';

// =============================================================================
// RIIQX — Decision Lab & Price Truth Engine View
// "Compare & Verify Any Purchase"
// Exact Buying Links • "BUY FROM STORE" • True Final Payable Price • 3-Tier Rankings
// Zero Fake Products • Real Retailer Discovery • Zero-Simulation Truth Matrix
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
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
  Sliders,
  Gift,
  Building2,
  Percent,
} from 'lucide-react';
import { TwinDecisionResponse } from '@/app/api/twin/decide/route';
import {
  UserShoppingPreferences,
  PromotionalOffer,
  RetailerOffer,
} from '@/services/product-intelligence/types';

export function TwinDecisionsView() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<TwinDecisionResponse | null>(null);

  // Active Ranking Dimension: 'eligible' | 'standard' | 'conditional'
  const [activeRankingTab, setActiveRankingTab] = useState<'eligible' | 'standard' | 'conditional'>('eligible');

  // "My Shopping Offers" Preferences State
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserShoppingPreferences>({
    userId: 'usr_guest_local',
    preferredBanks: ['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Axis Bank'],
    preferredCardTypes: ['credit', 'debit', 'emi'],
    preferredPaymentMethods: ['upi', 'card', 'netbanking'],
    memberships: ['Amazon Prime', 'Flipkart Plus'],
    giftCardBalances: [],
  });

  // Active tab in Discount Explorer: 'bank' | 'coupon' | 'cashback' | 'gift_card'
  const [activeDiscountTab, setActiveDiscountTab] = useState<'bank' | 'coupon' | 'cashback' | 'gift_card'>('bank');

  // Screenshot upload state
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotMimeType, setScreenshotMimeType] = useState<string>('image/jpeg');
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleQueries = [
    'https://dl.flipkart.com/s/McioWfNNNN',
    'https://www.amazon.in/dp/B0BDHW4P5S',
    'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds',
    'Minimalist 10% Vitamin C Face Serum 30ml',
    'RED TAPE Men Clogs',
  ];

  const availableBanks = [
    'HDFC Bank',
    'ICICI Bank',
    'SBI Card',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'OneCard',
    'Federal Bank',
  ];

  const availableMemberships = [
    'Amazon Prime',
    'Flipkart Plus',
    'Tata NeuPass',
    'Myntra Insider',
  ];

  // Load existing shopping preferences on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch('/api/twin/shopping-preferences');
        if (res.ok) {
          const data = await res.json();
          if (data.preferences) {
            setUserPreferences(data.preferences);
          }
        }
      } catch {
        // Keep default state
      }
    }
    loadPreferences();
  }, []);

  const handleToggleBank = (bank: string) => {
    setUserPreferences((prev) => {
      const exists = prev.preferredBanks.includes(bank);
      const updated = exists
        ? prev.preferredBanks.filter((b) => b !== bank)
        : [...prev.preferredBanks, bank];
      return { ...prev, preferredBanks: updated };
    });
  };

  const handleToggleMembership = (mem: string) => {
    setUserPreferences((prev) => {
      const exists = prev.memberships.includes(mem);
      const updated = exists
        ? prev.memberships.filter((m) => m !== mem)
        : [...prev.memberships, mem];
      return { ...prev, memberships: updated };
    });
  };

  const handleSavePreferences = async () => {
    try {
      await fetch('/api/twin/shopping-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPreferences),
      });
      setIsPreferencesOpen(false);
      // Re-analyze with new preferences if result is currently loaded
      if (result) {
        handleAnalyze();
      }
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

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
          userPreferences,
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

  // Determine which offers to display based on selected ranking tab
  const getOffersForActiveRanking = (): RetailerOffer[] => {
    if (!result?.report?.rankings) {
      return (result?.report?.offers as RetailerOffer[]) || [];
    }

    switch (activeRankingTab) {
      case 'standard':
        return result.report.rankings.rankingStandard || [];
      case 'conditional':
        return result.report.rankings.rankingConditional || [];
      case 'eligible':
      default:
        return result.report.rankings.rankingEligible || result.report.offers || [];
    }
  };

  const activeOffers = getOffersForActiveRanking();
  const cheapestActiveOffer = activeOffers.find((o) => typeof o.finalComparablePrice === 'number' && o.finalComparablePrice > 0) || activeOffers[0];

  // Helper for offer verification pills
  const getOfferStatusBadge = (status: PromotionalOffer['verificationStatus']) => {
    switch (status) {
      case 'verified_applicable':
        return { label: 'Verified & Applicable', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'verified_eligibility_required':
        return { label: 'Verified (Eligibility Required)', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'expired':
        return { label: 'Expired', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' };
      case 'not_applicable':
        return { label: 'Cart Below Minimum', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
      default:
        return { label: 'Unconfirmed Terms', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' };
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* 1. Header */}
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
            Exact Product Matching &bull; Direct Buying Links &bull; True Lowest Final Payable Price &bull; Zero Simulated Deals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] px-4 py-2.5 text-xs font-bold text-[#1A1817] dark:text-white shadow-xs hover:border-[#FF5722] transition-colors"
          >
            <Sliders className="h-4 w-4 text-[#FF5722]" />
            <span>My Shopping Offers ({userPreferences.preferredBanks.length} Banks)</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
            <span>Anti-Simulation Engine Active</span>
          </span>
        </div>
      </div>

      {/* 2. Input Box: URL, Query, or Screenshot */}
      <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center justify-between">
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
              placeholder="Paste exact Amazon, Flipkart, Myntra URL or enter product name..."
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] focus:outline-hidden focus:border-[#FF5722] transition-colors"
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

          {/* Analyze / Verify Button */}
          <button
            onClick={() => handleAnalyze()}
            disabled={(!query.trim() && !screenshotBase64) || loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-7 py-3 text-xs font-black shadow-xs transition-transform active:scale-95 disabled:opacity-40 shrink-0"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{loading ? 'Verifying Buying Links...' : 'Verify Product & Deals'}</span>
          </button>
        </div>

        {/* Screenshot Preview */}
        {screenshotBase64 && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] text-xs">
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
                  Multimodal vision recognition active &bull; Prices verified against real merchant catalog
                </span>
              </div>
            </div>
            <button
              onClick={handleClearScreenshot}
              className="p-1.5 text-[#6B6661] hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
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
              className="shrink-0 text-[11px] font-semibold text-[#6B6661] hover:text-[#1A1817] dark:hover:text-white bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] px-3 py-1 rounded-full truncate max-w-[280px] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Decision Results Container */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* A. Product Identity Hero Section */}
          <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                {result.bestPick.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={result.bestPick.imageUrl}
                    alt={result.bestPick.title}
                    className="h-24 w-24 object-contain rounded-2xl bg-white dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] p-2 shrink-0 shadow-xs"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-dashed border-[#EAE3D9] dark:border-[#2E2E33] flex flex-col items-center justify-center text-[#6B6661] text-[10px] text-center p-2 shrink-0">
                    <ImageIcon className="h-6 w-6 opacity-40 mb-1" />
                    <span>No image feed provided</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#16865D] text-white text-[10px] font-black uppercase px-2.5 py-0.5">
                      Verdict: {result.verdict.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-[#16865D] font-bold">
                      Identity Match: {result.bestPick.twinMatchScore}%
                    </span>
                    <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] bg-[#FAF8F5] dark:bg-[#202025] px-2 py-0.5 rounded-full border border-[#EAE3D9] dark:border-[#2E2E33]">
                      Condition: Brand New (Original Retail)
                    </span>
                    {result.bestPick.verificationSource && (
                      <span className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] bg-[#FAF8F5] dark:bg-[#202025] px-2 py-0.5 rounded-full border border-[#EAE3D9] dark:border-[#2E2E33]">
                        Source: {result.bestPick.verificationSource}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white font-heading">
                    {result.bestPick.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] max-w-3xl leading-relaxed">
                    {result.subtext}
                  </p>
                </div>
              </div>

              {/* Cheapest Verified Floor Price Hero Badge */}
              <div className="rounded-2xl bg-[#16865D]/5 border border-[#16865D]/20 p-5 text-right shrink-0 min-w-[240px] space-y-1">
                <span className="text-[10px] font-bold text-[#16865D] uppercase tracking-wider block">
                  Lowest Verified Floor Price
                </span>
                {result.pricingMatrix.finalCheckoutPrice > 0 ? (
                  <>
                    <div className="text-3xl sm:text-4xl font-black text-[#16865D] font-heading">
                      ₹{result.pricingMatrix.finalCheckoutPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">
                      At <span className="font-bold text-[#1A1817] dark:text-white">{result.pricingMatrix.bestRetailer}</span>
                      {result.pricingMatrix.totalSavings > 0 && (
                        <span> &bull; Save ₹{result.pricingMatrix.totalSavings.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-heading">
                      Price Check Pending
                    </div>
                    <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">
                      Visit merchant store for live checkout price
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* B. 3-Way Price Ranking Dimension Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
            <div className="flex items-center gap-2 bg-white dark:bg-[#18181C] p-1.5 rounded-2xl border border-[#EAE3D9] dark:border-[#26262B]">
              <button
                onClick={() => setActiveRankingTab('eligible')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRankingTab === 'eligible'
                    ? 'bg-[#16865D] text-white shadow-xs'
                    : 'text-[#6B6661] hover:text-[#1A1817]'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>My Eligible Final Price ({userPreferences.preferredBanks.length} Banks Active)</span>
              </button>

              <button
                onClick={() => setActiveRankingTab('standard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRankingTab === 'standard'
                    ? 'bg-[#1A1817] dark:bg-white text-white dark:text-[#1A1817] shadow-xs'
                    : 'text-[#6B6661] hover:text-[#1A1817]'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5" />
                <span>Lowest Standard Floor Price</span>
              </button>

              <button
                onClick={() => setActiveRankingTab('conditional')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRankingTab === 'conditional'
                    ? 'bg-[#FF5722] text-white shadow-xs'
                    : 'text-[#6B6661] hover:text-[#1A1817]'
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Best Conditional Price (All Banks &amp; Coupons)</span>
              </button>
            </div>

            <div className="text-xs text-[#6B6661] font-bold">
              Showing {activeOffers.length} Verified Stores (Ascending Order)
            </div>
          </div>

          {/* C. Cross-Retailer Verified Stores Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {activeOffers.map((offer, i) => {
                const isWinner =
                  offer.retailerName === result.pricingMatrix.bestRetailer &&
                  Boolean(offer.sellingPrice && offer.sellingPrice > 0);

                // Scenario price based on active tab
                const displayScenario =
                  activeRankingTab === 'standard'
                    ? offer.pricingScenarios?.standard
                    : activeRankingTab === 'conditional'
                    ? offer.pricingScenarios?.bestConditional
                    : offer.pricingScenarios?.eligibleFinal || offer.pricingScenarios?.standard;

                const displayPrice = displayScenario?.finalCashPayable ?? offer.finalComparablePrice ?? offer.sellingPrice;

                return (
                  <div
                    key={offer.id || i}
                    className={`rounded-3xl border transition-all flex flex-col justify-between p-5 space-y-4 shadow-xs ${
                      isWinner
                        ? 'border-[#16865D] bg-white dark:bg-[#18181C] ring-2 ring-[#16865D]/30'
                        : 'border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C]'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Header: Retailer + Winner Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#FF5722]" />
                          <span className="text-xs font-black uppercase text-[#1A1817] dark:text-white truncate">
                            {offer.retailerName}
                          </span>
                        </div>

                        {isWinner && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#16865D] text-white shrink-0">
                            Lowest Price
                          </span>
                        )}
                      </div>

                      {/* Store Authentic Product Image */}
                      {offer.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={offer.imageUrl}
                          alt={offer.retailerName}
                          className="h-32 w-full object-contain rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] p-2"
                        />
                      ) : (
                        <div className="h-32 w-full rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-dashed border-[#EAE3D9] dark:border-[#2E2E33] flex flex-col items-center justify-center text-[#6B6661] text-[10px]">
                          <ImageIcon className="h-6 w-6 opacity-40 mb-1" />
                          <span>Direct store image unlisted</span>
                        </div>
                      )}

                      {/* Price Display */}
                      <div>
                        {typeof displayPrice === 'number' && displayPrice > 0 ? (
                          <div>
                            <div className="text-2xl font-black text-[#1A1817] dark:text-white font-heading">
                              ₹{displayPrice.toLocaleString('en-IN')}
                            </div>
                            {offer.mrp && offer.mrp > displayPrice && (
                              <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3] line-through">
                                MRP ₹{offer.mrp.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold text-center">
                            Live Price Check at Store
                          </div>
                        )}
                      </div>

                      {/* Line-by-Line Price Math Breakdown */}
                      {displayScenario && typeof displayPrice === 'number' && displayPrice > 0 && (
                        <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] space-y-1.5 text-[11px]">
                          <div className="flex justify-between text-[#6B6661]">
                            <span>Base Selling Price:</span>
                            <span className="font-bold">₹{displayScenario.sellingPrice.toLocaleString('en-IN')}</span>
                          </div>

                          {displayScenario.deliveryCharge > 0 ? (
                            <div className="flex justify-between text-[#6B6661]">
                              <span>Delivery Fee:</span>
                              <span className="font-bold">+₹{displayScenario.deliveryCharge}</span>
                            </div>
                          ) : (
                            <div className="flex justify-between text-[#16865D]">
                              <span>Delivery:</span>
                              <span className="font-bold">Free</span>
                            </div>
                          )}

                          {displayScenario.bankDiscount > 0 && (
                            <div className="flex justify-between text-[#16865D] font-bold">
                              <span>Bank Instant Discount:</span>
                              <span>-₹{displayScenario.bankDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {displayScenario.couponDiscount > 0 && (
                            <div className="flex justify-between text-[#16865D] font-bold">
                              <span>Store Coupon Discount:</span>
                              <span>-₹{displayScenario.couponDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {displayScenario.expectedCashback > 0 && (
                            <div className="flex justify-between text-[#3B82F6] font-bold pt-1 border-t border-[#EAE3D9] dark:border-[#2E2E33]">
                              <span>Post-Purchase Cashback:</span>
                              <span>+₹{displayScenario.expectedCashback.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Stock & Delivery Days */}
                      <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">
                        {offer.deliveryDays ? `Estimated delivery in ${offer.deliveryDays} days` : 'Standard regional transit'}
                      </div>
                    </div>

                    {/* BUY FROM STORE Primary CTA */}
                    <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#26262B] space-y-2">
                      {offer.directLinkVerified ? (
                        <a
                          href={offer.purchaseUrl || offer.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-black shadow-xs transition-transform active:scale-95 text-center"
                        >
                          <span>BUY FROM STORE</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <div className="space-y-1.5">
                          <span className="block text-[10px] text-amber-600 dark:text-amber-400 font-bold text-center">
                            Direct purchase link not verified
                          </span>
                          <a
                            href={offer.purchaseUrl || offer.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] hover:bg-[#EAE3D9] border border-[#EAE3D9] dark:border-[#2E2E33] text-[11px] font-bold text-[#6B6661] dark:text-[#A3A3A3] text-center"
                          >
                            <span>Search Store Catalog</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      <div className="text-[9px] text-[#6B6661] text-center truncate">
                        {offer.verificationMethod}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* D. Discount Explorer (Bank Offers, Coupons, Gift Cards, Cashback) */}
          {result.report?.availablePromotionalOffers && result.report.availablePromotionalOffers.length > 0 && (
            <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#FF5722]" />
                    <span className="text-xs font-black uppercase text-[#6B6661] dark:text-[#A3A3A3]">
                      Promotion &amp; Discount Explorer
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#1A1817] dark:text-white font-heading mt-0.5">
                    Verified Merchant &amp; Bank Offers
                  </h3>
                </div>

                {/* Sub-Tabs: Bank Offers, Coupons, Cashback */}
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] dark:bg-[#202025] p-1 rounded-2xl border border-[#EAE3D9] dark:border-[#2E2E33]">
                  <button
                    onClick={() => setActiveDiscountTab('bank')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeDiscountTab === 'bank' ? 'bg-[#FF5722] text-white shadow-xs' : 'text-[#6B6661]'
                    }`}
                  >
                    Bank Offers
                  </button>
                  <button
                    onClick={() => setActiveDiscountTab('coupon')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeDiscountTab === 'coupon' ? 'bg-[#FF5722] text-white shadow-xs' : 'text-[#6B6661]'
                    }`}
                  >
                    Store Coupons
                  </button>
                  <button
                    onClick={() => setActiveDiscountTab('cashback')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeDiscountTab === 'cashback' ? 'bg-[#FF5722] text-white shadow-xs' : 'text-[#6B6661]'
                    }`}
                  >
                    Cashback
                  </button>
                </div>
              </div>

              {/* Discount Offers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.report.availablePromotionalOffers
                  .filter((o) => {
                    if (activeDiscountTab === 'bank') return o.offerType === 'bank_card';
                    if (activeDiscountTab === 'coupon') return o.offerType === 'store_coupon';
                    if (activeDiscountTab === 'cashback') return o.isCashback;
                    return true;
                  })
                  .map((promo) => {
                    const badge = getOfferStatusBadge(promo.verificationStatus);
                    return (
                      <div
                        key={promo.id}
                        className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#FF5722]">
                            <span>{promo.retailerName}</span>
                            <span className={`px-2 py-0.5 rounded-full border ${badge.color}`}>{badge.label}</span>
                          </div>

                          <h4 className="text-xs font-bold text-[#1A1817] dark:text-white leading-snug">
                            {promo.offerName}
                          </h4>

                          <p className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
                            {promo.eligibilityDescription}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#EAE3D9] dark:border-[#26262B] text-[10px] text-[#6B6661] flex items-center justify-between">
                          <span>Min Spend: ₹{promo.minTransaction.toLocaleString('en-IN')}</span>
                          {promo.maxDiscountCap && <span>Max Cap: ₹{promo.maxDiscountCap.toLocaleString('en-IN')}</span>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* E. What Platforms Hide & Trust Footnotes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-[#FF5722]/30 bg-[#FF5722]/5 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#FF5722]" />
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
                  What Marketplaces Hide
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs text-[#1A1817] dark:text-white">
                {result.whatPlatformsHide.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-[#FF5722] font-black text-sm shrink-0">&times;</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#16865D]" />
                <h3 className="text-base font-bold text-[#1A1817] dark:text-white font-heading">
                  Price Truth &amp; Verification Methodology
                </h3>
              </div>

              <ul className="space-y-2 text-xs text-[#6B6661] dark:text-[#A3A3A3]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16865D] shrink-0" />
                  <span>Exact Product Matching separates variants, refurbished, and bundles.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16865D] shrink-0" />
                  <span>Direct buying links audited against canonical merchant product detail pages (PDP).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16865D] shrink-0" />
                  <span>Cashback is never disguised as an immediate cash price reduction.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16865D] shrink-0" />
                  <span>Stored gift cards reduce out-of-pocket cash, not market price.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. "My Shopping Offers" Preferences Modal */}
      {isPreferencesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1A1817] dark:text-white font-heading">
                    My Shopping Offers
                  </h3>
                  <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">
                    Select your active banking cards &amp; memberships to calculate your true eligible price
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPreferencesOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#202025] text-[#6B6661] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Banks Selector */}
              <div className="space-y-2">
                <span className="font-bold text-[#1A1817] dark:text-white block">
                  Preferred Banks &amp; Cards Owned:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableBanks.map((bank) => {
                    const isSelected = userPreferences.preferredBanks.includes(bank);
                    return (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => handleToggleBank(bank)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#16865D] text-white shadow-xs'
                            : 'bg-[#FAF8F5] dark:bg-[#202025] text-[#6B6661] border border-[#EAE3D9] dark:border-[#2E2E33]'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{bank}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Memberships Selector */}
              <div className="space-y-2">
                <span className="font-bold text-[#1A1817] dark:text-white block">
                  Active Store Memberships:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableMemberships.map((mem) => {
                    const isSelected = userPreferences.memberships.includes(mem);
                    return (
                      <button
                        key={mem}
                        type="button"
                        onClick={() => handleToggleMembership(mem)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#FF5722] text-white shadow-xs'
                            : 'bg-[#FAF8F5] dark:bg-[#202025] text-[#6B6661] border border-[#EAE3D9] dark:border-[#2E2E33]'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{mem}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] text-[11px] text-[#6B6661] space-y-1">
                <span className="font-bold text-[#1A1817] dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16865D]" /> Strict Consumer Privacy Guarantee:
                </span>
                <p>
                  We never store card numbers, CVVs, passwords, or OTPs. Selecting a bank simply checks whether public discount promotions apply to your order.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE3D9] dark:border-[#26262B]">
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[#6B6661] hover:text-[#1A1817] dark:hover:text-white transition-colors"
              >
                Skip / Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-2.5 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white text-xs font-black shadow-xs transition-transform active:scale-95"
              >
                Save &amp; Recalibrate Prices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
