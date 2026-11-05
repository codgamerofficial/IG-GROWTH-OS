// =============================================================================
// RIIQX — Phase 6: AI Shopping Assistant & Multi-Agent Orchestrator
// Conversational Arbitrage • Multimodal OCR Reasoning • Multi-Provider Cascade
// Gemini 2.5 Flash ➔ Groq GPT-OSS 120B ➔ OpenRouter ➔ Grounded Synthesizer
// =============================================================================

import {
  ExtractedProductInfo,
  PlatformPriceDetail,
  ArbitrageOptimizationPlan,
  DeterministicSavingsWaterfall,
  DropshippingOrder,
} from './types';
import { CommerceService, MarketplaceProduct } from './commerce-service';
import { PriceComparatorService } from './price-comparator';
import { GiftCardArbitrageService } from './giftcard-arbitrage';
import { calculateContributionMargin, getDropshippingOrderById } from './dropshipping-operations';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AssistantSuggestedAction {
  id: string;
  label: string;
  actionType: 'compare_prices' | 'buy_giftcard' | 'create_video_ad' | 'track_order' | 'explore_catalog';
  payload?: Record<string, any>;
}

export interface ShoppingAssistantResponse {
  reply: string;
  providerUsed: string;
  modelUsed: string;
  latencyMs: number;
  matchedProduct?: {
    id: string;
    title: string;
    brand: string;
    price: number;
    mrp: number;
    category: string;
    imageUrl?: string;
  };
  priceComparisons?: PlatformPriceDetail[];
  savingsPlan?: {
    bestPlatform: string;
    finalEffectivePrice: number;
    totalSavings: number;
    upfrontPaid: number;
    futureCashback: number;
  };
  suggestedActions: AssistantSuggestedAction[];
  requiresHumanConfirmation: boolean;
  confidenceScore: number;
}

export interface ShoppingAssistantQuery {
  message: string;
  conversationHistory?: ChatMessage[];
  screenshotBase64?: string;
  screenshotMimeType?: string;
  preferredLanguage?: 'en' | 'bn' | 'auto';
}

export class AIShoppingAssistant {
  private static readonly GEMINI_KEY =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_AI_STUDIO_API_KEY;

  private static readonly GROQ_KEY = process.env.GROQ_API_KEY;
  private static readonly GROQ_BASE = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
  private static readonly GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

  private static readonly OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
  private static readonly OPENROUTER_BASE = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  private static readonly OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';

