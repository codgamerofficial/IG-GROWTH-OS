'use client';

// =============================================================================
// GlowFit AI / RIIQX — Smart Shopping & Dropshipping Arbitrage Studio
// Cinematic Obsidian Dark UI • Multimodal OCR • Instant Gift Card Auto-Credit
// Phase 2: Authentic Marketplace, Category Browser, Product Detail & Supplier Onboarding
// =============================================================================

import React, { useState, useEffect } from 'react';
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
  Filter,
  Eye,
  SlidersHorizontal,
  Star,
  Truck,
  Building,
  MapPin,
  Tag,
  X,
  AlertCircle,
  Plus,
} from 'lucide-react';
import {
  ExtractedProductInfo,
  PlatformPriceDetail,
  ArbitrageOptimizationPlan,
  GiftCardPurchaseResult,
  DropshippingProductItem,
} from '@/services/shopping/types';
import { DROPSHIPPING_CATALOG } from '@/services/shopping/catalog';
import {
  CommerceService,
  MarketplaceProduct,
  ProductCategoryItem,
  SupplierRegistrationInput,
} from '@/services/shopping/commerce-service';
import { useRiiqx } from '@/context/RiiqxContext';

export function SmartShoppingStudio() {
  const { setActiveTab: setActiveWorkspaceTab } = useRiiqx();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'scanner' | 'dropshipping' | 'wallet'>('marketplace');
  const [creatingAdId, setCreatingAdId] = useState<string | null>(null);

  // Marketplace States
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategoryItem[]>(CommerceService.CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'discount_desc'>('popularity');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Supplier Onboarding Modal States
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierForm, setSupplierForm] = useState<SupplierRegistrationInput>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstin: '',
    warehouseAddress: '',
    warehouseCity: '',
    warehousePincode: '',
    shippingDaysMin: 2,
    shippingDaysMax: 4,
    returnWindowDays: 7,
  });
  const [submittingSupplier, setSubmittingSupplier] = useState(false);
  const [supplierSuccessMsg, setSupplierSuccessMsg] = useState<string | null>(null);
  const [supplierErrors, setSupplierErrors] = useState<string[]>([]);

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

  // Initial Load of Marketplace Products
  useEffect(() => {
    fetchMarketplaceProducts();
  }, [selectedCategory, searchQuery, sortBy, inStockOnly]);

  const fetchMarketplaceProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (inStockOnly) params.set('inStockOnly', 'true');
      params.set('sortBy', sortBy);

      const res = await fetch(`/api/shopping/marketplace/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.warn('Failed to load marketplace products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // File Upload Handler for Scanner
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

  // Cross-compare a marketplace product directly in the scanner
  const handleTriggerScannerForProduct = (prod: MarketplaceProduct) => {
    setUrlInput(prod.title);
    if (prod.images[0]) {
      setScreenshotPreview(prod.images[0]);
    }
    setActiveTab('scanner');
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
        setPurchasedGiftCard(data.purchaseResult);
      }
    } catch (err) {
      console.error('Failed to purchase gift card:', err);
    } finally {
      setBuyingGiftCard(false);
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 1-Click Video Ad Generation Bridge
  const handleCreateVideoAd = async (productId: string, productName?: string) => {
    setCreatingAdId(productId);
    try {
      const res = await fetch('/api/shopping/dropshipping/create-video-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveWorkspaceTab('editor');
      }
    } catch (err) {
      console.error('Failed to create video ad:', err);
    } finally {
      setCreatingAdId(null);
    }
  };

  // Handle Supplier Registration Submission
  const handleRegisterSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSupplier(true);
    setSupplierErrors([]);
    setSupplierSuccessMsg(null);

    try {
      const res = await fetch('/api/shopping/marketplace/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierForm),
      });

      const data = await res.json();
      if (data.success) {
        setSupplierSuccessMsg(data.message);
        setTimeout(() => {
          setShowSupplierModal(false);
          setSupplierSuccessMsg(null);
        }, 3000);
      } else {
        setSupplierErrors(data.errors || [data.message || 'Onboarding failed']);
      }
    } catch (err: any) {
      setSupplierErrors([err.message || 'Network error']);
    } finally {
      setSubmittingSupplier(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Navigation Sub-Tabs & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'marketplace'
                ? 'bg-[#FFD43B] text-black shadow-lg shadow-[#FFD43B]/20'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Marketplace &amp; Trending
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'scanner'
                ? 'bg-[#FFD43B] text-black shadow-lg shadow-[#FFD43B]/20'
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
                ? 'bg-[#FFD43B] text-black shadow-lg shadow-[#FFD43B]/20'
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
                ? 'bg-[#FFD43B] text-black shadow-lg shadow-[#FFD43B]/20'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Gift className="h-4 w-4" />
            My Wallets &amp; Gift Cards
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs text-white font-medium transition"
          >
            <Building className="h-3.5 w-3.5 text-[#FFD43B]" />
            <span>Supplier Onboarding</span>
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#121215] px-3 py-1.5 text-xs text-zinc-400 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Zero Mock Verification: Active</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: MARKETPLACE & TRENDING DISCOVERY (PHASE 2 CORE)
          ========================================================================= */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#121215] via-[#0C0C0E] to-[#151518] p-6 shadow-2xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FFD43B]/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#06B6D4]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD43B]/30 bg-[#FFD43B]/10 px-3 py-0.5 text-[11px] font-bold text-[#FFD43B] font-mono">
                  <Sparkles className="h-3 w-3" />
                  RIIQX Verified Commerce Engine • India Consumer Protection Compliant
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Premium Commerce Discovery &amp; Dropshipping Marketplace
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Direct verified supplier catalog with authentic MRP disclosures, country of origin tracking, instant video ad creation, and cross-platform price arbitrage.
                </p>
              </div>

              {/* Quick Stats Pill Deck */}
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-zinc-800 bg-[#18181B] p-3 text-center min-w-[100px]">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Catalog</span>
                  <span className="text-lg font-bold text-white font-mono">{products.length} Products</span>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-[#18181B] p-3 text-center min-w-[100px]">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Avg Savings</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">48.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Horizontal Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#FFD43B] text-black shadow-md shadow-[#FFD43B]/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat.id ? 'bg-black/20 text-black font-bold' : 'bg-black/50 text-zinc-500'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            ))}
          </div>

          {/* Search, Filter & Sort Deck */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl border border-zinc-800 bg-[#121215]">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by brand, specs, name..."
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD43B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* In-Stock Filter */}
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-[#FFD43B] focus:ring-0"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                >
                  <option value="popularity">Trending Popularity</option>
                  <option value="discount_desc">Verified Discount (High to Low)</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          {loadingProducts ? (
            <div className="p-16 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-[#FFD43B]" />
              <span>Fetching Verified Marketplace Catalog...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => {
                const savings = product.verifiedMrp - product.currentPrice;
                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl border border-zinc-800 bg-[#121215] overflow-hidden hover:border-[#FFD43B]/60 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      {/* Product Visual Header with Badges */}
                      <div className="relative aspect-square w-full bg-[#0C0C0E] overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images[0] || '/icons/icon-512x512.png'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                          {product.badges.map((b, bIdx) => (
                            <span
                              key={bIdx}
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                b === 'Trending'
                                  ? 'bg-amber-400 text-black'
                                  : b === 'Best Seller'
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-emerald-500 text-white'
                              }`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>

                        {/* Verified Discount Badge */}
                        <div className="absolute top-2.5 right-2.5 rounded-lg bg-black/80 backdrop-blur-xs border border-white/10 px-2 py-1 text-center">
                          <span className="text-[11px] font-bold text-emerald-400 font-mono block">
                            {product.discountPct}% OFF
                          </span>
                        </div>

                        {/* Origin Pill */}
                        <div className="absolute bottom-2 left-2.5 rounded bg-black/80 px-2 py-0.5 text-[9px] font-mono text-zinc-400 border border-white/10">
                          {product.countryOfOrigin}
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span>{product.brand}</span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="h-3 w-3 fill-amber-400" />
                            <span>{product.seller.rating}</span>
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-white line-clamp-2 leading-relaxed" title={product.title}>
                          {product.title}
                        </h3>

                        {/* Pricing & Savings */}
                        <div className="pt-1 flex items-baseline gap-2">
                          <span className="text-lg font-black text-white font-mono">
                            ₹{product.currentPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-zinc-500 line-through font-mono">
                            ₹{product.verifiedMrp.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                            (Save ₹{savings.toLocaleString('en-IN')})
                          </span>
                        </div>

                        {/* Seller Transparency */}
                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                          <span className="truncate max-w-[140px]" title={product.seller.name}>
                            By {product.seller.name}
                          </span>
                          <span className="text-zinc-500">{product.shippingDaysEstimate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Deck */}
                    <div className="p-3 border-t border-zinc-800 bg-[#16161a] space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setSelectedVariantIdx(0);
                          }}
                          className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold transition"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Specs</span>
                        </button>

                        <button
                          onClick={() => handleTriggerScannerForProduct(product)}
                          className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold transition"
                        >
                          <Zap className="h-3 w-3" />
                          <span>Arbitrage</span>
                        </button>
                      </div>

                      {/* 1-Click Video Ad Bridge */}
                      <button
                        onClick={() => handleCreateVideoAd(product.id, product.title)}
                        disabled={creatingAdId === product.id}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black text-xs font-bold transition shadow-md shadow-[#FFD43B]/10 disabled:opacity-50"
                      >
                        {creatingAdId === product.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Building Video Storyboard...</span>
                          </>
                        ) : (
                          <>
                            <Film className="h-3.5 w-3.5" />
                            <span>1-Click Create Video Ad</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl border border-dashed border-zinc-800 bg-[#121215] space-y-3">
              <ShoppingBag className="h-10 w-10 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Marketplace Products Found</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                No products matching your search criteria. Try clearing filters or selecting another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setInStockOnly(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs text-white hover:bg-zinc-700"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Product Detail Modal */}
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#FFD43B] font-bold">
                      {selectedProduct.brand} • SKU: {selectedProduct.sku}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5">{selectedProduct.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Gallery & Origin */}
                  <div className="space-y-3">
                    <div className="aspect-square w-full rounded-2xl bg-black border border-zinc-800 overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Disclosures & Regulatory Badges */}
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Country of Origin:</span>
                        <span className="font-semibold text-white">{selectedProduct.countryOfOrigin}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Warranty:</span>
                        <span className="font-semibold text-white">{selectedProduct.warranty}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>Return Policy:</span>
                        <span className="font-semibold text-white">{selectedProduct.returnPolicy}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span>GTIN / Barcode:</span>
                        <span className="font-mono text-zinc-300">{selectedProduct.gtin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing, Variants, Specs & Actions */}
                  <div className="space-y-4">
                    {/* Price Bar */}
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-zinc-500 font-mono block">Selling Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white font-mono">
                            ₹{(selectedProduct.currentPrice + (selectedProduct.variants[selectedVariantIdx]?.priceDelta || 0)).toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-zinc-500 line-through font-mono">
                            ₹{selectedProduct.verifiedMrp.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 font-mono px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {selectedProduct.discountPct}% OFF
                      </span>
                    </div>

                    {/* Variants Selector */}
                    {selectedProduct.variants.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                          Available Variants:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedProduct.variants.map((v, vIdx) => (
                            <button
                              key={v.id}
                              onClick={() => setSelectedVariantIdx(vIdx)}
                              className={`p-2.5 rounded-xl border text-left text-xs transition ${
                                selectedVariantIdx === vIdx
                                  ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-white'
                                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <span className="font-semibold block truncate">{v.name}</span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                {v.priceDelta > 0 ? `+₹${v.priceDelta}` : 'Standard'} • {v.stockQty} in stock
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full Specifications Table */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                        Technical Specifications:
                      </label>
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden text-xs">
                        {Object.entries(selectedProduct.specifications).map(([key, val], sIdx) => (
                          <div
                            key={sIdx}
                            className={`flex items-center justify-between p-2.5 ${
                              sIdx % 2 === 0 ? 'bg-zinc-900' : 'bg-[#141417]'
                            }`}
                          >
                            <span className="text-zinc-400">{key}</span>
                            <span className="text-white font-medium text-right max-w-[200px] truncate">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Seller Information Card */}
                    <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-[#FFD43B]" />
                          <span>{selectedProduct.seller.name}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">GSTIN Verified</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {selectedProduct.seller.address}, {selectedProduct.seller.city}, {selectedProduct.seller.state}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500">
                        GSTIN: {selectedProduct.seller.gstin}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          const p = selectedProduct;
                          setSelectedProduct(null);
                          handleTriggerScannerForProduct(p);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition flex items-center justify-center gap-1.5"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Compare Prices Across Retailers</span>
                      </button>

                      <button
                        onClick={() => {
                          const p = selectedProduct;
                          setSelectedProduct(null);
                          handleCreateVideoAd(p.id, p.title);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition shadow-lg shadow-[#FFD43B]/10 flex items-center justify-center gap-1.5"
                      >
                        <Film className="h-4 w-4" />
                        <span>1-Click Video Ad</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supplier Onboarding Modal */}
          {showSupplierModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-[#FFD43B]" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Dropshipping Supplier Registration</h3>
                      <span className="text-[10px] font-mono text-zinc-400">
                        Join RIIQX Verified Merchant &amp; Supplier Network
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSupplierModal(false)}
                    className="p-1 rounded-lg text-zinc-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {supplierSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{supplierSuccessMsg}</span>
                  </div>
                )}

                {supplierErrors.length > 0 && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 space-y-1">
                    {supplierErrors.map((err, eIdx) => (
                      <div key={eIdx} className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleRegisterSupplier} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Company Name</label>
                      <input
                        type="text"
                        value={supplierForm.companyName}
                        onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                        placeholder="e.g. Apex Electronics Ltd"
                        required
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Contact Person</label>
                      <input
                        type="text"
                        value={supplierForm.contactPerson}
                        onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                        placeholder="e.g. Rohit Sen"
                        required
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Official Email</label>
                      <input
                        type="email"
                        value={supplierForm.email}
                        onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                        placeholder="supply@apex.in"
                        required
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Phone Number (10 Digits)</label>
                      <input
                        type="tel"
                        value={supplierForm.phone}
                        onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                        placeholder="9876543210"
                        required
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      15-Digit Indian GSTIN
                    </label>
                    <input
                      type="text"
                      value={supplierForm.gstin}
                      onChange={(e) => setSupplierForm({ ...supplierForm, gstin: e.target.value.toUpperCase() })}
                      placeholder="e.g. 27AABCA1234F1Z8"
                      required
                      maxLength={15}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#FFD43B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Warehouse Address</label>
                    <input
                      type="text"
                      value={supplierForm.warehouseAddress}
                      onChange={(e) => setSupplierForm({ ...supplierForm, warehouseAddress: e.target.value })}
                      placeholder="Plot 18, Industrial Logistics Hub"
                      required
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Warehouse City</label>
                      <input
                        type="text"
                        value={supplierForm.warehouseCity}
                        onChange={(e) => setSupplierForm({ ...supplierForm, warehouseCity: e.target.value })}
                        placeholder="Navi Mumbai"
                        required
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Pincode (6 Digits)</label>
                      <input
                        type="text"
                        value={supplierForm.warehousePincode}
                        onChange={(e) => setSupplierForm({ ...supplierForm, warehousePincode: e.target.value })}
                        placeholder="400705"
                        required
                        maxLength={6}
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#FFD43B]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSupplierModal(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingSupplier}
                      className="px-4 py-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition disabled:opacity-50"
                    >
                      {submittingSupplier ? 'Verifying GSTIN...' : 'Submit for Verification'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: SMART ARBITRAGE SCANNER
          ========================================================================= */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          {/* Hero Input Deck */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#121215] via-[#0C0C0E] to-[#151518] p-6 shadow-2xl">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                Multimodal Computer Vision &amp; Arbitrage
              </span>
              <h2 className="mt-3 text-2xl font-black text-white tracking-tight sm:text-3xl">
                Compare Prices Across All Platforms &amp; Unlock Optimal Gift Card Savings
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                Paste any product link or upload a checkout screenshot from Amazon, Flipkart, Myntra, or Meesho.
                Our AI detects hidden bank coupons, platform offers, and authorized gift card cashback arbitrage.
              </p>

              {/* Input Forms */}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste Amazon, Flipkart, or Myntra product URL..."
                    className="w-full rounded-2xl border border-zinc-800 bg-[#18181B] pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-700 transition">
                    <Upload className="h-4 w-4 text-amber-400" />
                    <span>Upload Screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || (!urlInput && !screenshotBase64)}
                    className="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-xs font-black text-black hover:bg-amber-300 disabled:opacity-50 transition shadow-lg shadow-amber-400/20"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Scanning Multi-Platform...</span>
                      </>
                    ) : (
                      <>
                        <span>Calculate Arbitrage</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {screenshotPreview && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#151518] p-2 max-w-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshotPreview}
                    alt="Uploaded screenshot"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 truncate text-xs text-zinc-300">
                    Screenshot loaded for multimodal OCR analysis
                  </div>
                  <button
                    onClick={() => {
                      setScreenshotPreview(null);
                      setScreenshotBase64(null);
                    }}
                    className="text-zinc-500 hover:text-white p-1 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analysis & Arbitrage Results */}
          {optimalPlan && extractedProduct && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Optimal Plan & Gift Card Auto-Credit (5 Cols) */}
              <div className="space-y-6 lg:col-span-5">
                <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-[#121215] p-6 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                        Lowest Possible Effective Price
                      </span>
                      <h3 className="mt-1 text-3xl font-black text-white font-mono">
                        ₹{optimalPlan.finalLowestEffectivePrice.toLocaleString('en-IN')}
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/10 px-3 py-1.5 text-right border border-emerald-500/30">
                      <span className="text-[10px] text-zinc-400 block font-mono">Save Up To</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        {optimalPlan.overallSavingsPct}% OFF
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between text-zinc-300">
                      <span>Detected Product MRP:</span>
                      <span className="font-mono text-zinc-400 line-through">
                        ₹{extractedProduct.originalMrp.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-zinc-300">
                      <span>Cheapest Platform:</span>
                      <span className="font-bold text-amber-400 uppercase">
                        {optimalPlan.recommendedPlatformName}
                      </span>
                    </div>

                    <div className="flex justify-between text-zinc-300">
                      <span>Base Listed Price:</span>
                      <span className="font-mono text-white">
                        ₹{optimalPlan.baseListedPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {optimalPlan.appliedCoupon && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Coupon Savings ({optimalPlan.appliedCoupon.code}):</span>
                        <span className="font-mono font-bold">-₹{optimalPlan.appliedCoupon.savings}</span>
                      </div>
                    )}

                    {optimalPlan.appliedBankOffer && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Bank / Card Offer ({optimalPlan.appliedBankOffer.bank}):</span>
                        <span className="font-mono font-bold">-₹{optimalPlan.appliedBankOffer.savings}</span>
                      </div>
                    )}

                    <div className="border-t border-dashed border-zinc-800 pt-3">
                      <div className="flex justify-between text-cyan-400 font-bold">
                        <span>Gift Card Arbitrage ({optimalPlan.giftCardArbitrage.giftCardDiscountPct}% Off):</span>
                        <span className="font-mono">
                          -₹{optimalPlan.giftCardArbitrage.giftCardImmediateSavings}
                        </span>
                      </div>
                      <div className="flex justify-between text-purple-400 text-[11px] mt-1">
                        <span>+ Guaranteed Wallet Cashback:</span>
                        <span className="font-mono">
                          +₹{optimalPlan.giftCardArbitrage.cashbackEarned}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Purchase Action */}
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handlePurchaseGiftCard}
                      disabled={buyingGiftCard}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3 text-xs font-black text-black hover:bg-amber-300 transition shadow-xl shadow-amber-400/20 disabled:opacity-50"
                    >
                      {buyingGiftCard ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Generating Instant Gift Card...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>
                            Buy ₹{optimalPlan.giftCardArbitrage.giftCardAmountRequired} Gift Card for ₹{optimalPlan.giftCardArbitrage.netGiftCardCost}
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-zinc-500 font-mono">
                      ✓ Instant voucher generation • Auto-syncs directly to {optimalPlan.recommendedPlatformName} wallet
                    </p>
                  </div>
                </div>

                {/* Purchased Gift Card Voucher Card */}
                {purchasedGiftCard && (
                  <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-[#121215] p-5 shadow-xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Gift Card Generated &amp; Synced!
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        Cashback Credited: ₹{purchasedGiftCard.cashbackEarned}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-zinc-800 bg-black/60 p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase text-zinc-500 font-mono block">Voucher Code</span>
                        <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">
                          {purchasedGiftCard.voucherCode}
                        </span>
                      </div>
                      <button
                        onClick={() => copyVoucherCode(purchasedGiftCard.voucherCode)}
                        className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-white hover:bg-zinc-700 flex items-center gap-1"
                      >
                        {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <a
                      href={purchasedGiftCard.directWalletUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 py-2.5 text-xs font-bold text-white hover:bg-zinc-700 transition"
                    >
                      <span>Open {optimalPlan.recommendedPlatformName} Wallet</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Multi-Platform Comparison Table (7 Cols) */}
              <div className="space-y-4 lg:col-span-7">
                <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h3 className="text-sm font-bold text-white">Live Retailer Price Comparison</h3>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Real-time OCR &amp; API Validation
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {comparisons.map((item, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-4 transition ${
                          item.isCheapest
                            ? 'border-emerald-500/40 bg-emerald-950/10'
                            : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center font-bold text-xs text-white uppercase font-mono">
                              {item.platform.slice(0, 3)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{item.displayName}</h4>
                                {item.isCheapest && (
                                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                                    Lowest Cost
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-400">
                                Seller: {item.sellerName} ({item.sellerRating}★) • Delivery: {item.deliveryDays} Days
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-lg font-black text-white font-mono block">
                              ₹{item.finalEffectivePrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-zinc-500 line-through font-mono">
                              ₹{item.mrp.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Offers Accordion */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-zinc-800/60 pt-2 text-[11px]">
                          {item.applicableCoupons[0] && (
                            <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                              <Percent className="h-3 w-3" />
                              <span>Coupon: -₹{item.applicableCoupons[0].discountAmount} ({item.applicableCoupons[0].code})</span>
                            </div>
                          )}

                          {item.bankOffers[0] && (
                            <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
                              <CreditCard className="h-3 w-3" />
                              <span>Bank: -₹{item.bankOffers[0].discountAmount} ({item.bankOffers[0].bank})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: HIGH-MARGIN DROPSHIPPING HUB
          ========================================================================= */}
      {activeTab === 'dropshipping' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                RIIQX Autonomous Commerce Engine
              </span>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                High-Margin Trending Dropshipping Catalog
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pre-negotiated supplier products with 70%+ gross profit margins. Launch viral video ad campaigns in Creator Studio with 1-click and sync orders directly with Shenzhen &amp; domestic Indian warehouses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DROPSHIPPING_CATALOG.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-zinc-800 bg-[#121215] overflow-hidden flex flex-col justify-between shadow-xl hover:border-amber-400/50 transition-all group"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/30">
                      Margin: {item.profitMarginPct}%
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">{item.category}</span>
                    <h3 className="text-sm font-bold text-white line-clamp-2">{item.title}</h3>

                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-zinc-900/60 p-3 border border-zinc-800/80 text-center font-mono">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Supplier</span>
                        <span className="text-xs font-bold text-zinc-300">₹{item.supplierPrice}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 block">Profit/Unit</span>
                        <span className="text-xs font-black text-emerald-400">+₹{item.potentialProfitPerUnit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-zinc-800/80 bg-[#151518] space-y-2">
                  <button
                    onClick={() => handleCreateVideoAd(item.id, item.title)}
                    disabled={creatingAdId === item.id}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2.5 text-xs font-black text-black hover:bg-amber-300 transition shadow-lg shadow-amber-400/20 disabled:opacity-50"
                  >
                    {creatingAdId === item.id ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Launching Video Ad...</span>
                      </>
                    ) : (
                      <>
                        <Film className="h-3.5 w-3.5" />
                        <span>1-Click Create Video Ad</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: WALLET & GIFT CARDS
          ========================================================================= */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFD43B]">
                  User Wallet &amp; Cashbacks
                </span>
                <h2 className="text-2xl font-black text-white font-mono">
                  Total Cashback Balance: ₹3,450.00
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Earned through cross-platform gift card arbitrage on Amazon, Flipkart, Myntra, and Ajio.
                </p>
              </div>

              <div className="flex gap-2">
                <button className="rounded-xl bg-[#FFD43B] px-4 py-2 text-xs font-bold text-black hover:bg-[#FFE066] transition">
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
                  className="mt-4 inline-flex items-center gap-1 text-xs text-[#FFD43B] hover:text-[#FFE066]"
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
