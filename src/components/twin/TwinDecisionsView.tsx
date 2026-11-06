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

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([a-fA-F0-9]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// =============================================================================
// Modern Retailer SVG Logo Badges with Authentic Brand Colors
// =============================================================================
function RetailerLogoBadge({ name }: { name: string }) {
  const norm = name.toLowerCase();

  if (norm.includes('amazon')) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#131921] text-white text-[11px] font-black tracking-tight border border-amber-500/30 shadow-xs">
        <span className="text-white font-bold">amazon</span>
        <span className="text-[#FF9900] font-black">.in</span>
      </div>
    );
  }
  if (norm.includes('flipkart')) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2874F0] text-white text-[11px] font-black tracking-tight border border-blue-400/30 shadow-xs">
        <span className="text-white font-bold">Flipkart</span>
        <span className="text-[#FFE500] font-black">✦</span>
      </div>
    );
  }
  if (norm.includes('myntra')) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FF3F6C] to-[#F16521] text-white text-[11px] font-black tracking-tight shadow-xs">
        <span>Myntra</span>
      </div>
    );
  }
  if (norm.includes('tatacliq') || norm.includes('tata cliq')) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#000000] text-white text-[11px] font-black tracking-tight border border-[#DA1C5C]/50 shadow-xs">
        <span className="text-zinc-300">TATA</span>
        <span className="text-[#DA1C5C] font-black">CLiQ</span>
      </div>
    );
  }
  if (norm.includes('croma')) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00E9BF]/10 text-[#00E9BF] text-[11px] font-black tracking-tight border border-[#00E9BF]/40 shadow-xs">
        <span>croma</span>
      </div>
    );
  }
  if (norm.includes('reliance')) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E42529] text-white text-[11px] font-black tracking-tight shadow-xs">
        <span>Reliance Digital</span>
      </div>
    );
  }
  if (norm.includes('nykaa')) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FC2779] text-white text-[11px] font-black tracking-tight shadow-xs">
        <span>NYKAA</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 text-[11px] font-bold border border-zinc-700/80 shadow-xs">
      <Building2 className="h-3 w-3 text-orange-400" />
      <span className="truncate max-w-[120px]">{name}</span>
    </div>
  );
}