  /**
   * Main conversational entry point with multi-provider cascade
   */
  public static async processQuery(query: ShoppingAssistantQuery): Promise<ShoppingAssistantResponse> {
    const startTime = Date.now();
    const prompt = query.message.trim();
    const isBengali =
      query.preferredLanguage === 'bn' ||
      /[\u0980-\u09FF]/.test(prompt) ||
      /(koto|dam|sasta|kothay|kinte|hobe|boro|parbo|dekhaw|bolun|ki)/i.test(prompt);

    // 1. Analyze grounded context (catalog match, price comparison, order lookup)
    const context = await this.resolveGroundedContext(prompt);

    // 2. Cascade execution: Gemini -> Groq -> OpenRouter -> Grounded Rule Synthesizer
    let responseText = '';
    let providerName = 'RIIQX Grounded Commerce Engine';
    let modelName = 'Deterministic Multi-Agent Synthesizer';

    // Tier 1: Gemini 2.5 Flash
    if (this.GEMINI_KEY) {
      try {
        const geminiResult = await this.callGemini(prompt, context, query.screenshotBase64, isBengali);
        if (geminiResult) {
          responseText = geminiResult;
          providerName = 'Google Gemini';
          modelName = 'gemini-2.5-flash';
        }
      } catch (err: any) {
        console.warn('Gemini Tier 1 failed or rate-limited, cascading to Tier 2 (Groq):', err?.message);
      }
    }

    // Tier 2: Groq LPU
    if (!responseText && this.GROQ_KEY) {
      try {
        const groqResult = await this.callOpenAICompatible(
          this.GROQ_BASE,
          this.GROQ_KEY,
          this.GROQ_MODEL,
          prompt,
          context,
          isBengali
        );
        if (groqResult) {
          responseText = groqResult;
          providerName = 'Groq Cloud LPU';
          modelName = this.GROQ_MODEL;
        }
      } catch (err: any) {
        console.warn('Groq Tier 2 failed, cascading to Tier 3 (OpenRouter):', err?.message);
      }
    }

    // Tier 3: OpenRouter Unified API
    if (!responseText && this.OPENROUTER_KEY) {
      try {
        const orResult = await this.callOpenAICompatible(
          this.OPENROUTER_BASE,
          this.OPENROUTER_KEY,
          this.OPENROUTER_MODEL,
          prompt,
          context,
          isBengali
        );
        if (orResult) {
          responseText = orResult;
          providerName = 'OpenRouter Global Router';
          modelName = this.OPENROUTER_MODEL;
        }
      } catch (err: any) {
        console.warn('OpenRouter Tier 3 failed, cascading to Tier 4 (Deterministic):', err?.message);
      }
    }

    // Tier 4: Grounded Deterministic Multi-Agent Synthesizer (Always Succeeds)
    if (!responseText) {
      responseText = this.synthesizeGroundedResponse(prompt, context, isBengali);
      providerName = 'RIIQX Autonomous Commerce Engine';
      modelName = 'Grounded Rule & Price Synthesizer (Zero-Downtime Fallback)';
    }

    const latencyMs = Date.now() - startTime;

    // 3. Assemble Structured Action Cards
    const suggestedActions: AssistantSuggestedAction[] = [];

    if (context.matchedProduct) {
      suggestedActions.push({
        id: `act_compare_${context.matchedProduct.id}`,
        label: `Compare ${context.matchedProduct.title.slice(0, 24)}... Across 6 Retailers`,
        actionType: 'compare_prices',
        payload: { product: context.matchedProduct },
      });
      suggestedActions.push({
        id: `act_video_${context.matchedProduct.id}`,
        label: '1-Click Launch Video Ad in Creator Studio',
        actionType: 'create_video_ad',
        payload: { productId: context.matchedProduct.id, title: context.matchedProduct.title },
      });
    }

    if (context.savingsPlan) {
      suggestedActions.push({
        id: 'act_buy_giftcard',
        label: `Unlock Instant ${context.savingsPlan.bestPlatform} Gift Card Discount`,
        actionType: 'buy_giftcard',
        payload: { platform: context.savingsPlan.bestPlatform, amount: context.savingsPlan.finalEffectivePrice },
      });
    }

    if (context.matchedOrder) {
      suggestedActions.push({
        id: `act_track_${context.matchedOrder.id}`,
        label: `Track Order ${context.matchedOrder.id} Milestones`,
        actionType: 'track_order',
        payload: { orderId: context.matchedOrder.id },
      });
    }

    if (suggestedActions.length === 0) {
      suggestedActions.push({
        id: 'act_explore',
        label: 'Browse High-Margin Trending Dropshipping Catalog',
        actionType: 'explore_catalog',
      });
    }

    return {
      reply: responseText,
      providerUsed: providerName,
      modelUsed: modelName,
      latencyMs,
      matchedProduct: context.matchedProduct,
      priceComparisons: context.priceComparisons,
      savingsPlan: context.savingsPlan,
      suggestedActions,
      requiresHumanConfirmation: true, // Safety boundary: human confirmation mandatory
      confidenceScore: context.matchedProduct ? 0.96 : 0.88,
    };
  }

