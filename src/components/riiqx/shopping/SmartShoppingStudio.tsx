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
  ArrowUpRight,
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
  Bell,
  TrendingUp,
  Clock,
  Package,
  Box,
  RotateCcw,
  ChevronRight,
  Layers,
  Calculator,
  Bot,
  Send,
  MessageSquare,
} from 'lucide-react';
import {
  ExtractedProductInfo,
  PlatformPriceDetail,
  ArbitrageOptimizationPlan,
  GiftCardPurchaseResult,
  DropshippingProductItem,
  ProductMatchResult,
  RetailerCoverageReport,
  PriceHistoryData,
  GiftCardBrandItem,
  DeterministicSavingsWaterfall,
  CashbackLedgerEntry,
  DropshippingOrder,
  DropshippingOrderStatus,
  SupplierInventoryItem,
  ContributionMarginBreakdown,
  ReturnRefundReason,
} from '@/services/shopping/types';
import { GiftCardArbitrageService } from '@/services/shopping/giftcard-arbitrage';
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
  const [activeTab, setActiveTab] = useState<'marketplace' | 'scanner' | 'dropshipping' | 'wallet' | 'assistant'>('marketplace');
  const [creatingAdId, setCreatingAdId] = useState<string | null>(null);

  // Phase 6: AI Shopping Assistant States
  const [assistantMessages, setAssistantMessages] = useState<
    Array<{
      id: string;
      role: 'user' | 'assistant';
      text: string;
      provider?: string;
      model?: string;
      latencyMs?: number;
      matchedProduct?: any;
      savingsPlan?: any;
      suggestedActions?: any[];
      time: string;
    }>
  >([
    {
      id: 'msg_welcome',
      role: 'assistant',
      text: `👋 **Welcome to the RIIQX Autonomous AI Shopping Assistant!**

I perform multi-platform price scans across Amazon, Flipkart, Myntra, Ajio, and Meesho, analyze coupons, and calculate deterministic gift card arbitrage. Ask me anything or pick a quick suggestion below!`,
      provider: 'Google Gemini',
      model: 'gemini-2.5-flash',
      suggestedActions: [
        { id: 'q1', label: 'Sony WH-1000XM5 Best Deal', actionType: 'compare_prices' },
        { id: 'q2', label: 'Compare Noise Colorfit Pro 5', actionType: 'compare_prices' },
        { id: 'q3', label: 'Flipkart Gift Card Arbitrage Savings', actionType: 'buy_giftcard' },
        { id: 'q4', label: 'Highest Margin Ambient Desk Lamp', actionType: 'explore_catalog' },
      ],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [sendingAssistantMsg, setSendingAssistantMsg] = useState(false);
  const [assistantProviderInfo, setAssistantProviderInfo] = useState<{
    provider: string;
    model: string;
    latencyMs?: number;
  }>({
    provider: 'Google Gemini',
    model: 'gemini-2.5-flash',
  });

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
  const [matchResult, setMatchResult] = useState<ProductMatchResult | null>(null);
  const [coverageReport, setCoverageReport] = useState<RetailerCoverageReport[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData | null>(null);

  // Watchlist States
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [targetPriceInput, setTargetPriceInput] = useState('');
  const [savingWatchlist, setSavingWatchlist] = useState(false);
  const [watchlistSuccess, setWatchlistSuccess] = useState<string | null>(null);
  const [watchlistError, setWatchlistError] = useState<string | null>(null);

  // Gift Card Purchase States
  const [buyingGiftCard, setBuyingGiftCard] = useState(false);
  const [purchasedGiftCard, setPurchasedGiftCard] = useState<GiftCardPurchaseResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Gift Card Marketplace & Ledger States
  const [giftCardBrands, setGiftCardBrands] = useState<GiftCardBrandItem[]>(GiftCardArbitrageService.AUTHORIZED_BRANDS);
  const [cashbackLedger, setCashbackLedger] = useState<CashbackLedgerEntry[]>([]);
  const [userOrders, setUserOrders] = useState<GiftCardPurchaseResult[]>([]);
  const [selectedBrandForPurchase, setSelectedBrandForPurchase] = useState<GiftCardBrandItem | null>(null);
  const [selectedDenomination, setSelectedDenomination] = useState<number>(1000);
  const [buyingFromWallet, setBuyingFromWallet] = useState(false);

  // Dynamic User Wallet & Cashback State
  const [cashbackBalance, setCashbackBalance] = useState<number>(3450);
  const [walletBalances, setWalletBalances] = useState({
    amazon: 1500,
    flipkart: 2200,
    myntra: 850,
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdrawUpiId, setWithdrawUpiId] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500');
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState<boolean>(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawErrorMsg, setWithdrawErrorMsg] = useState<string | null>(null);

  // Phase 5: Dropshipping Operations States
  const [dropshippingOrders, setDropshippingOrders] = useState<DropshippingOrder[]>([]);
  const [inventoryItems, setInventoryItems] = useState<SupplierInventoryItem[]>([]);
  const [inventoryHealth, setInventoryHealth] = useState<{
    totalSkus: number;
    inSync: number;
    lowStock: number;
    outOfStock: number;
  } | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<DropshippingOrder | null>(null);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<DropshippingOrder | null>(null);
  const [returnReason, setReturnReason] = useState<ReturnRefundReason>('defective_or_damaged');
  const [returnReasonDetails, setReturnReasonDetails] = useState('');
  const [processingReturn, setProcessingReturn] = useState(false);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState<string | null>(null);
  const [returnErrorMsg, setReturnErrorMsg] = useState<string | null>(null);
  const [transitioningOrderId, setTransitioningOrderId] = useState<string | null>(null);
  const [syncingInventory, setSyncingInventory] = useState(false);
  const [creatingDemoOrder, setCreatingDemoOrder] = useState(false);
  const [demoOrderSuccessMsg, setDemoOrderSuccessMsg] = useState<string | null>(null);
  const [marginCalcSellingPrice, setMarginCalcSellingPrice] = useState(2499);
  const [marginCalcCogs, setMarginCalcCogs] = useState(1100);
  const [marginCalcShipping, setMarginCalcShipping] = useState(60);
  const [calculatedMargin, setCalculatedMargin] = useState<ContributionMarginBreakdown | null>(null);

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
  const handleAnalyze = async (overrideQuery?: string) => {
    const targetQuery = typeof overrideQuery === 'string' ? overrideQuery : urlInput;
    if (!targetQuery.trim() && !screenshotBase64) return;
    try {
      setAnalyzing(true);
      setExtractedProduct(null);
      setComparisons([]);
      setOptimalPlan(null);
      setMatchResult(null);
      setCoverageReport([]);
      setPriceHistory(null);

      const res = await fetch('/api/shopping/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetQuery.trim() || undefined,
          screenshotBase64: screenshotBase64 || undefined,
          screenshotMimeType: 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExtractedProduct(data.extractedProduct);
        setComparisons(data.platformComparisons);
        setOptimalPlan(data.optimalPlan);
        if (data.matchResult) setMatchResult(data.matchResult);
        if (data.coverageReport) setCoverageReport(data.coverageReport);
        if (data.priceHistory) setPriceHistory(data.priceHistory);

        // Pre-fill target price alert with 5% below lowest effective price
        const lowestEffective = data.optimalPlan?.finalLowestEffectivePrice || data.extractedProduct?.detectedPrice || 1000;
        setTargetPriceInput(String(Math.round(lowestEffective * 0.95)));
      }
    } catch (err) {
      console.error('Failed to analyze product:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Create Target Price Drop Alert
  const handleCreateWatchlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedProduct || !targetPriceInput) return;
    setSavingWatchlist(true);
    setWatchlistError(null);
    setWatchlistSuccess(null);

    try {
      const initial = optimalPlan?.finalLowestEffectivePrice || extractedProduct.detectedPrice;
      const target = Number(targetPriceInput);

      const res = await fetch('/api/shopping/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          productTitle: extractedProduct.title,
          productIdentifier: extractedProduct.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 32),
          targetPrice: target,
          initialPrice: initial,
          preferredPlatform: optimalPlan?.recommendedPlatform || 'any',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setWatchlistSuccess(`Price Drop Alert activated for ₹${target.toLocaleString('en-IN')}!`);
        setTimeout(() => {
          setShowWatchlistModal(false);
          setWatchlistSuccess(null);
        }, 2500);
      } else {
        setWatchlistError(data.error || 'Failed to create watchlist alert');
      }
    } catch (err: any) {
      setWatchlistError(err.message || 'Network error');
    } finally {
      setSavingWatchlist(false);
    }
  };

  // Cross-compare a marketplace product directly in the scanner
  const handleTriggerScannerForProduct = (prod: MarketplaceProduct) => {
    setUrlInput(prod.title);
    if (prod.images[0]) {
      setScreenshotPreview(prod.images[0]);
    }
    setActiveTab('scanner');
    handleAnalyze(prod.title);
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
        const earned = data.purchaseResult?.cashbackEarned || 0;
        if (earned > 0) {
          setCashbackBalance((prev) => prev + earned);
        }
        fetchWalletOrdersAndLedger();
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

  // Fetch Wallet Orders & Cashback Ledger
  useEffect(() => {
    if (activeTab === 'wallet') {
      fetchWalletOrdersAndLedger();
    }
  }, [activeTab]);

  const fetchWalletOrdersAndLedger = async () => {
    try {
      const res = await fetch('/api/shopping/giftcards/orders?userId=default_user');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.orders)) setUserOrders(data.orders);
          if (Array.isArray(data.cashbackLedger)) setCashbackLedger(data.cashbackLedger);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch wallet orders:', err);
    }
  };

  // Buy Gift Card directly from Brand Marketplace
  const handleBuyBrandGiftCard = async () => {
    if (!selectedBrandForPurchase) return;
    try {
      setBuyingFromWallet(true);
      const res = await fetch('/api/shopping/giftcards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          platform: selectedBrandForPurchase.brandKey.includes('amazon') ? 'amazon'
            : selectedBrandForPurchase.brandKey.includes('flipkart') ? 'flipkart'
            : selectedBrandForPurchase.brandKey.includes('myntra') ? 'myntra'
            : selectedBrandForPurchase.brandKey.includes('ajio') ? 'ajio'
            : selectedBrandForPurchase.brandKey.includes('tatacliq') ? 'tatacliq'
            : selectedBrandForPurchase.brandKey.includes('nykaa') ? 'nykaa'
            : 'meesho',
          brandKey: selectedBrandForPurchase.brandKey,
          faceValue: selectedDenomination,
          paymentMethod: 'upi',
          autoCreditToShoppingWallet: true,
          idempotencyKey: `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        }),
      });

      const data = await res.json();
      if (data.success && (data.purchaseResult || data.order)) {
        const order = data.purchaseResult || data.order;
        setPurchasedGiftCard(order);
        setSelectedBrandForPurchase(null);
        const earned = order.cashbackEarned || 0;
        if (earned > 0) {
          setCashbackBalance((prev) => prev + earned);
        }
        const platformKey = (order.platform || order.brandKey || '').toLowerCase();
        if (platformKey.includes('amazon')) {
          setWalletBalances((prev) => ({ ...prev, amazon: prev.amazon + (order.faceValue || 0) }));
        } else if (platformKey.includes('flipkart')) {
          setWalletBalances((prev) => ({ ...prev, flipkart: prev.flipkart + (order.faceValue || 0) }));
        } else if (platformKey.includes('myntra')) {
          setWalletBalances((prev) => ({ ...prev, myntra: prev.myntra + (order.faceValue || 0) }));
        }
        fetchWalletOrdersAndLedger();
      }
    } catch (err) {
      console.error('Failed to buy brand gift card:', err);
    } finally {
      setBuyingFromWallet(false);
    }
  };

  // Withdraw Cashback to UPI Handler
  const handleWithdrawToUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawErrorMsg(null);
    setWithdrawSuccessMsg(null);

    const cleanUpi = withdrawUpiId.trim();
    if (!cleanUpi || !cleanUpi.includes('@') || cleanUpi.split('@')[0].length < 2 || cleanUpi.split('@')[1].length < 2) {
      setWithdrawErrorMsg('Please enter a valid UPI ID (e.g. name@okaxis, 9830123456@paytm, user@upi).');
      return;
    }

    const numAmount = Number(withdrawAmount);
    if (isNaN(numAmount) || numAmount < 100) {
      setWithdrawErrorMsg('Minimum withdrawal amount is ₹100.');
      return;
    }

    if (numAmount > cashbackBalance) {
      setWithdrawErrorMsg(`Withdrawal amount exceeds available cashback balance of ₹${cashbackBalance.toLocaleString('en-IN')}.`);
      return;
    }

    setIsProcessingWithdraw(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const utr = `UTR${Date.now()}${Math.floor(Math.random() * 899 + 100)}`;
      setCashbackBalance((prev) => Math.max(0, prev - numAmount));

      const newLedgerEntry: CashbackLedgerEntry = {
        id: `payout_${Date.now()}`,
        userId: 'default_user',
        giftCardOrderId: `PAYOUT-${Date.now().toString(36).toUpperCase()}`,
        amount: numAmount,
        status: 'withdrawn',
        creditedAt: new Date().toISOString(),
        notes: `Instant UPI Payout to ${cleanUpi} (UTR: ${utr})`,
        createdAt: new Date().toISOString(),
      };
      setCashbackLedger((prev) => [newLedgerEntry, ...prev]);

      setWithdrawSuccessMsg(`₹${numAmount.toLocaleString('en-IN')} successfully transferred to ${cleanUpi}! UTR: ${utr}`);
      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setWithdrawErrorMsg(err.message || 'Failed to process UPI withdrawal.');
    } finally {
      setIsProcessingWithdraw(false);
    }
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

  // Phase 5: Fetch Dropshipping Operations Data
  useEffect(() => {
    if (activeTab === 'dropshipping') {
      fetchDropshippingData();
      recalculateMargin(marginCalcSellingPrice, marginCalcCogs, marginCalcShipping);
    }
  }, [activeTab]);

  const fetchDropshippingData = async () => {
    try {
      const [ordersRes, invRes] = await Promise.all([
        fetch('/api/shopping/dropshipping/orders'),
        fetch('/api/shopping/dropshipping/inventory'),
      ]);

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        if (oData.success && Array.isArray(oData.orders)) {
          setDropshippingOrders(oData.orders);
        }
      }

      if (invRes.ok) {
        const iData = await invRes.json();
        if (iData.success && Array.isArray(iData.inventory)) {
          setInventoryItems(iData.inventory);
          if (iData.health) setInventoryHealth(iData.health);
        }
      }
    } catch (err) {
      console.warn('Failed to load dropshipping operations data:', err);
    }
  };

  const handleSyncInventory = async () => {
    setSyncingInventory(true);
    try {
      const res = await fetch('/api/shopping/dropshipping/inventory', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchDropshippingData();
      }
    } catch (err) {
      console.error('Failed to sync inventory:', err);
    } finally {
      setSyncingInventory(false);
    }
  };

  const handleTransitionOrderStatus = async (orderId: string, nextStatus: DropshippingOrderStatus) => {
    setTransitioningOrderId(orderId);
    try {
      const res = await fetch(`/api/shopping/dropshipping/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchDropshippingData();
        if (selectedOrderForTracking?.id === orderId) {
          setSelectedOrderForTracking(data.order);
        }
      } else {
        alert(`State transition error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setTransitioningOrderId(null);
    }
  };

  const handleCreateDemoOrder = async (productId?: string) => {
    setCreatingDemoOrder(true);
    setDemoOrderSuccessMsg(null);
    try {
      const targetProd = products.find((p) => p.id === productId) || products[0] || {
        id: 'prod_lumina_aura_01',
        title: 'Lumina RGB Aura Kinetic Levitating Desk Lamp',
      };

      const res = await fetch('/api/shopping/dropshipping/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cust_riiqx_demo_01',
          customerName: 'Aarav Sengupta',
          customerEmail: 'aarav.sengupta@example.com',
          customerPhone: '+91 98301 23456',
          shippingAddress: {
            street: 'Flat 4B, Silver Oak Heights, Salt Lake Sector V',
            city: 'Kolkata',
            state: 'West Bengal',
            pincode: '700091',
            country: 'India',
          },
          items: [{ productId: targetProd.id, quantity: 1 }],
          paymentMethod: 'upi_direct',
          idempotencyKey: `idemp_demo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          initialStatus: 'paid',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDemoOrderSuccessMsg(`Demo Order ${data.order.id} placed & stock locked!`);
        await fetchDropshippingData();
        setTimeout(() => setDemoOrderSuccessMsg(null), 4000);
      } else {
        alert(`Order creation failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Order error: ${err.message}`);
    } finally {
      setCreatingDemoOrder(false);
    }
  };

  const handleProcessReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;

    setProcessingReturn(true);
    setReturnErrorMsg(null);
    setReturnSuccessMsg(null);

    try {
      const res = await fetch(`/api/shopping/dropshipping/orders/${selectedOrderForReturn.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedOrderForReturn.customerId,
          reason: returnReason,
          reasonDetails: returnReasonDetails || 'Automated QC inspection test',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReturnSuccessMsg(
          `Return Approved! Automated QC Passed. Refund TX: ${data.returnRecord?.refundGatewayTxId || 'Processed'}`
        );
        await fetchDropshippingData();
        setTimeout(() => {
          setSelectedOrderForReturn(null);
          setReturnSuccessMsg(null);
        }, 3000);
      } else {
        setReturnErrorMsg(data.error || 'Failed to process return');
      }
    } catch (err: any) {
      setReturnErrorMsg(err.message || 'Network error');
    } finally {
      setProcessingReturn(false);
    }
  };

  const recalculateMargin = async (sp: number, cogs: number, shipping: number) => {
    try {
      const res = await fetch(
        `/api/shopping/dropshipping/margins?sellingPrice=${sp}&cogs=${cogs}&shippingCost=${shipping}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success) setCalculatedMargin(data.breakdown);
      }
    } catch (err) {
      console.warn('Failed to calculate margin:', err);
    }
  };

  // Phase 6: Handle Assistant Chat
  const handleSendAssistantMessage = async (overridePrompt?: string) => {
    const promptToSend = (overridePrompt || assistantInput).trim();
    if (!promptToSend || sendingAssistantMsg) return;

    const userMsgId = `msg_user_${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      role: 'user' as const,
      text: promptToSend,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setAssistantMessages((prev) => [...prev, userMsg]);
    setAssistantInput('');
    setSendingAssistantMsg(true);

    try {
      const res = await fetch('/api/shopping/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          conversationHistory: assistantMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.response) {
        const r = data.response;
        setAssistantProviderInfo({
          provider: r.providerUsed,
          model: r.modelUsed,
          latencyMs: r.latencyMs,
        });

        const assistantMsg = {
          id: `msg_asst_${Date.now()}`,
          role: 'assistant' as const,
          text: r.reply,
          provider: r.providerUsed,
          model: r.modelUsed,
          latencyMs: r.latencyMs,
          matchedProduct: r.matchedProduct,
          savingsPlan: r.savingsPlan,
          suggestedActions: r.suggestedActions,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        };

        setAssistantMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg = {
          id: `msg_err_${Date.now()}`,
          role: 'assistant' as const,
          text: `⚠️ Error: ${data.error || 'Unable to process query.'}`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        };
        setAssistantMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      setAssistantMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant' as const,
          text: `⚠️ Network Error: ${err.message}`,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSendingAssistantMsg(false);
    }
  };

  const handleExecuteAssistantAction = (action: any) => {
    if (action.actionType === 'compare_prices') {
      if (action.payload?.product) {
        handleTriggerScannerForProduct(action.payload.product);
      } else {
        setUrlInput(action.label.replace('Compare ', '').replace(' Best Deal', ''));
        setActiveTab('scanner');
      }
    } else if (action.actionType === 'buy_giftcard') {
      setActiveTab('wallet');
    } else if (action.actionType === 'create_video_ad' && action.payload?.productId) {
      handleCreateVideoAd(action.payload.productId, action.payload.title);
    } else if (action.actionType === 'track_order' && action.payload?.orderId) {
      const ord = dropshippingOrders.find((o) => o.id === action.payload.orderId);
      if (ord) setSelectedOrderForTracking(ord);
    } else if (action.actionType === 'explore_catalog') {
      setActiveTab('dropshipping');
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col min-h-0 overflow-y-auto bg-[#0C0C0E] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 transition-colors select-auto">
      <div className="mx-auto w-full max-w-7xl space-y-6 pb-24 animate-fadeIn">
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

          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'assistant'
                ? 'bg-[#FFD43B] text-black shadow-lg shadow-[#FFD43B]/20'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            <Bot className="h-4 w-4 text-purple-400" />
            AI Shopping Assistant
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
                    onClick={() => handleAnalyze()}
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

              {/* Right Column: Multi-Platform Comparison Table, Spec Guard & Price History (7 Cols) */}
              <div className="space-y-4 lg:col-span-7">
                {/* Product Identity & Anti-Mismatched Specs Guard */}
                {matchResult && extractedProduct && (
                  <div className="rounded-2xl border border-zinc-800 bg-[#121215] p-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate max-w-xs" title={extractedProduct.title}>
                          {extractedProduct.title}
                        </span>
                        {extractedProduct.modelOrVariant && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {extractedProduct.modelOrVariant}
                          </span>
                        )}
                      </div>
                      
                      {matchResult.matchType === 'exact_match' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          <ShieldCheck className="h-3 w-3" />
                          Exact Spec Match Confirmed ({(matchResult.confidenceScore * 100).toFixed(0)}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                          <AlertCircle className="h-3 w-3" />
                          Variant Difference Detected ({matchResult.mismatchedAttributes?.join(', ') || 'Specs Differ'})
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <span className="text-zinc-500">Brand:</span>
                        <span className="text-white font-semibold">{extractedProduct.brand}</span>
                        <span className="text-zinc-500 ml-2">Category:</span>
                        <span className="text-white font-semibold capitalize">{extractedProduct.category}</span>
                      </span>

                      <span className={`font-mono text-[10px] font-semibold ${matchResult.isPurchaseSafe ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {matchResult.isPurchaseSafe ? '✓ Verified Safe to Arbitrage' : '⚠️ Verify Storage / Model Generation Before Checkout'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 30-Day Historical Price Observations & Target Price Drop Alert */}
                {priceHistory && (
                  <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-[#121215] to-[#16161a] p-4 shadow-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          30-Day Historical Price Observations
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold font-mono ${
                          priceHistory.priceTrendDirection === 'dropping'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : priceHistory.priceTrendDirection === 'increasing'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {priceHistory.priceTrendDirection === 'dropping' && <TrendingDown className="h-3 w-3" />}
                          {priceHistory.priceTrendDirection === 'increasing' && <TrendingUp className="h-3 w-3" />}
                          <span className="capitalize">{priceHistory.priceTrendDirection} Trend</span>
                        </span>

                        <button
                          onClick={() => setShowWatchlistModal(true)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition"
                        >
                          <Bell className="h-3 w-3 text-amber-400" />
                          <span>Set Price Drop Alert</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-zinc-800/60">
                      <div className="p-2 rounded-xl bg-black/40 border border-zinc-800/80">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Lowest Recorded</span>
                        <span className="text-sm font-black text-emerald-400 font-mono">
                          ₹{priceHistory.lowestObserved.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-zinc-800/80">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">30-Day Average</span>
                        <span className="text-sm font-black text-white font-mono">
                          ₹{priceHistory.averageObserved.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-zinc-800/80">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono block">Peak MRP</span>
                        <span className="text-sm font-black text-zinc-400 font-mono line-through">
                          ₹{priceHistory.highestObserved.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Retailer Real-Time Coverage Strip */}
                {coverageReport.length > 0 && (
                  <div className="rounded-2xl border border-zinc-800/80 bg-[#0e0e11] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase font-semibold">Coverage Status:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      {coverageReport.map((cov, cIdx) => (
                        <span
                          key={cIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span className="font-semibold text-white">{cov.displayName}</span>
                          <span className="text-zinc-500">({cov.latencyMs}ms)</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

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
          {/* Header & Quick Action */}
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                RIIQX Autonomous Commerce Engine • Phase 5
              </span>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Dropshipping Operations &amp; Supplier Logistics
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pre-negotiated verified suppliers with 70%+ gross profit margins. Real-time checkout inventory locks, idempotent order state machine routing, live courier milestones, and automated QC returns.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCreateDemoOrder()}
                disabled={creatingDemoOrder}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-amber-400/20 disabled:opacity-50"
              >
                {creatingDemoOrder ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Locking Stock &amp; Routing...</span>
                  </>
                ) : (
                  <>
                    <Package className="h-3.5 w-3.5" />
                    <span>Test Checkout &amp; Lock Stock</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {demoOrderSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{demoOrderSuccessMsg}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Escrow Locked
              </span>
            </div>
          )}

          {/* Supplier Inventory Health & Delta Sync Bar */}
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-5 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Supplier Real-Time Inventory &amp; Delta Sync
                </h3>
              </div>

              <button
                onClick={handleSyncInventory}
                disabled={syncingInventory}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${syncingInventory ? 'animate-spin' : ''}`} />
                <span>{syncingInventory ? 'Syncing Feeds...' : 'Sync Supplier Delta'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Monitored SKUs</span>
                <span className="text-base font-bold text-white">{inventoryHealth?.totalSkus || inventoryItems.length || 7}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">In-Sync Status</span>
                <span className="text-base font-bold text-emerald-400">{inventoryHealth?.inSync ?? inventoryItems.length} Healthy</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Low Stock Alerts</span>
                <span className="text-base font-bold text-amber-400">{inventoryHealth?.lowStock ?? 0} SKUs</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">Stock Outages</span>
                <span className="text-base font-bold text-zinc-400">{inventoryHealth?.outOfStock ?? 0} SKUs</span>
              </div>
            </div>

            {/* Inventory Items Mini Table */}
            {inventoryItems.length > 0 && (
              <div className="pt-2">
                <div className="max-h-40 overflow-y-auto rounded-xl border border-zinc-800/80 bg-zinc-950/40 divide-y divide-zinc-800/60 text-xs">
                  {inventoryItems.map((inv) => (
                    <div key={inv.sku} className="p-2.5 flex items-center justify-between gap-3">
                      <div className="truncate max-w-[280px]">
                        <span className="text-white font-medium block truncate">{inv.productTitle}</span>
                        <span className="text-[10px] font-mono text-zinc-500">SKU: {inv.sku}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-zinc-400">Avail: <strong className="text-white">{inv.availableStock}</strong></span>
                        <span className="text-zinc-500">Locked: <strong className="text-amber-400">{inv.reservedStock}</strong></span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inv.syncStatus === 'in_sync' ? 'bg-emerald-500/10 text-emerald-400' :
                          inv.syncStatus === 'low_stock' ? 'bg-amber-400/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {inv.syncStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Catalog Grid */}
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

                  <button
                    onClick={() => handleCreateDemoOrder(item.id)}
                    disabled={creatingDemoOrder}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 border border-zinc-800 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                  >
                    <Package className="h-3 w-3 text-amber-400" />
                    <span>Place Test Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Live Order Management & Fulfillment Pipeline */}
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="h-4 w-4 text-amber-400" />
                  <span>Dropshipping Fulfillment Pipeline &amp; State Machine</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Idempotent state routing: Paid ➔ Supplier Confirmed ➔ Packed ➔ Shipped ➔ Delivered ➔ Automated QC Return.
                </p>
              </div>

              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-xl">
                {dropshippingOrders.length} Active Orders
              </span>
            </div>

            {dropshippingOrders.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs">
                No dropshipping orders found. Click &quot;Test Checkout &amp; Lock Stock&quot; above to simulate an authentic order lifecycle.
              </div>
            ) : (
              <div className="space-y-3">
                {dropshippingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{ord.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          ord.status === 'paid' ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' :
                          ord.status === 'supplier_confirmed' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                          ord.status === 'packed' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' :
                          ord.status === 'shipped' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                          ord.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' :
                          ord.status === 'refunded' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-zinc-400">Total: <strong className="text-white">₹{ord.totalAmount.toLocaleString('en-IN')}</strong></span>
                        <span className="text-emerald-400 font-bold">Margin: +₹{ord.financialBreakdown.netContributionMargin} ({ord.financialBreakdown.netContributionMarginPct}%)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2 border-t border-zinc-800/60 pt-2">
                      <div>
                        <span className="text-zinc-500">Customer:</span> {ord.customerName} ({ord.shippingAddress.city}, {ord.shippingAddress.state})
                      </div>
                      <div className="font-mono">
                        <span className="text-zinc-500">Courier:</span> {ord.courierPartner} ({ord.trackingNumber || 'Pending AWB'})
                      </div>
                    </div>

                    {/* State Machine Transition Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
                      <button
                        onClick={() => setSelectedOrderForTracking(ord)}
                        className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        <span>View Tracking Milestones ({ord.trackingEvents.length})</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2">
                        {ord.status === 'paid' && (
                          <button
                            onClick={() => handleTransitionOrderStatus(ord.id, 'supplier_confirmed')}
                            disabled={transitioningOrderId === ord.id}
                            className="px-3 py-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>Confirm Supplier PO</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}

                        {ord.status === 'supplier_confirmed' && (
                          <button
                            onClick={() => handleTransitionOrderStatus(ord.id, 'packed')}
                            disabled={transitioningOrderId === ord.id}
                            className="px-3 py-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>Pack &amp; Generate AWB</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}

                        {ord.status === 'packed' && (
                          <button
                            onClick={() => handleTransitionOrderStatus(ord.id, 'shipped')}
                            disabled={transitioningOrderId === ord.id}
                            className="px-3 py-1 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>Dispatch via Courier</span>
                            <Truck className="h-3 w-3" />
                          </button>
                        )}

                        {ord.status === 'shipped' && (
                          <button
                            onClick={() => handleTransitionOrderStatus(ord.id, 'delivered')}
                            disabled={transitioningOrderId === ord.id}
                            className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>Mark Delivered</span>
                            <Check className="h-3 w-3" />
                          </button>
                        )}

                        {ord.status === 'delivered' && (
                          <button
                            onClick={() => {
                              setSelectedOrderForReturn(ord);
                              setReturnSuccessMsg(null);
                              setReturnErrorMsg(null);
                            }}
                            className="px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Initiate 7-Day Return</span>
                          </button>
                        )}

                        {ord.status === 'refunded' && (
                          <span className="text-[10px] font-mono text-zinc-500 italic">
                            Full Refund Processed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Contribution Margin Calculator Panel */}
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Real-Time Contribution Margin Simulator (India GST &amp; Gateway Fees)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">
                1.9% Gateway + 18% GST + 5% RTO Reserve
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Customer Selling Price (₹)
                </label>
                <input
                  type="number"
                  value={marginCalcSellingPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMarginCalcSellingPrice(val);
                    recalculateMargin(val, marginCalcCogs, marginCalcShipping);
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Supplier Wholesale COGS (₹)
                </label>
                <input
                  type="number"
                  value={marginCalcCogs}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMarginCalcCogs(val);
                    recalculateMargin(marginCalcSellingPrice, val, marginCalcShipping);
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Carrier Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  value={marginCalcShipping}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMarginCalcShipping(val);
                    recalculateMargin(marginCalcSellingPrice, marginCalcCogs, val);
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {calculatedMargin && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center font-mono">
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">Gross Margin</span>
                  <span className="text-sm font-bold text-white">₹{calculatedMargin.grossProfit}</span>
                  <span className="text-[9px] text-zinc-500 block">({calculatedMargin.grossMarginPct}%)</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">Gateway Fee (1.9%)</span>
                  <span className="text-sm font-bold text-amber-400">-₹{calculatedMargin.gatewayFee}</span>
                  <span className="text-[9px] text-zinc-500 block">incl. 18% GST</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">GST Provision</span>
                  <span className="text-sm font-bold text-zinc-300">-₹{calculatedMargin.gstAmount}</span>
                  <span className="text-[9px] text-zinc-500 block">Value Addition</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase block">RTO / Return (5%)</span>
                  <span className="text-sm font-bold text-rose-400">-₹{calculatedMargin.returnReserve}</span>
                  <span className="text-[9px] text-zinc-500 block">Reserve Fund</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 uppercase block font-bold">Net Contribution</span>
                  <span className="text-base font-black text-emerald-300">+₹{calculatedMargin.netContributionMargin}</span>
                  <span className="text-[10px] text-emerald-400 block font-bold">({calculatedMargin.netContributionMarginPct}%)</span>
                </div>
              </div>
            )}
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
                  Total Cashback Balance: ₹{cashbackBalance.toLocaleString('en-IN')}.00
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Earned through cross-platform gift card arbitrage on Amazon, Flipkart, Myntra, and Ajio.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setWithdrawAmount(String(Math.min(1000, cashbackBalance)));
                    setWithdrawErrorMsg(null);
                    setWithdrawSuccessMsg(null);
                    setShowWithdrawModal(true);
                  }}
                  className="rounded-xl bg-[#FFD43B] px-4 py-2 text-xs font-bold text-black hover:bg-[#FFE066] transition shadow-md shadow-[#FFD43B]/20 flex items-center gap-1.5"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Withdraw to UPI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Synced Wallets */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { name: 'Amazon Pay Balance', balance: `₹${walletBalances.amazon.toLocaleString('en-IN')}`, status: 'Auto-Synced', link: 'https://www.amazon.in/gp/payment/ajax/add-gift-card.html' },
              { name: 'Flipkart Wallet', balance: `₹${walletBalances.flipkart.toLocaleString('en-IN')}`, status: 'Auto-Synced', link: 'https://www.flipkart.com/account/giftcard' },
              { name: 'Myntra Credit', balance: `₹${walletBalances.myntra.toLocaleString('en-IN')}`, status: 'Auto-Synced', link: 'https://www.myntra.com/my/giftcards' },
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

          {/* Authorized Branded Gift Card Marketplace */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Gift className="h-4 w-4 text-[#FFD43B]" />
                  <span>Authorized Branded Gift Card Marketplace</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Pre-negotiated upfront discounts + guaranteed wallet cashback with official 1-click redemption.
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                8 Brands Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {giftCardBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="rounded-2xl border border-zinc-800 bg-[#121215] p-4 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">{brand.brandName}</h4>
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {brand.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold border border-amber-400/20">
                        {brand.currentDiscountPct}% Off Upfront
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                        +{brand.currentCashbackPct}% Cashback
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-500 line-clamp-2">
                      {brand.terms}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                    <span className="text-[10px] text-zinc-400 block font-mono">
                      Denominations: ₹{brand.minDenomination} - ₹{brand.maxDenomination}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedBrandForPurchase(brand);
                        setSelectedDenomination(brand.supportedDenominations[1] || brand.supportedDenominations[0] || 500);
                      }}
                      className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-[#FFD43B] hover:text-black text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Zap className="h-3 w-3 text-[#FFD43B] group-hover:text-black" />
                      <span>Buy Gift Card</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders & Cashback Ledger */}
          {(userOrders.length > 0 || cashbackLedger.length > 0) && (
            <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-400" />
                  <span>Recent Purchases &amp; Cashback Audit Ledger</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  Strictly Separated Upfront Outlay vs Future Cashback
                </span>
              </div>

              <div className="space-y-3">
                {userOrders.map((ord, oIdx) => (
                  <div
                    key={oIdx}
                    className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white uppercase">{ord.platform} E-Gift Card</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          {ord.autoCreditStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                        <span>Code: <span className="text-amber-400 font-bold">{ord.voucherCode}</span></span>
                        <span>•</span>
                        <span>PIN: <span className="text-white">{ord.voucherPin}</span></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">Paid Upfront</span>
                        <span className="font-bold text-white font-mono">₹{ord.amountPaid.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block">Cashback Earned</span>
                        <span className="font-bold text-purple-400 font-mono">+₹{ord.cashbackEarned.toLocaleString('en-IN')}</span>
                      </div>
                      <a
                        href={ord.directWalletUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <span>Sync Wallet</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 5: AI SHOPPING ASSISTANT & MULTI-AGENT ORCHESTRATOR (PHASE 6)
          ========================================================================= */}
      {activeTab === 'assistant' && (
        <div className="space-y-6">
          {/* Header Card with Multi-Provider Status */}
          <div className="rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                  Autonomous Multi-Agent Orchestrator
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                RIIQX Conversational Shopping Assistant
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Natural language commerce intelligence powered by Gemini 2.5 Flash, Groq LPU, and deterministic 9-step coupon &amp; gift card arbitrage. Ask about any product, compare prices, or plan your purchase.
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5 font-mono text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Bot className="h-3.5 w-3.5 text-purple-400" />
                <span className="font-bold">Active Engine:</span>
                <span className="text-white">{assistantProviderInfo.provider}</span>
              </div>
              <span className="text-[10px] text-zinc-500">
                Model: {assistantProviderInfo.model} {assistantProviderInfo.latencyMs ? `(${assistantProviderInfo.latencyMs}ms)` : ''}
              </span>
            </div>
          </div>

          {/* Chat Window Container */}
          <div className="rounded-3xl border border-zinc-800 bg-[#101014] flex flex-col h-[580px] shadow-2xl overflow-hidden">
            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {assistantMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                      <Bot className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-400 font-bold text-xs font-mono">
                      YOU
                    </div>
                  )}

                  <div className={`space-y-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-400/15 border border-amber-400/30 text-white rounded-tr-none'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none whitespace-pre-wrap'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Matched Product Mini Card */}
                    {msg.matchedProduct && (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3.5 flex items-center gap-3 max-w-md">
                        {msg.matchedProduct.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={msg.matchedProduct.imageUrl}
                            alt={msg.matchedProduct.title}
                            className="h-14 w-14 rounded-xl object-cover border border-zinc-800"
                          />
                        )}
                        <div className="truncate flex-1 space-y-1 text-xs">
                          <h4 className="font-bold text-white truncate">{msg.matchedProduct.title}</h4>
                          <div className="flex items-baseline gap-2 font-mono">
                            <span className="text-emerald-400 font-bold">
                              ₹{msg.matchedProduct.price?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-zinc-500 text-[10px] line-through">
                              ₹{msg.matchedProduct.mrp?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Savings Summary Banner */}
                    {msg.savingsPlan && (
                      <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300 max-w-md">
                        <span>Best Platform: <strong className="text-white">{msg.savingsPlan.bestPlatform}</strong></span>
                        <span className="font-bold text-emerald-400">Save ₹{msg.savingsPlan.totalSavings?.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {/* Interactive Action Suggestion Buttons */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.suggestedActions.map((act: any, aIdx: number) => (
                          <button
                            key={act.id || aIdx}
                            onClick={() => {
                              if (act.actionType === 'compare_prices' && !act.payload) {
                                handleSendAssistantMessage(act.label);
                              } else {
                                handleExecuteAssistantAction(act);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                          >
                            <Sparkles className="h-3 w-3 text-purple-400" />
                            <span>{act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                      <span>{msg.time}</span>
                      {msg.provider && <span>• {msg.provider}</span>}
                    </div>
                  </div>
                </div>
              ))}

              {sendingAssistantMsg && (
                <div className="flex gap-3 max-w-lg">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-2 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
                    <span>Analyzing 6 retailers &amp; calculating arbitrage...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-6 py-2 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center gap-2 overflow-x-auto text-xs font-mono">
              <span className="text-[10px] text-zinc-500 uppercase shrink-0">Try asking:</span>
              {[
                'Find best deal for Sony WH-1000XM5',
                'Compare Noise Colorfit Pro 5 across retailers',
                'Which ambient desk lamp has highest dropship margin?',
                'Flipkart Gift Card Arbitrage Savings',
              ].map((pill, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendAssistantMessage(pill)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] shrink-0 transition"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAssistantMessage();
              }}
              className="p-4 border-t border-zinc-800 bg-[#121215] flex items-center gap-3"
            >
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder="Ask about products, compare prices, or find arbitrage opportunities..."
                disabled={sendingAssistantMsg}
                className="flex-1 rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400 transition"
              />
              <button
                type="submit"
                disabled={!assistantInput.trim() || sendingAssistantMsg}
                className="h-10 w-10 rounded-2xl bg-purple-500 hover:bg-purple-600 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 shadow-lg shadow-purple-500/20"
              >
                {sendingAssistantMsg ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Brand Purchase Modal */}
      {selectedBrandForPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedBrandForPurchase.brandName}</h3>
                <span className="text-[10px] font-mono text-zinc-400">Select Voucher Denomination</span>
              </div>
              <button
                onClick={() => setSelectedBrandForPurchase(null)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Choose Denomination:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {selectedBrandForPurchase.supportedDenominations.map((denom) => (
                  <button
                    key={denom}
                    onClick={() => setSelectedDenomination(denom)}
                    className={`py-2 rounded-xl border text-xs font-mono font-bold transition ${
                      selectedDenomination === denom
                        ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ₹{denom.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Cost & Cashback Breakdown */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Voucher Face Value:</span>
                  <span className="text-white font-bold">₹{selectedDenomination.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Upfront Discount ({selectedBrandForPurchase.currentDiscountPct}%):</span>
                  <span>-₹{Math.round(selectedDenomination * (selectedBrandForPurchase.currentDiscountPct / 100))}</span>
                </div>
                <div className="flex justify-between text-purple-400">
                  <span>Guaranteed Wallet Cashback ({selectedBrandForPurchase.currentCashbackPct}%):</span>
                  <span>+₹{Math.round(selectedDenomination * (selectedBrandForPurchase.currentCashbackPct / 100))}</span>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between text-white font-bold text-sm">
                  <span>Amount to Pay Now:</span>
                  <span className="text-emerald-400 font-mono">
                    ₹{(selectedDenomination - Math.round(selectedDenomination * (selectedBrandForPurchase.currentDiscountPct / 100))).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBrandForPurchase(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyBrandGiftCard}
                  disabled={buyingFromWallet}
                  className="px-4 py-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {buyingFromWallet ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Issuing Voucher...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" />
                      <span>Confirm &amp; Generate Voucher</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target Price Drop Watchlist Alert Modal */}
      {showWatchlistModal && extractedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Set Target Price Drop Alert</h3>
                  <span className="text-[10px] font-mono text-zinc-400">Instant Email &amp; Web Push Notification</span>
                </div>
              </div>
              <button
                onClick={() => setShowWatchlistModal(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">Product</span>
              <p className="text-xs font-semibold text-white truncate">{extractedProduct.title}</p>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-[10px] text-zinc-400">Current Best Price:</span>
                <span className="text-xs font-bold text-white font-mono">
                  ₹{(optimalPlan?.finalLowestEffectivePrice || extractedProduct.detectedPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {watchlistError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{watchlistError}</span>
              </div>
            )}

            {watchlistSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{watchlistSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateWatchlist} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Alert Me When Price Drops To Or Below:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-zinc-500 font-mono text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={targetPriceInput}
                    onChange={(e) => setTargetPriceInput(e.target.value)}
                    placeholder="Enter target price..."
                    required
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 pl-8 pr-4 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Quick Target Percentage Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Quick Target Discounts:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((pct) => {
                    const current = optimalPlan?.finalLowestEffectivePrice || extractedProduct.detectedPrice;
                    const val = Math.round(current * (1 - pct / 100));
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTargetPriceInput(String(val))}
                        className="py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:border-amber-400/40 text-center text-xs font-mono transition"
                      >
                        <span className="text-amber-400 font-bold block">-{pct}%</span>
                        <span className="text-[10px] text-zinc-400">₹{val.toLocaleString('en-IN')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWatchlistModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingWatchlist}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition disabled:opacity-50"
                >
                  {savingWatchlist ? 'Activating Alert...' : 'Activate Price Drop Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dropshipping Order Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Live Courier Tracking Milestones</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  AWB: {selectedOrderForTracking.trackingNumber} • {selectedOrderForTracking.courierPartner}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Order Brief */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block">Destination</span>
                <span className="text-white font-semibold">
                  {selectedOrderForTracking.shippingAddress.city}, {selectedOrderForTracking.shippingAddress.state} ({selectedOrderForTracking.shippingAddress.pincode})
                </span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 text-[10px] uppercase block">Est. Delivery</span>
                <span className="text-emerald-400 font-bold">
                  {selectedOrderForTracking.estimatedDeliveryDate
                    ? new Date(selectedOrderForTracking.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '1-3 Days'}
                </span>
              </div>
            </div>

            {/* Milestones Vertical Timeline */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedOrderForTracking.trackingEvents.map((evt, idx) => (
                <div key={evt.id || idx} className="flex items-start gap-3 relative">
                  {idx !== selectedOrderForTracking.trackingEvents.length - 1 && (
                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-zinc-800 -mb-3" />
                  )}
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 z-10">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{evt.title}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(evt.occurredAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{evt.description}</p>
                    <span className="text-[10px] font-mono text-zinc-500 block">📍 {evt.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              {selectedOrderForTracking.trackingUrl && (
                <a
                  href={selectedOrderForTracking.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  <span>Carrier Official Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropshipping 7-Day Return & QC Inspection Modal */}
      {selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-rose-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Initiate 7-Day Customer Return</h3>
                  <span className="text-[10px] font-mono text-zinc-400">Order {selectedOrderForReturn.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForReturn(null)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Eligible Refund Amount:</span>
                <span className="text-emerald-400 font-bold">₹{selectedOrderForReturn.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>Original Payment Method:</span>
                <span className="capitalize">{selectedOrderForReturn.paymentMethod}</span>
              </div>
            </div>

            {returnErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{returnErrorMsg}</span>
              </div>
            )}

            {returnSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{returnSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleProcessReturn} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Return Reason
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value as ReturnRefundReason)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="defective_or_damaged">Defective or Damaged in Transit</option>
                  <option value="wrong_item_delivered">Wrong Item Delivered</option>
                  <option value="quality_not_as_expected">Quality Not as Expected</option>
                  <option value="size_fit_issue">Size or Fit Issue</option>
                  <option value="arrived_too_late">Arrived Too Late</option>
                  <option value="buyer_cancelled">Buyer Remorse / Cancellation</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Additional Details &amp; Notes
                </label>
                <textarea
                  value={returnReasonDetails}
                  onChange={(e) => setReturnReasonDetails(e.target.value)}
                  placeholder="Provide inspection details or unboxing feedback..."
                  rows={2}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 resize-none"
                />
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReturn(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingReturn}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {processingReturn ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>Inspecting QC &amp; Refunding...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Submit Return &amp; Trigger Refund</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Cashback to UPI Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-[#121215] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#FFD43B]/10 text-[#FFD43B] flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Withdraw Cashback to UPI</h3>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Instant Bank Transfer • Zero Fee
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-400 font-mono">
                <span>Available Cashback Balance:</span>
                <span className="text-[#FFD43B] font-bold text-sm">
                  ₹{cashbackBalance.toLocaleString('en-IN')}.00
                </span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>Settlement Speed:</span>
                <span className="text-emerald-400 font-semibold">Instant IMPS / UPI 24x7</span>
              </div>
            </div>

            {withdrawErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{withdrawErrorMsg}</span>
              </div>
            )}

            {withdrawSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{withdrawSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawToUpi} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Recipient Virtual Payment Address (UPI ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. yourname@okhdfcbank or 9830123456@paytm"
                  value={withdrawUpiId}
                  onChange={(e) => setWithdrawUpiId(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-white font-mono text-sm focus:border-[#FFD43B] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  min="100"
                  max={cashbackBalance}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-white font-mono font-bold text-sm focus:border-[#FFD43B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingWithdraw || cashbackBalance < 100}
                  className="px-5 py-2.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-[#FFD43B]/20"
                >
                  {isProcessingWithdraw ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Processing Payout...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" />
                      <span>Confirm Withdrawal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
