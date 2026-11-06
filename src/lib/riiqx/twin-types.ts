// =============================================================================
// RIIQX — Personal AI Twin & Intelligence Platform Core Types
// "Know your needs. Make smarter moves."
// Strict Typings • 4-Tier Memory Taxonomy • Price Truth • Decision Engine
// =============================================================================

export type TwinAutonomyLevel = 1 | 2 | 3;
export type TwinTone = 'pragmatic_analytical' | 'warm_supportive' | 'direct_concise';
export type TwinBudgetTier = 'frugal' | 'balanced' | 'premium' | 'luxury';

export interface TwinProfile {
  id: string;
  userId: string;
  twinName: string;
  autonomyLevel: TwinAutonomyLevel;
  tone: TwinTone;
  budgetTier: TwinBudgetTier;
  skinType?: string;
  preferredBrands: string[];
  avoidKeywords: string[];
  notificationFrequency: 'daily' | 'weekly' | 'important_only' | 'off';
  createdAt: string;
  updatedAt: string;
}

export type MemoryCategory = 'brand' | 'budget' | 'food' | 'lifestyle' | 'tech' | 'health' | 'travel' | 'general';
export type MemoryType = 'confirmed_preference' | 'inferred_preference' | 'temporary_context' | 'unverified_assumption';
export type MemorySourceType = 'direct_user_statement' | 'purchase_analysis' | 'user_feedback' | 'inferred_pattern';

export interface TwinMemory {
  id: string;
  userId: string;
  category: MemoryCategory;
  memoryText: string;
  memoryType: MemoryType;
  confidenceScore: number; // 0.000 to 1.000
  sourceType: MemorySourceType;
  verifiedByUser: boolean;
  isActive: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TwinGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'savings' | 'purchase_budget' | 'lifestyle' | 'career' | 'custom';
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionCandidate {
  id: string;
  sessionId: string;
  optionName: string;
  merchant?: string;
  price: number;
  currency: string;
  score: number; // 0 - 100
  pros: string[];
  cons: string[];
  evidence: string[];
  isRecommended: boolean;
  createdAt: string;
}

export interface DecisionSession {
  id: string;
  userId: string;
  objective: string;
  category: 'purchase' | 'subscription' | 'career' | 'travel' | 'food' | 'lifestyle';
  status: 'open' | 'completed' | 'archived';
  constraints: Record<string, unknown>;
  evaluationCriteria: { name: string; weight: number }[];
  summaryVerdict?: string;
  confidenceScore: number;
  tradeOffs?: string;
  candidates: DecisionCandidate[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseAnalysis {
  id: string;
  userId: string;
  productName: string;
  merchant: string;
  productUrl?: string;
  imageUrl?: string;
  inputType: 'url' | 'screenshot' | 'manual' | 'query';
  basePrice: number;
  shippingFee: number;
  taxes: number;
  platformFee: number;
  couponDiscount: number;
  cardDiscount: number;
  conditionalCashback: number;
  totalPayable: number;
  currency: string;
  confidenceScore: number;
  assumptions: string[];
  evidence: string[];
  verdict: string;
  userFeedback?: string;
  createdAt: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  category: 'coupon' | 'deal' | 'cashback' | 'event' | 'learning' | 'lifestyle';
  provider: string;
  sourceUrl: string;
  terms?: string;
  discountType: 'flat' | 'percentage' | 'cashback' | 'free_shipping';
  discountValue: number;
  minimumOrderValue: number;
  startsAt?: string;
  expiresAt?: string;
  verificationStatus: 'verified' | 'unverified' | 'expired';
  lastCheckedAt: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface WeeklyDigestSection {
  title: string;
  summary: string;
  sourceCitations: string[];
  actionLink?: string;
}

export interface WeeklyDigest {
  id: string;
  userId: string;
  weekStartDate: string;
  title: string;
  sections: WeeklyDigestSection[];
  isRead: boolean;
  createdAt: string;
}

export interface RewardAccount {
  id: string;
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarned: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RewardLedgerEntry {
  id: string;
  accountId: string;
  userId: string;
  amount: number;
  currency: string;
  entryType: 'credit' | 'debit';
  status: 'pending' | 'approved' | 'rejected' | 'redeemed';
  sourceType: 'funded_merchant_campaign' | 'referral' | 'brand_feedback' | 'partner_cashback' | 'redemption';
  referenceId?: string;
  description: string;
  proofMetadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerUserId: string;
  refereeUserId?: string;
  referralCode: string;
  status: 'pending_signup' | 'signed_up' | 'verified' | 'disqualified' | 'rewarded';
  rewardAmount: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ActionApproval {
  id: string;
  userId: string;
  actionType: string;
  parameters: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
  explanation: string;
  idempotencyKey?: string;
  approvedAt?: string;
  executedAt?: string;
  createdAt: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: string;
  isGranted: boolean;
  grantedAt: string;
  revokedAt?: string;
}