  // ---------------------------------------------------------------------------
  // Grounded Context Resolver (Finds real products, comparisons, orders)
  // ---------------------------------------------------------------------------
  private static async resolveGroundedContext(prompt: string): Promise<{
    matchedProduct?: any;
    priceComparisons?: PlatformPriceDetail[];
    savingsPlan?: any;
    matchedOrder?: DropshippingOrder;
    allProducts: MarketplaceProduct[];
  }> {
    const pLower = prompt.toLowerCase();
    const allProducts = CommerceService.listProducts({ limit: 50 }).products;

    // Check for order ID pattern e.g. ORD_RIIQX_...
    const orderIdMatch = prompt.match(/ORD_RIIQX_[A-Z0-9_]+/i);
    let matchedOrder: DropshippingOrder | undefined;
    if (orderIdMatch) {
      matchedOrder = getDropshippingOrderById(orderIdMatch[0]);
    }

    // Match product by title, keywords or brand
    let matchedProduct: any;
    for (const prod of allProducts) {
      const titleWords = prod.title.toLowerCase().split(/\s+/);
      const brand = prod.brand.toLowerCase();
      if (
        pLower.includes(brand) ||
        titleWords.some((w) => w.length > 3 && pLower.includes(w)) ||
        pLower.includes(prod.category)
      ) {
        matchedProduct = {
          id: prod.id,
          title: prod.title,
          brand: prod.brand,
          price: prod.currentPrice,
          mrp: prod.verifiedMrp,
          category: prod.category,
          imageUrl: prod.images[0],
          sku: prod.sku,
          supplierCost: prod.supplierCost,
        };
        break;
      }
    }

    // If query mentions watches/smartwatch/audio/lamp specifically
    if (!matchedProduct) {
      if (pLower.includes('watch') || pLower.includes('smartwatch')) {
        const found = allProducts.find((p) => p.category === 'fashion' || p.title.toLowerCase().includes('watch'));
        if (found) matchedProduct = { id: found.id, title: found.title, brand: found.brand, price: found.currentPrice, mrp: found.verifiedMrp, category: found.category, imageUrl: found.images[0] };
      } else if (pLower.includes('lamp') || pLower.includes('desk') || pLower.includes('ambient') || pLower.includes('light')) {
        const found = allProducts.find((p) => p.category === 'home' || p.title.toLowerCase().includes('lamp'));
        if (found) matchedProduct = { id: found.id, title: found.title, brand: found.brand, price: found.currentPrice, mrp: found.verifiedMrp, category: found.category, imageUrl: found.images[0] };
      } else if (pLower.includes('earbuds') || pLower.includes('headphone') || pLower.includes('audio') || pLower.includes('sound')) {
        const found = allProducts.find((p) => p.category === 'electronics' || p.title.toLowerCase().includes('earbuds'));
        if (found) matchedProduct = { id: found.id, title: found.title, brand: found.brand, price: found.currentPrice, mrp: found.verifiedMrp, category: found.category, imageUrl: found.images[0] };
      }
    }

    // Run price comparison if a product is matched or query asks to compare
    let priceComparisons: PlatformPriceDetail[] | undefined;
    let savingsPlan: any;

    const queryTarget = matchedProduct ? matchedProduct.title : prompt;
    if (
      pLower.includes('compare') ||
      pLower.includes('best deal') ||
      pLower.includes('cheap') ||
      pLower.includes('price') ||
      pLower.includes('dam') ||
      pLower.includes('sasta') ||
      matchedProduct
    ) {
      try {
        const comp = await PriceComparatorService.analyzeProduct({ url: queryTarget });
        if (comp && comp.platformComparisons) {
          priceComparisons = comp.platformComparisons;
          const optimalPlan = GiftCardArbitrageService.calculateOptimalPlan(
            comp.extractedProduct,
            comp.platformComparisons
          );
          if (optimalPlan) {
            savingsPlan = {
              bestPlatform: optimalPlan.recommendedPlatformName,
              finalEffectivePrice: optimalPlan.finalLowestEffectivePrice,
              totalSavings: optimalPlan.totalMoneySaved,
              upfrontPaid:
                optimalPlan.waterfall?.upfrontCashOutlay || optimalPlan.finalLowestEffectivePrice,
              futureCashback: optimalPlan.giftCardArbitrage.cashbackEarned || 0,
            };
          }
        }
      } catch (e) {
        console.warn('Comparison query non-fatal error:', e);
      }
    }

    return { matchedProduct, priceComparisons, savingsPlan, matchedOrder, allProducts };
  }

  // ---------------------------------------------------------------------------
  // Google Gemini 2.5 Flash Caller
  // ---------------------------------------------------------------------------
  private static async callGemini(
    prompt: string,
    context: any,
    screenshotBase64?: string,
    isBengali = false
  ): Promise<string | null> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.GEMINI_KEY}`;

    const systemPrompt = `You are the RIIQX Elite Commerce Intelligence & Shopping Assistant.
