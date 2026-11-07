// =============================================================================
// RIIQX — Real Product Intelligence & Verification Engine Types
// "Know your needs. Make smarter moves."
// Zero Simulation • Direct Buying Links • True Lowest Final Price • Strict Evidence
// =============================================================================

export type VerificationStatus =
  | 'live_verified'                 // Directly extracted from live JSON-LD Schema or confirmed merchant feed
  | 'provider_reported'              // Reported by authorized search provider / catalog feed with timestamp
  | 'extracted_from_image'          // Read from screenshot via OCR (labeled: price at time of capture)
  | 'partially_verified'            // Base price verified, but shipping or fees unconfirmed
  | 'link_verified_price_pending'   // Official canonical retailer product link verified, live price pending merchant visit
  | 'unverified'                    // Discovered link, but identity or stock cannot be confirmed
  | 'unavailable';                  // Out of stock or delisted

export type LinkVerificationStatus =
  | 'verified_pdp'                  // Exact product detail page (PDP) verified
  | 'direct_link_unverified'        // Domain valid, but link is search/category or unconfirmed PDP
  | 'redirect_unconfirmed'          // Permitted redirect followed, destination unverified
  | 'broken_or_inaccessible';       // Target unreachable or 404

export type VariantMatchStatus =
  | 'exact'                         // Identical model, storage, color, and specifications
  | 'variant_differs'               // Same model family, different storage/color/size
  | 'similar_alternative'           // Alternative product family
  | 'refurbished'                   // Refurbished, renewed, or open-box
  | 'bundle'                        // Multi-pack or accessory bundle
  | 'unverified';

export type OfferVerificationStatus =
  | 'verified_applicable'           // Verified active and applies directly
  | 'verified_eligibility_required' // Verified active, requires specific bank/card/coupon
  | 'provider_reported_unconfirmed' // Reported by partner/catalog, pending independent check
  | 'expired'                       // Past valid until timestamp
  | 'not_applicable'                // Cart/order does not meet minimum order or category criteria
  | 'unable_to_verify';             // Terms could not be independently audited

export type OfferType =
  | 'bank_card'                     // Credit/debit card instant discount
  | 'payment_method'                // UPI / wallet discount
  | 'store_coupon'                  // Promo / coupon code
  | 'gift_card'                     // Store gift card redemption
  | 'cashback'                      // Conditional post-purchase cashback
  | 'membership_perk'               // Prime, Plus, NeuPass, etc.
  | 'exchange_or_loyalty';          // Exchange or reward points

export interface ProductIdentity {
  brand: string;
  title: string;
  model?: string;
  modelNumber?: string;
  gtinEanUpc?: string;
  category: string;
  condition?: 'new' | 'refurbished' | 'open_box';
  packQuantity?: number;
  imageUrl?: string;
  canonicalIdentifier?: string;
  variantAttributes: {
    storage?: string;
    color?: string;
    size?: string;
    generation?: string;
    edition?: string;
  };
  specifications: string[];
  identityConfidence: number; // 0.000 to 1.000
  verificationSource: string;
  rawInputType: 'url' | 'screenshot' | 'query' | 'hybrid';
}

export interface PromotionalOffer {
  id: string;
  retailerId: string;
  retailerName: string;
  offerName: string;
  offerType: OfferType;
  couponCode?: string;
  bankName?: string;                 // e.g. "HDFC Bank", "ICICI Bank", "SBI Card", "Axis Bank"
  cardCategory?: 'credit' | 'debit' | 'emi';
  paymentMethod?: 'upi' | 'wallet' | 'card' | 'netbanking';
  discountType: 'percentage' | 'flat' | 'free_shipping';
  discountValue: number;            // Percentage (e.g. 10 for 10%) or Flat Rupee amount
  minTransaction: number;           // Minimum cart value in INR
  maxDiscountCap?: number;          // Maximum discount ceiling in INR
  isInstantDiscount: boolean;       // Reduces checkout cash payable directly
  isCashback: boolean;              // Credited post-purchase (NEVER treated as instant discount)
  isStackable: boolean;             // Can combine with store coupon or other offers
  stackingRules?: string;
  termsUrl?: string;
  verificationStatus: OfferVerificationStatus;
  eligibilityDescription: string;
  validUntil?: string;
  lastCheckedAt: string;
}

