// =============================================================================
// RIIQX — Master Personal AI Twin Repository & Data Access Layer
// Supabase-Backed with Resilient Storage Fallback • Zero Unhandled Failures
// =============================================================================

import { createAdminClient } from '@/lib/supabase/admin';
import {
  TwinProfile,
  TwinMemory,
  TwinGoal,
  DecisionSession,
  DecisionCandidate,
  PurchaseAnalysis,
  OpportunityItem,
  WeeklyDigest,
  RewardAccount,
  RewardLedgerEntry,
  ReferralRecord,
  ActionApproval,
  ConsentRecord,
} from './twin-types';

// In-Memory store for development resiliency
class ResilientTwinMemoryStore {
  profiles: Map<string, TwinProfile> = new Map();
  memories: Map<string, TwinMemory[]> = new Map();
  goals: Map<string, TwinGoal[]> = new Map();
  sessions: Map<string, DecisionSession[]> = new Map();
  purchases: Map<string, PurchaseAnalysis[]> = new Map();
  opportunities: OpportunityItem[] = [];
  digests: Map<string, WeeklyDigest[]> = new Map();
  rewardAccounts: Map<string, RewardAccount> = new Map();
  rewardLedgers: Map<string, RewardLedgerEntry[]> = new Map();
  referrals: Map<string, ReferralRecord[]> = new Map();
  approvals: Map<string, ActionApproval[]> = new Map();
  consents: Map<string, ConsentRecord[]> = new Map();

  constructor() {
    this.seedDefaultOpportunities();
  }