Your goal is to help users find the lowest verified prices, optimize coupons, and explain gift card cashback arbitrage across Indian e-commerce (Amazon, Flipkart, Myntra, Ajio, Meesho, Tata CLiQ).
Language: ${isBengali ? 'Bengali (with natural English technical terms)' : 'Professional cinematic English'}.
Rules:
1. Never hallucinate fake prices or fake discounts. Always use the verified context data provided.
2. Clearly distinguish between "Upfront Cash Outlay" (what customer pays at checkout) and "Future Cashback" (credited to wallet post-purchase).
3. Always include relevant price points in INR (₹).
4. Emphasize that all purchase recommendations require explicit user confirmation.`;

    const contextSummary = JSON.stringify({
      matchedProduct: context.matchedProduct,
      cheapestPlatform: context.savingsPlan?.bestPlatform,
      finalEffectivePrice: context.savingsPlan?.finalEffectivePrice,
      totalSavings: context.savingsPlan?.totalSavings,
      orderTracking: context.matchedOrder ? { id: context.matchedOrder.id, status: context.matchedOrder.status, courier: context.matchedOrder.courierPartner } : null,
    });

    const contents: any[] = [
      {
        parts: [
          { text: `${systemPrompt}\n\n[VERIFIED COMMERCE DATA CONTEXT]:\n${contextSummary}\n\nUser Question: ${prompt}` },
        ],
      },
    ];

    if (screenshotBase64) {
      const mime = screenshotBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      const cleanBase64 = screenshotBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents[0].parts.push({
        inlineData: {
          mimeType: mime,
          data: cleanBase64,
        },
      });
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }

  // ---------------------------------------------------------------------------
  // OpenAI-Compatible Caller (Groq / OpenRouter)
  // ---------------------------------------------------------------------------
  private static async callOpenAICompatible(
    baseUrl: string,
    apiKey: string,
    model: string,
    prompt: string,
    context: any,
    isBengali = false
  ): Promise<string | null> {
    const url = `${baseUrl}/chat/completions`;

    const systemPrompt = `You are the RIIQX Elite Commerce Intelligence & Shopping Assistant.