export interface UserShoppingPreferences {
  userId: string;
  preferredBanks: string[];         // e.g. ["HDFC Bank", "ICICI Bank", "SBI Card", "Axis Bank"]
  preferredCardTypes: ('credit' | 'debit' | 'emi')[];
  preferredPaymentMethods: ('upi' | 'wallet' | 'card' | 'netbanking')[];
  memberships: string[];            // e.g. ["Amazon Prime", "Flipkart Plus", "Tata NeuPass"]
  giftCardBalances?: {
    retailer: string;
    balance: number;
  }[];
  updatedAt?: string;
}

export interface PriceCalculationScenario {
  scenarioName: 'standard' | 'eligible_instant' | 'bank_card' | 'coupon_and_bank' | 'gift_card' | 'cashback';
  scenarioLabel: string;
  sellingPrice: number;
  deliveryCharge: number;
  mandatoryFees: number;
  standardPayablePrice: number;     // Selling price + delivery + fees
  instantDiscount: number;          // Verified direct discount
  bankDiscount: number;             // Applied bank/card instant discount
  couponDiscount: number;           // Applied promo coupon discount
  appliedGiftCardValue: number;     // Value deducted from owned gift card (tracked separately)
  finalCashPayable: number;         // EXACT RUPEES REQUIRED TO PAY AT CHECKOUT
  expectedCashback: number;         // Cashback to be received later (NOT deducted from cash payable)
  effectiveCostAfterCashback: number; // Final Cash Payable - Expected Cashback
  appliedOffers: PromotionalOffer[];
  isEstimatedRequiringCheckout: boolean;
  calculationEvidence: string[];
}

export interface RetailerOffer {
  id: string;
  retailerName: string;
  retailerDomain: string;
  sellerName?: string;
  productUrl: string;               // Direct purchase / PDP URL
  canonicalUrl: string;             // Normalized canonical URL
  purchaseUrl: string;              // Verified click destination for BUY FROM STORE
  directLinkVerified: boolean;      // True if direct PDP verified; false if search/unconfirmed
  linkVerificationStatus: LinkVerificationStatus;
  accessRestrictions?: string[];    // e.g. ['requires_app', 'pincode_dependent']
  imageUrl?: string;
  listedPrice?: number;
  mrp?: number;
  sellingPrice?: number;
  deliveryCharge?: number;
  deliveryStatus: 'free' | 'charged' | 'unknown';
  deliveryDays?: number;
  inStock?: boolean;
  mandatoryFees: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'pre_order' | 'unknown';
  variantMatchStatus: VariantMatchStatus;
  verificationStatus: VerificationStatus;
  priceVerificationStatus?: VerificationStatus;
  verificationMethod: string;
  priceBreakdown?: string;
  lastCheckedAt: string;
  sourceEvidence?: Record<string, unknown>;
  badge?: string;
  isCheapestVerified?: boolean;

  // Multi-scenario calculations
  pricingScenarios?: {
    standard: PriceCalculationScenario;
    eligibleFinal?: PriceCalculationScenario;
    bestConditional?: PriceCalculationScenario;
  };
  finalComparablePrice?: number;    // Standard payable price
  eligibleFinalPrice?: number;      // User-specific eligible payable price
  conditionalBestPrice?: number;    // Best conditional price across all banks/promotions
}

export interface PriceRankings {
  rankingStandard: RetailerOffer[];       // Sorted strictly by lowest verified standard payable price
  rankingEligible: RetailerOffer[];       // Sorted strictly by lowest eligible final price (user preferences)
  rankingConditional: RetailerOffer[];    // Sorted strictly by lowest conditional price (all potential offers)
}

