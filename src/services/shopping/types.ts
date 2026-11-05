// =============================================================================
// GlowFit AI / RIIQX — Smart Shopping & Dropshipping Intelligence Engine
// Cross-Platform Arbitrage • Screenshot OCR • Multi-Tier Gift Card Optimization
// =============================================================================

export type ShoppingPlatform =
  | 'amazon'
  | 'flipkart'
  | 'myntra'
  | 'ajio'
  | 'meesho'
  | 'tatacliq'
  | 'nykaa';

export interface ProductAnalysisRequest {
  url?: string;
  screenshotBase64?: string;
  screenshotMimeType?: string;
  productNameHint?: string;
}

export interface ExtractedProductInfo {
  title: string;
  brand: string;
  modelOrVariant?: string;
  category: 'electronics' | 'fashion' | 'beauty' | 'home' | 'fitness' | 'gadgets';
  detectedPlatform: ShoppingPlatform | 'unknown';
  detectedPrice: number;
  originalMrp: number;
  detectedDiscountPct: number;
  currency: 'INR' | 'USD';
  imageUrl?: string;
  confidenceScore: number;
  extractedFeatures: string[];
}

export interface PlatformPriceDetail {
  platform: ShoppingPlatform;
  displayName: string;
  platformIconUrl?: string;
  productUrl: string;
  listedPrice: number;
  mrp: number;
  discountPct: number;
  inStock: boolean;
  deliveryDays: number;
  deliveryCost: number;
  sellerName: string;
  sellerRating: number;
  applicableCoupons: {
    code: string;
    discountAmount: number;
    description: string;
  }[];
  bankOffers: {
    bank: string;
    discountAmount: number;
    description: string;
  }[];
  giftCardRate: {
    available: boolean;
    discountRatePct: number;
    cashbackRatePct: number;
    provider: string;
  };
  totalDirectSavings: number;
  finalEffectivePrice: number;
  isCheapest: boolean;
}

export interface ArbitrageOptimizationPlan {
  productId: string;
  productTitle: string;
  originalPrice: number;
  recommendedPlatform: ShoppingPlatform;
  recommendedPlatformName: string;
  baseListedPrice: number;
  appliedCoupon?: {
    code: string;
    savings: number;
  };
  appliedBankOffer?: {
    bank: string;
    savings: number;
  };
  giftCardArbitrage: {
    recommendedGiftCardBrand: string;
    giftCardAmountRequired: number;
    giftCardDiscountPct: number;
    giftCardImmediateSavings: number;
    cashbackEarned: number;
    netGiftCardCost: number;
    autoCreditSupported: boolean;
  };
  totalMoneySaved: number;
  finalLowestEffectivePrice: number;
  overallSavingsPct: number;
  stepByStepActionPlan: string[];
}

export interface GiftCardPurchaseRequest {
  userId?: string;
  platform: ShoppingPlatform;
  faceValue: number;
  paymentMethod: 'upi' | 'card' | 'wallet' | 'netbanking';
  autoCreditToShoppingWallet: boolean;
}

export interface GiftCardPurchaseResult {
  success: boolean;
  orderId: string;
  voucherCode: string;
  voucherPin: string;
  platform: ShoppingPlatform;
  faceValue: number;
  amountPaid: number;
  cashbackEarned: number;
  walletCredited: boolean;
  autoCreditStatus: 'credited_instantly' | 'pending_sync' | 'code_generated';
  redemptionInstructions: string;
  directWalletUrl: string;
  timestamp: string;
}

export interface DropshippingProductItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  supplierPrice: number;
  suggestedSellingPrice: number;
  potentialProfitPerUnit: number;
  profitMarginPct: number;
  trendingScore: number; // 0 - 100
  supplierName: string;
  supplierRating: number;
  shippingDays: string;
  readyAdHooks: string[];
  recommendedAngles: string[];
  creatorStudioProjectId?: string;
}

