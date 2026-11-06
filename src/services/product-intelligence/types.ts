// =============================================================================
// RIIQX — Real Product Intelligence & Verification Engine Types
// "Know your needs. Make smarter moves."
// Zero Simulation • Verifiable Sources • True Final Price • Strict Evidence
// =============================================================================

export type VerificationStatus =
  | 'live_verified'                 // Directly extracted from live JSON-LD Schema or confirmed merchant feed
  | 'provider_reported'              // Reported by authorized search provider / catalog feed with timestamp
  | 'extracted_from_image'          // Read from screenshot via OCR (labeled: price at time of capture)
  | 'partially_verified'            // Base price verified, but shipping or fees unconfirmed
  | 'link_verified_price_pending'   // Official canonical retailer product link verified, live price pending merchant visit
  | 'unverified'                    // Discovered link, but identity or stock cannot be confirmed
  | 'unavailable';                  // Out of stock or delisted

export type VariantMatchStatus =
  | 'exact'                         // Identical model, storage, color, and specifications
  | 'similar_alternative'           // Same product family but different spec/storage/generation
  | 'unverified';

export interface ProductIdentity {
  brand: string;
  title: string;
  model?: string;
  category: string;
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

export interface RetailerOffer {
  id: string;
  retailerName: string;
  retailerDomain: string;
  sellerName?: string;
  productUrl: string;
  canonicalUrl: string;
  listedPrice?: number;
  mrp?: number;
  sellingPrice?: number;
  deliveryCharge?: number;
  deliveryStatus: 'free' | 'charged' | 'unknown';
  deliveryDays?: number;
  inStock?: boolean;
  mandatoryFees: number;
  finalComparablePrice?: number;
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
}

export interface PurchaseAnalysisReport {
  sessionId: string;
  identity: ProductIdentity;
  offers: RetailerOffer[];
  cheapestVerifiedOffer?: RetailerOffer;
  priceTruth: {
    lowestVerifiedPrice?: number;
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