// =============================================================================
// Resilient Image Loader with No-Referrer and Elegant Fallbacks
// =============================================================================
function VerifiedProductImage({
  src,
  alt,
  retailerName,
  className = 'h-full w-full object-contain',
  containerClassName = 'h-32 w-full',
}: {
  src?: string;
  alt: string;
  retailerName?: string;
  className?: string;
  containerClassName?: string;
}) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // If missing or failed to load, display pristine brand card instead of broken image
  if (!src || error || src.includes('unsplash.com')) {
    return (
      <div className={`${containerClassName} rounded-2xl bg-zinc-900/90 border border-white/[0.08] flex flex-col items-center justify-center p-3 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        {retailerName && (
          <div className="mb-2">
            <RetailerLogoBadge name={retailerName} />
          </div>
        )}
        <div className="flex items-center gap-1 text-zinc-300 text-[11px] font-semibold text-center z-10 px-2 line-clamp-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>{alt}</span>
        </div>
        <span className="text-[10px] text-zinc-500 mt-1 z-10 font-mono">Store Catalog Verified</span>
      </div>
    );
  }

  return (
    <div className={`${containerClassName} rounded-2xl bg-zinc-950/60 border border-white/[0.08] p-2 flex items-center justify-center overflow-hidden relative group`}>
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-800/40 animate-pulse rounded-2xl" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} transition-transform duration-300 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

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
      const fallbackPrompt = !q && screenshotFileName ? screenshotFileName.replace(/\.[^/.]+$/, '') : q;
      const res = await fetch('/api/twin/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: isUrl ? undefined : (fallbackPrompt || undefined),
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
    <div className="flex-1 overflow-y-auto bg-[#09090b] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8 relative selection:bg-orange-500/30">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Scale className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
              Decision Lab &amp; Price Truth Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading mt-2">
            Compare &amp; Verify Any Purchase
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Exact Product Matching &bull; Direct Buying Links &bull; True Lowest Final Payable Price &bull; Zero Simulated Deals
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] hover:border-orange-500/40 px-4 py-2.5 text-xs font-bold text-zinc-200 shadow-md transition-all active:scale-95"
          >
            <Sliders className="h-4 w-4 text-orange-400" />
            <span>My Shopping Offers ({userPreferences.preferredBanks.length} Banks)</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Anti-Simulation Engine Active</span>
          </span>
        </div>
      </div>

      {/* 2. Input Box: URL, Query, or Screenshot */}
      <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4">
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-rose-500/20 rounded-lg transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Paste exact Amazon, Flipkart, Myntra URL or enter product name..."
              className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm rounded-2xl bg-zinc-950/70 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/80 transition-all shadow-inner"
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
              className={`flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-bold rounded-2xl border transition-all ${
                screenshotBase64
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-xs'
                  : 'bg-zinc-950/70 hover:bg-zinc-800 border-white/[0.08] text-zinc-300 hover:text-white'
              }`}
            >
              <ImageIcon className="h-4 w-4 text-orange-400" />
              <span>{screenshotFileName ? 'Screenshot Attached' : 'Upload Screenshot'}</span>
            </button>
          </div>

          {/* Analyze / Verify Button */}
          <button
            onClick={() => handleAnalyze()}
            disabled={(!query.trim() && !screenshotBase64) || loading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-7 py-3.5 text-xs font-black shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 active:scale-95 disabled:opacity-40 shrink-0"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{loading ? 'Verifying Buying Links...' : 'Verify Product & Deals'}</span>
          </button>
        </div>

        {/* Screenshot Preview */}
        {screenshotBase64 && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-xs">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotBase64}
                alt="Product Screenshot"
                className="h-11 w-11 object-cover rounded-xl border border-white/[0.1] shadow-xs"
              />
              <div>
                <span className="font-bold text-white block">{screenshotFileName}</span>
                <span className="text-[11px] text-amber-400 font-mono">
                  Multimodal vision active &bull; Cross-checked with live merchant catalogs
                </span>
              </div>
            </div>
            <button
              onClick={handleClearScreenshot}
              className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Remove Screenshot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">Try real examples:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAnalyze(q)}
              className="shrink-0 text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-950/60 hover:bg-zinc-800 border border-white/[0.08] hover:border-orange-500/40 px-3 py-1.5 rounded-full truncate max-w-[280px] transition-all"
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
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-start gap-5">
                <div className="h-24 w-24 shrink-0">
                  <VerifiedProductImage
                    src={result.bestPick.imageUrl}
                    alt={decodeHtmlEntities(result.bestPick.title)}
                    retailerName={result.bestPick.brand}
                    containerClassName="h-24 w-24"
                    className="h-20 w-20 object-contain rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 tracking-wide">
                      Verdict: {result.verdict.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Identity Match: {result.bestPick.twinMatchScore}%</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 bg-zinc-950/80 px-2.5 py-0.5 rounded-full border border-white/[0.06] font-mono">
                      Condition: Brand New (Original Retail)
                    </span>
                    {result.bestPick.verificationSource && (
                      <span className="text-[10px] text-zinc-400 bg-zinc-950/80 px-2.5 py-0.5 rounded-full border border-white/[0.06] font-mono">
                        Source: {result.bestPick.verificationSource}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight leading-snug">
                    {decodeHtmlEntities(result.bestPick.title)}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
                    {result.subtext}
                  </p>
                </div>
              </div>

              {/* Cheapest Verified Floor Price Hero Badge */}
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-right shrink-0 min-w-[240px] space-y-1 shadow-lg shadow-emerald-500/5">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">
                  Lowest Verified Floor Price
                </span>
                {result.pricingMatrix.finalCheckoutPrice > 0 ? (
                  <>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                      ₹{result.pricingMatrix.finalCheckoutPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-zinc-300">
                      At <span className="font-bold text-white">{result.pricingMatrix.bestRetailer}</span>
                      {result.pricingMatrix.totalSavings > 0 && (
                        <span className="text-emerald-300"> &bull; Save ₹{result.pricingMatrix.totalSavings.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-black text-amber-400 font-heading">
                      Price Check Pending
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Visit merchant store for live checkout price
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* B. 3-Way Price Ranking Dimension Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-2xl border border-white/[0.08] shadow-inner">
              <button
                onClick={() => setActiveRankingTab('eligible')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRankingTab === 'eligible'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>My Eligible Final Price ({userPreferences.preferredBanks.length} Banks Active)</span>
              </button>

              <button
                onClick={() => setActiveRankingTab('standard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRankingTab === 'standard'
                    ? 'bg-zinc-800 text-white shadow-md border border-white/[0.1]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <DollarSign className="h-3.5 w-3.5" />
                <span>Lowest Standard Floor Price</span>
              </button>

              <button
                onClick={() => setActiveRankingTab('conditional')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeRankingTab === 'conditional'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Best Conditional Price (All Banks &amp; Coupons)</span>
              </button>
            </div>

            <div className="text-xs text-zinc-400 font-mono">
              Showing <span className="text-white font-bold">{activeOffers.length}</span> Verified Stores (Ascending Order)
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
                    className={`rounded-3xl border transition-all duration-200 flex flex-col justify-between p-5 space-y-4 shadow-xl hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group ${
                      isWinner
                        ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 via-zinc-900/90 to-zinc-900/90 ring-1 ring-emerald-500/30'
                        : 'border-white/[0.08] hover:border-white/[0.18] bg-zinc-900/70 backdrop-blur-xl'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Header: Retailer + Winner Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <RetailerLogoBadge name={offer.retailerName} />
                        </div>

                        {isWinner && (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 shadow-xs">
                            Lowest Price
                          </span>
                        )}
                      </div>

                      {/* Store Authentic Product Image (Resilient loader, zero broken images) */}
                      <VerifiedProductImage
                        src={
                          offer.imageUrl && !offer.imageUrl.includes('unsplash.com')
                            ? offer.imageUrl
                            : result.bestPick.imageUrl
                        }
                        alt={decodeHtmlEntities(result.bestPick.title)}
                        retailerName={offer.retailerName}
                      />

                      {/* Price Display */}
                      <div>
                        {typeof displayPrice === 'number' && displayPrice > 0 ? (
                          <div>
                            <div className="text-2xl font-black text-white font-mono tracking-tight">
                              ₹{displayPrice.toLocaleString('en-IN')}
                            </div>
                            {offer.mrp && offer.mrp > displayPrice && (
                              <div className="text-[11px] text-zinc-500 line-through font-mono">
                                MRP ₹{offer.mrp.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold text-center">
                            Live Price Check at Store
                          </div>
                        )}
                      </div>

                      {/* Line-by-Line Price Math Breakdown */}
                      {displayScenario && typeof displayPrice === 'number' && displayPrice > 0 && (
                        <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-1.5 text-[11px] font-mono">
                          <div className="flex justify-between text-zinc-400">
                            <span>Base Selling Price:</span>
                            <span className="font-bold text-white">₹{displayScenario.sellingPrice.toLocaleString('en-IN')}</span>
                          </div>

                          {displayScenario.deliveryCharge > 0 ? (
                            <div className="flex justify-between text-zinc-400">
                              <span>Delivery Fee:</span>
                              <span className="font-bold text-amber-400">+₹{displayScenario.deliveryCharge}</span>
                            </div>
                          ) : (
                            <div className="flex justify-between text-emerald-400">
                              <span>Delivery:</span>
                              <span className="font-bold">Free</span>
                            </div>
                          )}

                          {displayScenario.bankDiscount > 0 && (
                            <div className="flex justify-between text-emerald-400 font-bold">
                              <span>Bank Instant Discount:</span>
                              <span>-₹{displayScenario.bankDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {displayScenario.couponDiscount > 0 && (
                            <div className="flex justify-between text-emerald-400 font-bold">
                              <span>Store Coupon Discount:</span>
                              <span>-₹{displayScenario.couponDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {displayScenario.expectedCashback > 0 && (
                            <div className="flex justify-between text-blue-400 font-bold pt-1 border-t border-white/[0.06]">
                              <span>Post-Purchase Cashback:</span>
                              <span>+₹{displayScenario.expectedCashback.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Stock & Delivery Days */}
                      <div className="text-[11px] text-zinc-400">
                        {offer.deliveryDays ? `Estimated delivery in ${offer.deliveryDays} days` : 'Standard regional transit'}
                      </div>
                    </div>

                    {/* BUY FROM STORE Primary CTA */}
                    <div className="pt-3 border-t border-white/[0.08] space-y-2">
                      {offer.directLinkVerified ? (
                        <a
                          href={offer.purchaseUrl || offer.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 active:scale-95 text-center group/btn"
                        >
                          <span>BUY FROM STORE</span>
                          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      ) : (
                        <div className="space-y-1.5">
                          <span className="block text-[10px] text-amber-400 font-bold text-center">
                            Direct purchase link pending
                          </span>
                          <a
                            href={offer.purchaseUrl || offer.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 border border-white/[0.08] hover:border-white/[0.16] text-[11px] font-bold text-zinc-300 hover:text-white text-center transition-all"
                          >
                            <span>Search Store Catalog</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}

                      <div className="text-[10px] text-zinc-400 text-center truncate font-mono">
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
            <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                      Promotion &amp; Discount Explorer
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white font-heading mt-1">
                    Verified Merchant &amp; Bank Offers
                  </h3>
                </div>

                {/* Sub-Tabs: Bank Offers, Coupons, Cashback */}
                <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-2xl border border-white/[0.08]">
                  <button
                    onClick={() => setActiveDiscountTab('bank')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeDiscountTab === 'bank' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Bank Offers
                  </button>
                  <button
                    onClick={() => setActiveDiscountTab('coupon')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeDiscountTab === 'coupon' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Store Coupons
                  </button>
                  <button
                    onClick={() => setActiveDiscountTab('cashback')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeDiscountTab === 'cashback' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
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
                        className="p-5 rounded-2xl bg-zinc-950/70 border border-white/[0.08] flex flex-col justify-between space-y-3 hover:border-white/[0.18] transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase text-orange-400">
                            <span>{promo.retailerName}</span>
                            <span className={`px-2 py-0.5 rounded-full border ${badge.color}`}>{badge.label}</span>
                          </div>

                          <h4 className="text-xs font-bold text-white leading-snug">
                            {promo.offerName}
                          </h4>

                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            {promo.eligibilityDescription}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 font-mono flex items-center justify-between">
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
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  What Marketplaces Hide
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300">
                {result.whatPlatformsHide.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-black text-sm shrink-0">&times;</span>
                    <span className="leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Price Truth &amp; Verification Methodology
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Exact Product Matching separates variants, refurbished, and bundles.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Direct buying links audited against canonical merchant product detail pages (PDP).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Cashback is never disguised as an immediate cash price reduction.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Stored gift cards reduce out-of-pocket cash, not market price.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. "My Shopping Offers" Preferences Modal */}
      {isPreferencesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-white/[0.12] bg-zinc-900/95 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-heading">
                    My Shopping Offers
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Select your active banking cards &amp; memberships to calculate your true eligible price
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsPreferencesOpen(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Banks Selector */}
              <div className="space-y-2">
                <span className="font-bold text-white block">
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
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                            : 'bg-zinc-950/70 text-zinc-400 border border-white/[0.08] hover:text-white'
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
                <span className="font-bold text-white block">
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
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-xs'
                            : 'bg-zinc-950/70 text-zinc-400 border border-white/[0.08] hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        <span>{mem}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/70 border border-white/[0.06] text-[11px] text-zinc-400 space-y-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Strict Consumer Privacy Guarantee:
                </span>
                <p>
                  We never store card numbers, CVVs, passwords, or OTPs. Selecting a bank simply checks whether public discount promotions apply to your order.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-zinc-400 hover:text-white transition-colors"
              >
                Skip / Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-orange-500/25 transition-transform active:scale-95"
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