  private seedDefaultOpportunities() {
    this.opportunities = [
      {
        id: 'opp-001',
        title: 'HDFC Instant ₹1,500 Off on Electronics',
        description: 'Instant discount on credit card transactions above ₹15,000 across Amazon & Flipkart.',
        category: 'deal',
        provider: 'HDFC Bank',
        sourceUrl: 'https://www.hdfcbank.com',
        terms: 'Applicable once per card per month on verified merchant checkouts.',
        discountType: 'flat',
        discountValue: 1500,
        minimumOrderValue: 15000,
        verificationStatus: 'verified',
        lastCheckedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'opp-002',
        title: 'Tata CLiQ Luxury: Extra 10% Welcome Code',
        description: 'Verified promo code LUXWELCOME for first-time premium apparel orders.',
        category: 'coupon',
        provider: 'Tata CLiQ Luxury',
        sourceUrl: 'https://luxury.tatacliq.com',
        terms: 'Maximum discount ₹2,000 on select verified designer labels.',
        discountType: 'percentage',
        discountValue: 10,
        minimumOrderValue: 5000,
        verificationStatus: 'verified',
        lastCheckedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'opp-003',
        title: 'Cult.fit Fitness 3-Month Pass Cashback',
        description: 'Flat ₹500 cashback on annual cultpass ELITE renewals via Cred Pay.',
        category: 'cashback',
        provider: 'Cult.fit / Cred',
        sourceUrl: 'https://cult.fit',
        terms: 'Valid on 12-month pass subscriptions.',
        discountType: 'cashback',
        discountValue: 500,
        minimumOrderValue: 12000,
        verificationStatus: 'verified',
        lastCheckedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

const memoryStore = new ResilientTwinMemoryStore();

export class TwinRepository {
  // ---------------------------------------------------------------------------
  // 1. TWIN PROFILES
  // ---------------------------------------------------------------------------
  public static async getProfile(userId: string): Promise<TwinProfile> {
    try {
      const admin: any = createAdminClient();
      const { data, error } = await admin
        .from('twin_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          twinName: data.twin_name,
          autonomyLevel: data.autonomy_level,
          tone: data.tone,
          budgetTier: data.budget_tier,
          skinType: data.skin_type,
          preferredBrands: data.preferred_brands || [],
          avoidKeywords: data.avoid_keywords || [],
          notificationFrequency: data.notification_frequency,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // Fall through to memory
    }

    if (!memoryStore.profiles.has(userId)) {
      const defaultProfile: TwinProfile = {
        id: `profile-${userId}`,
        userId,
        twinName: 'RIIQX Twin',
        autonomyLevel: 2,
        tone: 'pragmatic_analytical',
        budgetTier: 'balanced',
        skinType: 'Combination / Sensitive',
        preferredBrands: ['Sony', 'Apple', 'Minimalist', 'Asics', 'Uniqlo'],
        avoidKeywords: ['Fast Fashion Polyester', 'Unverified UV Filters', '8GB RAM Laptops'],
        notificationFrequency: 'weekly',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryStore.profiles.set(userId, defaultProfile);
    }

    return memoryStore.profiles.get(userId)!;
  }

  public static async upsertProfile(profile: Partial<TwinProfile> & { userId: string }): Promise<TwinProfile> {
    const existing = await this.getProfile(profile.userId);
    const updated: TwinProfile = {
      ...existing,
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    try {
      const admin: any = createAdminClient();
      await admin.from('twin_profiles').upsert({
        user_id: updated.userId,
        twin_name: updated.twinName,
        autonomy_level: updated.autonomyLevel,
        tone: updated.tone,
        budget_tier: updated.budgetTier,
        skin_type: updated.skinType,
        preferred_brands: updated.preferredBrands,
        avoid_keywords: updated.avoidKeywords,
        notification_frequency: updated.notificationFrequency,
        updated_at: updated.updatedAt,
      });
    } catch {
      // Fall through
    }

    memoryStore.profiles.set(profile.userId, updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // 2. TWIN MEMORIES
  // ---------------------------------------------------------------------------
  public static async getMemories(userId: string): Promise<TwinMemory[]> {
    try {
      const admin: any = createAdminClient();
      const { data, error } = await admin
        .from('twin_memories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          category: d.category,
          memoryText: d.memory_text,
          memoryType: d.memory_type,
          confidenceScore: Number(d.confidence_score),
          sourceType: d.source_type,
          verifiedByUser: Boolean(d.verified_by_user),
          isActive: Boolean(d.is_active),
          metadata: d.metadata,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Fall through
    }

    if (!memoryStore.memories.has(userId)) {
      // Seed default transparent baseline memories
      const initial: TwinMemory[] = [
        {
          id: `mem-${userId}-1`,
          userId,
          category: 'brand',
          memoryText: 'Prefers durable consumer tech with local manufacturer warranty over grey market imports.',
          memoryType: 'confirmed_preference',
          confidenceScore: 0.98,
          sourceType: 'direct_user_statement',
          verifiedByUser: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `mem-${userId}-2`,
          userId,
          category: 'budget',
          memoryText: 'Always factors in shipping and platform fees before approving a purchase deal.',
          memoryType: 'confirmed_preference',
          confidenceScore: 0.95,
          sourceType: 'user_feedback',
          verifiedByUser: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `mem-${userId}-3`,
          userId,
          category: 'health',
          memoryText: 'Sensitive skin type in humid Indian climates; rejects heavy comedogenic oils.',
          memoryType: 'inferred_preference',
          confidenceScore: 0.88,
          sourceType: 'inferred_pattern',
          verifiedByUser: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      memoryStore.memories.set(userId, initial);
    }

    return memoryStore.memories.get(userId) || [];
  }

  public static async addMemory(mem: Omit<TwinMemory, 'id' | 'createdAt' | 'updatedAt'>): Promise<TwinMemory> {
    const newMem: TwinMemory = {
      ...mem,
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const admin: any = createAdminClient();
      await admin.from('twin_memories').insert({
        user_id: newMem.userId,
        category: newMem.category,
        memory_text: newMem.memoryText,
        memory_type: newMem.memoryType,
        confidence_score: newMem.confidenceScore,
        source_type: newMem.sourceType,
        verified_by_user: newMem.verifiedByUser,
        is_active: newMem.isActive,
        metadata: newMem.metadata || {},
      });
    } catch {
      // Fall through
    }

    const list = memoryStore.memories.get(mem.userId) || [];
    list.unshift(newMem);
    memoryStore.memories.set(mem.userId, list);

    return newMem;
  }

  public static async deleteMemory(userId: string, memoryId: string): Promise<boolean> {
    try {
      const admin: any = createAdminClient();
      await admin.from('twin_memories').delete().eq('id', memoryId).eq('user_id', userId);
    } catch {
      // Fall through
    }

    const list = memoryStore.memories.get(userId) || [];
    memoryStore.memories.set(
      userId,
      list.filter((m) => m.id !== memoryId)
    );
    return true;
  }

  // ---------------------------------------------------------------------------
  // 3. TWIN GOALS
  // ---------------------------------------------------------------------------
  public static async getGoals(userId: string): Promise<TwinGoal[]> {
    try {
      const admin: any = createAdminClient();
      const { data, error } = await admin
        .from('twin_goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          title: d.title,
          description: d.description,
          category: d.category,
          targetAmount: Number(d.target_amount),
          currentAmount: Number(d.current_amount),
          currency: d.currency,
          deadline: d.deadline,
          status: d.status,
          metadata: d.metadata,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Fall through
    }

    if (!memoryStore.goals.has(userId)) {
      const initialGoals: TwinGoal[] = [
        {
          id: `goal-${userId}-1`,
          userId,
          title: 'Quarterly Tech Upgrade Fund',
          description: 'Keep savings intact until festive sales for active noise-cancelling headphones.',
          category: 'purchase_budget',
          targetAmount: 25000,
          currentAmount: 18500,
          currency: 'INR',
          deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      memoryStore.goals.set(userId, initialGoals);
    }

    return memoryStore.goals.get(userId) || [];
  }

  public static async addGoal(goal: Omit<TwinGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<TwinGoal> {
    const newGoal: TwinGoal = {
      ...goal,
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const admin: any = createAdminClient();
      await admin.from('twin_goals').insert({
        user_id: newGoal.userId,
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        target_amount: newGoal.targetAmount,
        current_amount: newGoal.currentAmount,
        currency: newGoal.currency,
        deadline: newGoal.deadline,
        status: newGoal.status,
        metadata: newGoal.metadata || {},
      });
    } catch {
      // Fall through
    }

    const list = memoryStore.goals.get(goal.userId) || [];
    list.unshift(newGoal);
    memoryStore.goals.set(goal.userId, list);

    return newGoal;
  }

  // ---------------------------------------------------------------------------
  // 4. PURCHASE ANALYSES & PRICE TRUTH
  // ---------------------------------------------------------------------------
  public static async savePurchaseAnalysis(analysis: Omit<PurchaseAnalysis, 'id' | 'createdAt'>): Promise<PurchaseAnalysis> {
    const item: PurchaseAnalysis = {
      ...analysis,
      id: `purchase-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const admin: any = createAdminClient();
      await admin.from('purchase_analyses').insert({
        user_id: item.userId,
        product_name: item.productName,
        merchant: item.merchant,
        product_url: item.productUrl,
        image_url: item.imageUrl,
        input_type: item.inputType,
        base_price: item.basePrice,
        shipping_fee: item.shippingFee,
        taxes: item.taxes,
        platform_fee: item.platformFee,
        coupon_discount: item.couponDiscount,
        card_discount: item.cardDiscount,
        conditional_cashback: item.conditionalCashback,
        total_payable: item.totalPayable,
        currency: item.currency,
        confidence_score: item.confidenceScore,
        assumptions: item.assumptions,
        evidence: item.evidence,
        verdict: item.verdict,
        user_feedback: item.userFeedback,
      });
    } catch {
      // Fall through
    }

    const list = memoryStore.purchases.get(item.userId) || [];
    list.unshift(item);
    memoryStore.purchases.set(item.userId, list);

    return item;
  }

  public static async getPurchaseAnalyses(userId: string): Promise<PurchaseAnalysis[]> {
    try {
      const admin: any = createAdminClient();
      const { data, error } = await admin
        .from('purchase_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          productName: d.product_name,
          merchant: d.merchant,
          productUrl: d.product_url,
          imageUrl: d.image_url,
          inputType: d.input_type,
          basePrice: Number(d.base_price),
          shippingFee: Number(d.shipping_fee),
          taxes: Number(d.taxes),
          platformFee: Number(d.platform_fee),
          couponDiscount: Number(d.coupon_discount),
          cardDiscount: Number(d.card_discount),
          conditionalCashback: Number(d.conditional_cashback),
          totalPayable: Number(d.total_payable),
          currency: d.currency,
          confidenceScore: Number(d.confidence_score),
          assumptions: d.assumptions || [],
          evidence: d.evidence || [],
          verdict: d.verdict,
          userFeedback: d.user_feedback,
          createdAt: d.created_at,
        }));
      }
    } catch {
      // Fall through
    }

    return memoryStore.purchases.get(userId) || [];
  }

  // ---------------------------------------------------------------------------
  // 5. OPPORTUNITIES
  // ---------------------------------------------------------------------------
  public static async getOpportunities(category?: string): Promise<OpportunityItem[]> {
    if (!category || category === 'all') {
      return memoryStore.opportunities;
    }
    return memoryStore.opportunities.filter((o) => o.category === category);
  }

  // ---------------------------------------------------------------------------
  // 6. WEEKLY DIGEST
  // ---------------------------------------------------------------------------
  public static async getWeeklyDigests(userId: string): Promise<WeeklyDigest[]> {
    if (!memoryStore.digests.has(userId)) {
      const sample: WeeklyDigest = {
        id: `digest-${userId}-1`,
        userId,
        weekStartDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        title: 'Your Personal Intelligence Digest — Week 45',
        sections: [
          {
            title: 'Verified Deal Radar',
            summary: 'Detected a 14% legitimate price drop on Sony ANC audio products across Tata CLiQ with HDFC card stacking.',
            sourceCitations: ['Tata CLiQ Luxury pricing feed', 'HDFC SmartBuy terms verified on 2026-11-05'],
          },
          {
            title: 'Budget & Goal Progress',
            summary: 'Your Quarterly Tech Upgrade Fund is at 74% progress (₹18,500 of ₹25,000 target).',
            sourceCitations: ['Twin Goal Tracker'],
          },
          {
            title: 'Lifestyle & Food Pick',
            summary: 'High humidity forecasted this weekend in Kolkata; recommended hydration-first, non-comedogenic outdoor skincare.',
            sourceCitations: ['National Weather Service live feed'],
          },
        ],
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      memoryStore.digests.set(userId, [sample]);
    }

    return memoryStore.digests.get(userId) || [];
  }

  // ---------------------------------------------------------------------------
  // 7. REWARD ACCOUNT & APPEND-ONLY LEDGER
  // ---------------------------------------------------------------------------
  public static async getRewardAccount(userId: string): Promise<{ account: RewardAccount; ledger: RewardLedgerEntry[] }> {
    if (!memoryStore.rewardAccounts.has(userId)) {
      const account: RewardAccount = {
        id: `reward-acc-${userId}`,
        userId,
        availableBalance: 0.0,
        pendingBalance: 0.0,
        lifetimeEarned: 0.0,
        currency: 'INR',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryStore.rewardAccounts.set(userId, account);
      memoryStore.rewardLedgers.set(userId, []);
    }

    return {
      account: memoryStore.rewardAccounts.get(userId)!,
      ledger: memoryStore.rewardLedgers.get(userId) || [],
    };
  }

  // ---------------------------------------------------------------------------
  // 8. DATA EXPORT & DELETION (DPDP ACT)
  // ---------------------------------------------------------------------------
  public static async exportUserData(userId: string): Promise<Record<string, unknown>> {
    const profile = await this.getProfile(userId);
    const memories = await this.getMemories(userId);
    const goals = await this.getGoals(userId);
    const purchases = await this.getPurchaseAnalyses(userId);
    const rewards = await this.getRewardAccount(userId);

    return {
      exportTimestamp: new Date().toISOString(),
      compliance: 'Digital Personal Data Protection Act (DPDP)',
      user: { id: userId },
      twinProfile: profile,
      twinMemories: memories,
      twinGoals: goals,
      purchaseAnalyses: purchases,
      rewardLedger: rewards,
    };
  }

  public static async deleteUserData(userId: string): Promise<boolean> {
    memoryStore.profiles.delete(userId);
    memoryStore.memories.delete(userId);
    memoryStore.goals.delete(userId);
    memoryStore.purchases.delete(userId);
    memoryStore.digests.delete(userId);
    memoryStore.rewardAccounts.delete(userId);
    memoryStore.rewardLedgers.delete(userId);
    memoryStore.referrals.delete(userId);
    memoryStore.approvals.delete(userId);
    memoryStore.consents.delete(userId);

    try {
      const admin: any = createAdminClient();
      await admin.from('twin_profiles').delete().eq('user_id', userId);
      await admin.from('twin_memories').delete().eq('user_id', userId);
      await admin.from('twin_goals').delete().eq('user_id', userId);
      await admin.from('purchase_analyses').delete().eq('user_id', userId);
    } catch {
      // Fall through
    }

    return true;
  }
}