export interface PurchaseAnalysisReport {
  sessionId: string;
  identity: ProductIdentity;
  offers: RetailerOffer[];
  rankings: PriceRankings;
  cheapestStandardOffer?: RetailerOffer;
  cheapestEligibleOffer?: RetailerOffer;
  cheapestConditionalOffer?: RetailerOffer;
  availablePromotionalOffers: PromotionalOffer[];
  userPreferencesApplied?: UserShoppingPreferences;
  priceTruth: {
    lowestStandardPrice?: number;
    lowestEligiblePrice?: number;
    lowestConditionalPrice?: number;
    highestVerifiedPrice?: number;
    maxVerifiedSavings?: number;
    hasUnknownFees: boolean;
    calculationExplanation: string;
  };
  aiAnalysis: {
    verdict: 'strong_buy' | 'consider_alternative' | 'wait_for_drop' | 'caution';
    headline: string;
    summary: string;
    pros: string[];
    cons: string[];
    whatPlatformsHide: string[];
    isDiscountGenuine: boolean;
    discountEvidence: string;
    recommendationConfidence: number;
  };
  similarAlternatives?: {
    name: string;
    difference: string;
    targetPrice?: number;
  }[];
  timestamp: string;
}

// =============================================================================
// Deceptive Fee & Dark Pattern Deflector Types
// =============================================================================

export type DarkPatternCategory =
  | 'pre_ticked_opt_in'      // Charity donation, green delivery, tips
  | 'convenience_fee'        // Platform charge, internet handling, booking fee
  | 'fake_insurance'         // Redundant transit cover, device warranty, cancellation shield
  | 'hidden_surcharge'       // Payment gateway surcharge, packaging fee
  | 'artificial_urgency'     // Fake countdown timers, false low-stock banners
  | 'cancellation_trap';     // Paid opt-out for standard consumer refund rights

export type DeceptiveSeverity = 'high' | 'medium' | 'low';

export interface DeceptiveFeeItem {
  id: string;
  name: string;
  amount: number;
  category: DarkPatternCategory;
  severity: DeceptiveSeverity;
  isRemovable: boolean;
  actionableStep: string;
  evidence: string;
}

export interface DeceptiveFeeAuditResult {
  auditId: string;
  merchantName: string;
  pageType: 'checkout_summary' | 'cart_review' | 'payment_selection' | 'product_pdp' | 'general';
  publishedTotal: number;
  baseItemSubtotal: number;
  mandatoryCharges: number;
  removableSurchargesTotal: number;
  honestPayablePrice: number;
  potentialInstantSavings: number;
  truthScore: number; // 0 (Most deceitful) to 100 (100% Honest & Transparent)
  deceptiveItems: DeceptiveFeeItem[];
  stepByStepUncheckGuide: string[];
  honestCheckoutVerdict: 'severe_dark_patterns' | 'moderate_traps' | 'transparent_checkout';
  summary: string;
  timestamp: string;
}

// =============================================================================
// Hyperlocal Online vs Offline Store Arbitrage Types (Phase 3)
// =============================================================================

export type PhysicalStoreChain =
  | 'Croma'
  | 'Reliance Digital'
  | 'Vijay Sales'
  | 'Apple Premium Reseller'
  | 'Samsung Smart Cafe'
  | 'Local Authorized Tech Store';

export interface PhysicalStoreLocation {
  storeId: string;
  chainName: PhysicalStoreChain;
  branchName: string;
  address: string;
  pincode: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  drivingMinutes: number;
  phone?: string;
  inStock: boolean;
  stockLevel: 'high_stock' | 'low_stock' | 'last_units' | 'call_to_check';
  storePrice: number;
  posTerminalCashback: {
    bankName: string;
    instantCashbackRupees: number;
    terminalProvider: 'PineLabs' | 'Innoviti' | 'Paytm POS';
    cardType: 'credit' | 'debit';
  }[];
  managerDiscountPotentialRupees: number;
  netInStorePayablePrice: number;
  openBoxAlternativeAvailable?: boolean;
  openBoxPriceRupees?: number;
  directionsUrl: string;
  badge?: string;
}

export interface HyperlocalArbitrageReport {
  arbitrageId: string;
  productTitle: string;
  userPincode: string;
  userCity: string;
  userCoordinates: { lat: number; lng: number };
  searchRadiusKm: number;
  onlineLowestDeliveredPrice: number;
  onlineLowestRetailer: string;
  onlineDeliveryDays: number;
  offlineStores: PhysicalStoreLocation[];
  bestOfflineOffer?: PhysicalStoreLocation;
  arbitrageVerdict: 'offline_wins_cheaper' | 'offline_wins_faster' | 'online_wins_cheaper' | 'parity';
  savingsAmountRupees: number;
  pickupTimeAdvantageHours: number;
  recommendationReason: string;
  cartoBasemapUrl: string;
  timestamp: string;
}