Help users discover the lowest genuine price across Amazon, Flipkart, Myntra, Ajio, and Meesho.
Language: ${isBengali ? 'Bengali (with natural English terms)' : 'Professional cinematic English'}.
Rules:
- Strictly quote genuine prices from context. Never invent fake discounts.
- Always separate upfront cash paid vs. future wallet cashback.
- Mention that purchases require user confirmation.`;

    const contextString = `[GROUNDED CONTEXT]: Product: ${context.matchedProduct?.title || 'General Query'}, Best Price: ₹${context.savingsPlan?.finalEffectivePrice || 'N/A'}, Best Platform: ${context.savingsPlan?.bestPlatform || 'N/A'}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${contextString}\n\nQuery: ${prompt}` },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  }

  // ---------------------------------------------------------------------------
  // Grounded Deterministic Multi-Agent Rule Synthesizer (Zero-Downtime Fallback)
  // ---------------------------------------------------------------------------
  private static synthesizeGroundedResponse(prompt: string, context: any, isBengali = false): string {
    if (context.matchedOrder) {
      const o = context.matchedOrder;
      if (isBengali) {
        return `📦 **আপনার অর্ডার স্ট্যাটাস:** \`${o.id}\`
- **বর্তমান স্ট্যাটাস:** **${o.status.replace(/_/g, ' ').toUpperCase()}**
- **কুরিয়ার পার্টনার:** ${o.courierPartner} (AWB: \`${o.trackingNumber || 'Pending'}\`)
- **গন্তব্য:** ${o.shippingAddress.city}, ${o.shippingAddress.state} (${o.shippingAddress.pincode})
- **মোট মূল্য:** ₹${o.totalAmount.toLocaleString('en-IN')} (${o.paymentMethod.toUpperCase()})

আপনার পার্সেলটি নিরাপদ এসক্রো ট্র্যাকিংয়ের আওতায় রয়েছে। নিচের বোতাম থেকে লাইভ মাইলস্টোন ট্র্যাকিং দেখতে পারেন।`;
      }
      return `📦 **Order Status Report for \`${o.id}\`:**
- **Current Status:** **${o.status.replace(/_/g, ' ').toUpperCase()}**
- **Courier Partner:** ${o.courierPartner} (AWB: \`${o.trackingNumber || 'Pending'}\`)
- **Delivery Destination:** ${o.shippingAddress.city}, ${o.shippingAddress.state} (${o.shippingAddress.pincode})
- **Total Amount:** ₹${o.totalAmount.toLocaleString('en-IN')} via ${o.paymentMethod.toUpperCase()}

Your shipment is fully tracked in our escrow pipeline. Use the action button below to view detailed location milestones.`;
    }

    if (context.matchedProduct && context.savingsPlan) {
      const p = context.matchedProduct;
      const sp = context.savingsPlan;
      if (isBengali) {
        return `🎯 **RIIQX Price Intelligence Analysis: ${p.title}**

আমি ৬টি প্রধান প্ল্যাটফর্ম (Amazon, Flipkart, Myntra, Ajio, Meesho, Tata CLiQ) স্ক্যান করে সেরা ডিল খুঁজে পেয়েছি:

- **সবচেয়ে সাশ্রয়ী প্ল্যাটফর্ম:** **${sp.bestPlatform}**
- **সর্বনিম্ন চূড়ান্ত মূল্য:** **₹${sp.finalEffectivePrice.toLocaleString('en-IN')}** *(MRP ₹${p.mrp.toLocaleString('en-IN')} থেকে ₹${sp.totalSavings.toLocaleString('en-IN')} সাশ্রয়!)*
- **চেকআউট ক্যাশ আউটলে (এখন যা দিতে হবে):** **₹${sp.upfrontPaid.toLocaleString('en-IN')}**
- **ওয়ালেটে সম্ভাব্য ক্যাশব্যাক:** **+₹${sp.futureCashback.toLocaleString('en-IN')}**

💡 **কীভাবে সর্বোচ্চ ছাড় পাবেন?**
আমাদের অনুমোদিত গিফট কার্ড ব্যবহার করে চেকআউটে তাৎক্ষণিক ছাড় নিন, এবং অবশিষ্ট ক্যাশব্যাক সরাসরি ওয়ালেটে জমা করুন।

*(নিরাপত্তা নিশ্চিতকরণ: কোনো অর্ডার আপনার চূড়ান্ত সম্মতি ছাড়া প্লেস করা হবে না)*`;
      }

      return `🎯 **RIIQX Price Intelligence Report: ${p.title}**

We performed a verified cross-retailer scan across Amazon, Flipkart, Myntra, Ajio, Meesho, and Tata CLiQ:

- **Cheapest Recommended Platform:** **${sp.bestPlatform}**
- **Lowest Effective Price:** **₹${sp.finalEffectivePrice.toLocaleString('en-IN')}** *(Saving ₹${sp.totalSavings.toLocaleString('en-IN')} off MRP ₹${p.mrp.toLocaleString('en-IN')}!)*
- **Upfront Cash Outlay (Payable at Checkout):** **₹${sp.upfrontPaid.toLocaleString('en-IN')}**
- **Post-Purchase Wallet Cashback:** **+₹${sp.futureCashback.toLocaleString('en-IN')}**

💡 **Arbitrage Recommendation:**
Purchase an authorized pre-discounted gift card from the RIIQX marketplace to lock in upfront instant savings plus guaranteed cashback.

*(Security Note: RIIQX strictly requires your explicit confirmation before any purchase).*`;
    }

    // Default overview response
    if (isBengali) {
      return `👋 **হ্যালো! আমি RIIQX AI Shopping Assistant।**

আমি আপনাকে রিয়েল-টাইমে বিভিন্ন প্ল্যাটফর্মের আসল দাম তুলনা করতে, কুপন ও ব্যাংক অফার স্ট্যাক করতে এবং গিফট কার্ড আর্বিট্রেজের মাধ্যমে সর্বোচ্চ ছাড় পেতে সাহায্য করি।

আপনি আমাকে জিজ্ঞেস করতে পারেন:
- *"Sony WH-1000XM5 এর সবচেয়ে সেরা ডিল কোথায় পাওয়া যাবে?"*
- *"Flipkart ও Amazon এ Noise Smartwatch এর দামের তুলনা দেখাও"*
- *"কোন Ambient Desk Lamp এ সবচেয়ে বেশি ড্রপশিপিং প্রফিট মার্জিন রয়েছে?"*
- যেকোনো প্রডাক্টের স্ক্রিনশট বা লিঙ্ক আপলোড করে আসল দাম জেনে নিন!`;
    }

    return `👋 **Welcome to the RIIQX Autonomous Shopping Intelligence Assistant.**

I assist you in real-time cross-platform price comparison across Amazon, Flipkart, Myntra, Ajio, Meesho, and Tata CLiQ with deterministic 9-step coupon and gift card arbitrage stacking.

Here are a few queries you can try:
- *"Find the best deal for Sony WH-1000XM5 across all retailers including coupons and gift cards"*
- *"Compare Noise Colorfit Pro 5 between Amazon, Flipkart and Meesho"*
- *"Which trending ambient desk lamp offers the highest dropshipping margin?"*
- Upload any product screenshot or paste a retailer URL to run instant OCR intelligence!`;
  }
}
