'use client';

// =============================================================================
// GlowFit AI / RIIQX — Smart Shopping & Dropshipping Arbitrage Studio
// Cinematic Obsidian Dark UI • Multimodal OCR • Instant Gift Card Auto-Credit
// =============================================================================

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Upload,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  Zap,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Percent,
  Copy,
  Check,
  RefreshCw,
  Gift,
  DollarSign,
  Flame,
  Film,
} from 'lucide-react';
import {
  ExtractedProductInfo,
  PlatformPriceDetail,
  ArbitrageOptimizationPlan,
  GiftCardPurchaseResult,
  DropshippingProductItem,
} from '@/services/shopping/types';
import { DROPSHIPPING_CATALOG } from '@/app/api/shopping/dropshipping/products/route';

export function SmartShoppingStudio() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'dropshipping' | 'wallet'>('scanner');

  // Scanner States
  const [urlInput, setUrlInput] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedProduct, setExtractedProduct] = useState<ExtractedProductInfo | null>(null);
  const [comparisons, setComparisons] = useState<PlatformPriceDetail[]>([]);
  const [optimalPlan, setOptimalPlan] = useState<ArbitrageOptimizationPlan | null>(null);

  // Gift Card Purchase States
  const [buyingGiftCard, setBuyingGiftCard] = useState(false);
  const [purchasedGiftCard, setPurchasedGiftCard] = useState<GiftCardPurchaseResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setScreenshotPreview(result);
      setScreenshotBase64(result);
    };
    reader.readAsDataURL(file);
  };

  // Run Arbitrage Analysis
  const handleAnalyze = async () => {
    if (!urlInput.trim() && !screenshotBase64) return;
    try {
      setAnalyzing(true);
      setExtractedProduct(null);
      setComparisons([]);
      setOptimalPlan(null);

      const res = await fetch('/api/shopping/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim() || undefined,
          screenshotBase64: screenshotBase64 || undefined,
          screenshotMimeType: 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExtractedProduct(data.extractedProduct);
        setComparisons(data.platformComparisons);
        setOptimalPlan(data.optimalPlan);
      }
    } catch (err) {
      console.error('Failed to analyze product:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Execute Gift Card Purchase & Auto-Credit
  const handlePurchaseGiftCard = async () => {
    if (!optimalPlan) return;
    try {
      setBuyingGiftCard(true);
      const res = await fetch('/api/shopping/giftcards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: optimalPlan.recommendedPlatform,
          faceValue: optimalPlan.giftCardArbitrage.giftCardAmountRequired,
          paymentMethod: 'upi',
          autoCreditToShoppingWallet: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPurchasedGiftCard(data.order);
      }
    } catch (err) {
      console.error('Gift card purchase error:', err);
    } finally {
      setBuyingGiftCard(false);
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'scanner'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Zap className="h-4 w-4" />
            Smart Arbitrage Scanner
          </button>

          <button
            onClick={() => setActiveTab('dropshipping')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'dropshipping'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Flame className="h-4 w-4" />
            High-Margin Dropshipping Hub
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'wallet'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Gift className="h-4 w-4" />
            My Wallets & Gift Cards
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#121215] px-3 py-1.5 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Real-time Arbitrage Engine: Active</span>
        </div>
      </div>

      {/* TAB 1: SMART ARBITRAGE SCANNER */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          {/* Hero Input Deck */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#121215] via-[#0C0C0E] to-[#151518] p-6 shadow-2xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                Multimodal Computer Vision & Arbitrage
              </span>
              <h2 className="mt-3 text-2xl font-black text-white tracking-tight sm:text-3xl">
                Compare Prices Across All Platforms & Unlock Optimal Gift Card Savings
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Paste any product link or drop a screenshot from Flipkart, Myntra, Amazon, or Meesho.
                Our AI scans cross-platform prices, calculates multi-tier gift card cashbacks, and automatically credits your shopping wallet.
              </p>
            </div>

            {/* Input Grid */}
            <div className="relative z-10 mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
              {/* URL Input */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Paste Product Link
                </label>
                <div className="flex items-center rounded-2xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 focus-within:border-amber-400">
                  <Search className="h-4 w-4 text-zinc-500 mr-2 shrink-0" />
                  <input
                    type="url"
                    placeholder="https://www.flipkart.com/... or https://www.amazon.in/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Screenshot Upload */}
              <div className="md:col-span-5 flex flex-col justify-center">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Or Upload Mobile Screenshot
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/60 px-4 py-2.5 hover:border-amber-400 transition">
                  <Upload className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-medium text-zinc-300 truncate">
                    {screenshotPreview ? 'Screenshot Attached ✓' : 'Drop product screenshot'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit Action */}
            <div className="relative z-10 mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
              <span className="text-xs text-zinc-500">
                Supported: Amazon • Flipkart • Myntra • Ajio • Meesho • Tata CLiQ
              </span>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || (!urlInput.trim() && !screenshotBase64)}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-2.5 text-xs font-extrabold text-black shadow-lg shadow-amber-500/20 transition hover:from-amber-300 hover:to-amber-500 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing Multimodal Arbitrage...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Scan & Optimize Price
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ARBITRAGE RESULTS PRESENTATION */}
          {extractedProduct && optimalPlan && (
            <div className="space-y-6">
              {/* Product Header Card */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl">
                {/* Left: Product Image / Thumbnail */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-black/40 p-4">
                  {screenshotPreview ? (
                    <img
                      src={screenshotPreview}
                      alt="Uploaded Screenshot"
                      className="max-h-60 rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center rounded-xl bg-zinc-900 text-zinc-600">
                      <ShoppingBag className="h-16 w-16 text-zinc-700" />
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-400 border border-cyan-400/20 font-mono">
                      Category: {extractedProduct.category.toUpperCase()}
                    </span>
                    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-mono text-zinc-400">
                      Vision Confidence: {(extractedProduct.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Right: Extracted Data & Instant Arbitrage Summary */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                      Brand: {extractedProduct.brand}
                    </span>
                    <h3 className="mt-1 text-xl font-black text-white">{extractedProduct.title}</h3>

                    {/* Features list */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {extractedProduct.extractedFeatures.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="rounded-lg bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-300"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Golden Price Card Banner */}
                  <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-[#121215] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Absolute Lowest Effective Price
                        </span>
                        <div className="mt-1 flex items-baseline gap-3">
                          <span className="text-3xl font-black text-emerald-400 font-mono">
                            ₹{optimalPlan.finalLowestEffectivePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm font-semibold text-zinc-500 line-through font-mono">
                            ₹{optimalPlan.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-extrabold text-emerald-300">
                            {optimalPlan.overallSavingsPct}% TOTAL SAVINGS
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                          Recommended platform: <strong className="text-white">{optimalPlan.recommendedPlatformName}</strong> via Gift Card Cashback Arbitrage
                        </p>
                      </div>

                      <button
                        onClick={handlePurchaseGiftCard}
                        disabled={buyingGiftCard}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-xs font-extrabold text-black shadow-lg shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50"
                      >
                        {buyingGiftCard ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="h-4 w-4" />
                        )}
                        Buy Gift Card & Auto-Credit Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Success Modal/Banner if Gift Card Bought */}
              {purchasedGiftCard && (
                <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-950/40 via-zinc-900 to-[#0C0C0E] p-6 shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-black">
                        <Gift className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                          Gift Card Acquired & Auto-Credited!
                        </span>
                        <h4 className="text-lg font-black text-white">
                          ₹{purchasedGiftCard.faceValue.toLocaleString('en-IN')} {purchasedGiftCard.platform.toUpperCase()} Voucher
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Cashback of ₹{purchasedGiftCard.cashbackEarned} credited to your GlowFit wallet balance.
                        </p>
                      </div>
                    </div>

                    <a
                      href={purchasedGiftCard.directWalletUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-400/20"
                    >
                      Open {purchasedGiftCard.platform.toUpperCase()} Wallet
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Voucher Card */}
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-zinc-800 bg-black/60 p-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Voucher Code
                      </span>
                      <div className="mt-1 flex items-center justify-between rounded-lg bg-zinc-900 px-3 py-2">
                        <span className="font-mono text-xs font-bold text-white tracking-wider">
                          {purchasedGiftCard.voucherCode}
                        </span>
                        <button
                          onClick={() => copyVoucherCode(purchasedGiftCard.voucherCode)}
                          className="text-zinc-400 hover:text-white"
                        >
                          {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Security PIN
                      </span>
                      <div className="mt-1 rounded-lg bg-zinc-900 px-3 py-2 font-mono text-xs font-bold text-amber-400 tracking-wider">
                        {purchasedGiftCard.voucherPin}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cross-Platform Price Comparison Table */}
              <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-amber-400" />
                    Real-Time Cross-Platform Comparative Intelligence
                  </h3>
                  <span className="text-xs text-zinc-500">Sorted by lowest effective price</span>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        <th className="py-3 px-3">Platform</th>
                        <th className="py-3 px-3">Listed Price</th>
                        <th className="py-3 px-3">Coupon Savings</th>
                        <th className="py-3 px-3">Bank Offer</th>
                        <th className="py-3 px-3">Gift Card Cashback</th>
                        <th className="py-3 px-3">Effective Price</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {comparisons.map((comp) => {
                        return (
                          <tr
                            key={comp.platform}
                            className={`transition hover:bg-zinc-800/20 ${
                              comp.isCheapest ? 'bg-amber-400/[0.03]' : ''
                            }`}
                          >
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{comp.displayName}</span>
                                {comp.isCheapest && (
                                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-400 border border-emerald-500/30">
                                    CHEAPEST
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-3 font-mono font-medium text-zinc-300">
                              ₹{comp.listedPrice.toLocaleString('en-IN')}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-amber-400">
                              -₹{comp.applicableCoupons[0]?.discountAmount || 0}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-cyan-400">
                              -₹{comp.bankOffers[0]?.discountAmount || 0}
                            </td>

                            <td className="py-3.5 px-3 font-mono text-emerald-400">
                              {comp.giftCardRate.cashbackRatePct}% ({comp.giftCardRate.provider})
                            </td>

                            <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                              ₹{comp.finalEffectivePrice.toLocaleString('en-IN')}
                            </td>

                            <td className="py-3.5 px-3 text-right">
                              <a
                                href={comp.productUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:border-amber-400 hover:text-white"
                              >
                                View Deal
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Step-by-Step Arbitrage Blueprint */}
              <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Percent className="h-5 w-5 text-emerald-400" />
                  Optimal Discount Maximization Blueprint
                </h3>
                <div className="mt-4 space-y-2.5">
                  {optimalPlan.stepByStepActionPlan.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center gap-3 rounded-xl bg-zinc-900/60 p-3 border border-zinc-800/80"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-black text-emerald-400 font-mono">
                        {sIdx + 1}
                      </span>
                      <p className="text-xs font-medium text-zinc-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HIGH-MARGIN DROPSHIPPING HUB */}
      {activeTab === 'dropshipping' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-800 bg-gradient-to-r from-[#121215] via-[#101013] to-[#151518] p-6 shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Direct Dropshipping Engine
              </span>
              <h2 className="mt-1 text-xl font-bold text-white">
                Curated High-Converting Viral Dropshipping Products
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Verified suppliers • Average 70%+ gross margin • 1-Click sync to Creator Studio to generate video ads
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {DROPSHIPPING_CATALOG.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-3xl border border-zinc-800 bg-[#121215] p-5 transition hover:border-zinc-700 hover:shadow-2xl hover:shadow-amber-500/5"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-zinc-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-black/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-md border border-amber-400/30 font-mono">
                      {item.trendingScore}/100 VIRAL SCORE
                    </span>
                    <span className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-black text-black">
                      {item.profitMarginPct.toFixed(0)}% MARGIN
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      {item.category} • Supplier: {item.supplierName}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">{item.description}</p>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-black/50 p-3 border border-zinc-800 font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Supplier Cost</span>
                      <span className="text-xs font-bold text-zinc-300">
                        ₹{item.supplierPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">Selling Price</span>
                      <span className="text-xs font-bold text-white">
                        ₹{item.suggestedSellingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">Profit / Unit</span>
                      <span className="text-xs font-bold text-emerald-400">
                        +₹{item.potentialProfitPerUnit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Ad Hook preview */}
                  <div className="mt-3 rounded-xl bg-zinc-900/60 p-2.5 border border-zinc-800 text-[11px]">
                    <span className="font-bold text-amber-400">Ready Hook: </span>
                    <span className="text-zinc-300 italic">"{item.readyAdHooks[0]}"</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Shipping: {item.shippingDays}
                  </span>
                  <button
                    onClick={() => {
                      // Pre-fill search scanner with this product title
                      setUrlInput(`https://www.amazon.in/s?k=${encodeURIComponent(item.title)}`);
                      setActiveTab('scanner');
                      handleAnalyze();
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 transition"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Arbitrage This Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WALLET & GIFT CARDS */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  User Wallet & Cashbacks
                </span>
                <h2 className="text-2xl font-black text-white font-mono">
                  Total Cashback Balance: ₹3,450.00
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Earned through cross-platform gift card arbitrage on Amazon, Flipkart, Myntra, and Ajio.
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 transition">
                  Withdraw to UPI
                </button>
              </div>
            </div>
          </div>

          {/* Active Synced Wallets */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { name: 'Amazon Pay Balance', balance: '₹1,500', status: 'Auto-Synced', link: 'https://www.amazon.in/gp/payment/ajax/add-gift-card.html' },
              { name: 'Flipkart Wallet', balance: '₹2,200', status: 'Auto-Synced', link: 'https://www.flipkart.com/account/giftcard' },
              { name: 'Myntra Credit', balance: '₹850', status: 'Auto-Synced', link: 'https://www.myntra.com/my/giftcards' },
            ].map((w, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800 bg-[#121215] p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{w.name}</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                      {w.status}
                    </span>
                  </div>
                  <div className="mt-3 text-xl font-bold text-white font-mono">{w.balance}</div>
                </div>

                <a
                  href={w.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                >
                  Manage on Platform <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
