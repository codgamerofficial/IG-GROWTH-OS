// =============================================================================
// IG GrowthOS: Unified Repository Layer (Postgres + Resilient Store)
// =============================================================================

import {
  Brand,
  ContentPillar,
  ContentItem,
  Product,
  Trend,
  AnalyticsRecord,
  Approval,
  AutomationJob,
  AuditLog,
  ApprovalStatus,
  ContentStatus,
  AIScoreBreakdown,
  ScriptSection,
  ContentType
} from './types';
import { isSupabaseConfigured, supabase } from './client';

// Initial In-Memory State seeded for Brand: RIIQX
const initialBrand: Brand = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'RIIQX',
  slug: 'riiqx-fashion',
  description: 'High-end contemporary streetwear and avant-garde lifestyle fashion for the modern vanguard.',
  website: 'https://riiqx.com',
  instagram_account_id: '17841405309281745',
  instagram_username: 'riiqx.official',
  target_audience: 'Gen Z & early-career millennials, streetwear enthusiasts, fashion innovators, aesthetics connoisseurs',
  brand_voice: 'Premium, unapologetic, confident, trend-forward, sleek, highly visual, concise',
  content_language: 'en',
  timezone: 'America/New_York',
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const initialPillars: ContentPillar[] = [
  { id: '10000000-0000-0000-0000-000000000001', brand_id: initialBrand.id, name: 'Outfit Inspiration', description: 'Curated looks, full fit checks, layering masterclasses, aesthetic color matching', percentage: 25, active: true, created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000002', brand_id: initialBrand.id, name: 'Product Showcase', description: 'Fabric macro shots, garment hardware details, silhouette showcases, drop announcements', percentage: 20, active: true, created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000003', brand_id: initialBrand.id, name: 'UGC', description: 'Customer unboxings, tagged styling reactions, street fit checks, real-world wear', percentage: 15, active: true, created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000004', brand_id: initialBrand.id, name: 'Fashion Tips', description: 'Proportions, color theory, capsule wardrobe tips, shoe pairing rules', percentage: 10, active: true, created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000005', brand_id: initialBrand.id, name: 'Styling', description: '1 item styled 3 ways, transitioning day to night, dressing for seasonal transitions', percentage: 10, active: true, created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000006', brand_id: initialBrand.id, name: 'Behind the Scenes', description: 'Studio design sessions, fabric sourcing, packaging process, sample room leaks', percentage: 10, active: true, created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000007', brand_id: initialBrand.id, name: 'Trend Content', description: 'Runway breakdowns, microtrend analysis, aesthetic forecasting, meme-culture commentary', percentage: 5, active: true, created_at: new Date().toISOString() },
  { id: '10000000-0000-0000-0000-000000000008', brand_id: initialBrand.id, name: 'Community', description: 'Q&As, fit battles, poll responses, styling advice for followers', percentage: 5, active: true, created_at: new Date().toISOString() },
];

const initialProducts: Product[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    brand_id: initialBrand.id,
    name: 'Cyber Acid Oversized Heavyweight Tee',
    description: '280 GSM luxury combed cotton with mineral wash and subtle high-density tonal rubber branding.',
    price: 52.00,
    sale_price: 44.00,
    product_url: 'https://riiqx.com/products/cyber-acid-tee',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    affiliate_url: 'https://riiqx.com/aff/cyber-acid-tee?ref=growthos',
    commission: 15,
    category: 'Tops',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    brand_id: initialBrand.id,
    name: 'Tactical Wide-Leg Pleated Cargo Pants',
    description: 'Structured technical twill with articulated knee darts, cobra buckle cinch system, and 8 deep utility pockets.',
    price: 95.00,
    sale_price: 85.00,
    product_url: 'https://riiqx.com/products/tactical-cargo-pants',
    image_url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
    affiliate_url: 'https://riiqx.com/aff/tactical-cargos?ref=growthos',
    commission: 15,
    category: 'Bottoms',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    brand_id: initialBrand.id,
    name: 'Modular Double-Zip Boxy Hoodie',
    description: '460 GSM French terry with custom matte gunmetal double two-way zipper and oversized double-layer hood.',
    price: 120.00,
    sale_price: 110.00,
    product_url: 'https://riiqx.com/products/boxy-double-zip-hoodie',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    affiliate_url: null,
    commission: null,
    category: 'Outerwear',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    brand_id: initialBrand.id,
    name: 'Minimalist Weatherproof Tech Sling',
    description: 'Cordura nylon ballistic fabric with Fidlock magnetic buckle and padded modular dividers.',
    price: 48.00,
    sale_price: 42.00,
    product_url: 'https://riiqx.com/products/tech-nylon-sling',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    affiliate_url: null,
    commission: null,
    category: 'Accessories',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    brand_id: initialBrand.id,
    name: 'Raw-Hem Distressed Japanese Denim Jacket',
    description: '14oz selvedge denim in charcoal wash with dropped shoulders and raw fringe cuffs.',
    price: 140.00,
    sale_price: 125.00,
    product_url: 'https://riiqx.com/products/raw-hem-denim-jacket',
    image_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    affiliate_url: null,
    commission: null,
    category: 'Outerwear',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const initialTrends: Trend[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    topic: 'Deconstructed Utilitarian Denim',
    source: 'Instagram Explore & Highsnobiety',
    source_url: 'https://instagram.com/explore/tags/streetwear',
    trend_score: 94.0,
    relevance_score: 96.0,
    content_angle: 'Contrast structured tactical garments with raw hem denim to emphasize drape and texture.',
    discovered_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    topic: '3-Second Fast Cut Outfit Transitions',
    source: 'Reels Audio & Creator Dashboard',
    source_url: 'https://instagram.com/reels',
    trend_score: 91.0,
    relevance_score: 98.0,
    content_angle: 'Synch boot snap and hoodie zipper pull to trending heavy bass kick transition sound.',
    discovered_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 10 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    topic: 'Monochrome Earth Tones vs Acid Wash',
    source: 'Vogue Street Style 2026',
    source_url: 'https://vogue.com',
    trend_score: 88.0,
    relevance_score: 90.0,
    content_angle: 'Break conventional monotone rules with acid wash graphic tee under tailored charcoal outerwear.',
    discovered_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 21 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    topic: 'POV: Finding Your Uniform in 2026',
    source: 'TikTok Fashion & Reels Trends',
    source_url: 'https://tiktok.com',
    trend_score: 95.0,
    relevance_score: 94.0,
    content_angle: 'Relatable storytelling on moving past fast fashion to high-density timeless silhouette staples.',
    discovered_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    expires_at: new Date(Date.now() + 12 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

const initialContentItems: ContentItem[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    brand_id: initialBrand.id,
    title: 'Stop buying hoodies that lose their shape after 2 washes',
    content_type: 'Reel',
    content_pillar: 'Product Showcase',
    hook: 'Why your $80 hoodie feels like cardboard after wash #1.',
    script: {
      hook: '0-3s: Macro crop of 460 GSM ribbed weave stretching back instantly',
      problem: '3-8s: Compare flimsy high-street cotton vs structured French terry',
      story: '8-20s: Explaining high-density loopback yarn and double-lined hood architecture',
      payoff: '20-28s: Full fit 360 spin showcasing boxy drape',
      cta: '28-30s: Drop link in bio for the Modular Zip Hoodie',
      production_notes: 'Shoot under high-contrast directional studio key light. Grade in cool cyan-black tone.'
    },
    caption: 'The anatomy of a hoodie that actually holds its boxy structure forever. 460 GSM combed French terry, custom two-way matte gunmetal hardware, and zero synthetic filler.\n\nWhich colorway are you rocking this season? Drop a comment below.',
    hashtags: ['#riiqx', '#streetwearfits', '#hoodieaesthetic', '#mensfashiontips', '#outfitinspiration', '#y2kfashion', '#highsnobiety'],
    cta: 'Comment HOODIE to receive the secret drop link & fabric guide.',
    media_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    cover_text: 'The 460 GSM Heavyweight Masterclass',
    scheduled_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    instagram_media_id: '17983419082347101',
    status: 'PUBLISHED',
    approval_status: 'APPROVED',
    ai_score: 94.5,
    ai_score_breakdown: {
      hook_strength: 96,
      audience_relevance: 95,
      trend_relevance: 92,
      shareability: 94,
      save_potential: 98,
      conversion_potential: 92,
      brand_fit: 96,
    },
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    brand_id: initialBrand.id,
    title: '3 Ways to Style Tactical Cargo Pants Without Looking Like a Camper',
    content_type: 'Carousel',
    content_pillar: 'Styling',
    hook: 'If your cargos swallow your shoes, you are wearing the wrong cut.',
    script: {
      hook: 'Slide 1: High-contrast fit with chunky platform loafers',
      problem: 'Slide 2: Minimalist tucked silhouette with cropped heavyweight tee',
      story: 'Slide 3: Technical outerwear layering with cinched ankle toggles',
    },
    caption: 'Cargos don\'t have to mean baggy and shapeless. Here is how we balance proportions with structured wide-leg pleats and tactical hardware.\n\nSwipe through all 3 looks and save this for your next weekend fit breakdown.',
    hashtags: ['#cargopants', '#stylingguide', '#streetwearinspo', '#widesilhouette', '#fashiontips', '#riiqxstyle'],
    cta: 'Save this post so you have the cheat-sheet when getting dressed.',
    media_url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80',
    cover_text: 'CARGO PROPORTIONS: 1 Pant, 3 Clean Looks',
    scheduled_at: new Date(Date.now() + 1 * 86400000).toISOString(),
    published_at: null,
    instagram_media_id: null,
    status: 'SCHEDULED',
    approval_status: 'APPROVED',
    ai_score: 91.0,
    ai_score_breakdown: {
      hook_strength: 92,
      audience_relevance: 94,
      trend_relevance: 90,
      shareability: 89,
      save_potential: 95,
      conversion_potential: 88,
      brand_fit: 92,
    },
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    brand_id: initialBrand.id,
    title: 'POV: You finally stopped dressing for everyone else',
    content_type: 'Reel',
    content_pillar: 'UGC',
    hook: 'The exact moment you realize clothes are armor, not costume.',
    script: {
      hook: '0-3s: Low angle walking shot against concrete minimalist brutalist building',
      problem: '3-7s: Voiceover on breaking free from microtrend fatigue',
      story: '7-18s: Quick cut details of Japanese denim texture and heavyweight tee collar',
      payoff: '18-26s: Confident step into crosswalk, sunglasses reflection',
      cta: '26-30s: Text on screen: Wear RIIQX. Move different.',
    },
    caption: 'Confidence isn\'t bought; it\'s cut into the silhouette. Heavyweight, unapologetic, built to outlast seasons.\n\nFeaturing the Raw-Hem Selvedge Denim Jacket & Cyber Acid Tee.',
    hashtags: ['#pov', '#minimalstreetwear', '#fitcheck', '#darkaesthetic', '#riiqx', '#rawdenim'],
    cta: 'Tag your style partner in the comments.',
    media_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    cover_text: 'POV: Your 2026 Style Shift',
    scheduled_at: null,
    published_at: null,
    instagram_media_id: null,
    status: 'READY',
    approval_status: 'PENDING',
    ai_score: 88.5,
    ai_score_breakdown: {
      hook_strength: 89,
      audience_relevance: 91,
      trend_relevance: 93,
      shareability: 90,
      save_potential: 84,
      conversion_potential: 82,
      brand_fit: 91,
    },
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000004',
    brand_id: initialBrand.id,
    title: 'Behind The Seams: Why We Rejected 14 Zipper Prototypes',
    content_type: 'Reel',
    content_pillar: 'Behind the Scenes',
    hook: 'Most brands use $0.15 plastic zippers. Here is why we spent 6 months designing ours.',
    script: {
      hook: 'Macro drop test of custom metal teeth zipper',
      story: 'Explaining durability and smooth slide on heavy fleece',
      payoff: 'Finished hoodie zip sound design ASMR',
    },
    caption: 'Obsession with details separates garments from collectibles. Inside our development process for the Modular Double-Zip Hoodie.',
    hashtags: ['#behindthescenes', '#garmentconstruction', '#clothingproduction', '#riiqx', '#fashiondesign'],
    cta: 'Would you rather have a single or two-way zipper? Vote below.',
    media_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    cover_text: 'THE HARDWARE OBSESSION',
    scheduled_at: null,
    published_at: null,
    instagram_media_id: null,
    status: 'DRAFT',
    approval_status: 'DRAFT',
    ai_score: 86.0,
    ai_score_breakdown: {
      hook_strength: 88,
      audience_relevance: 85,
      trend_relevance: 84,
      shareability: 86,
      save_potential: 89,
      conversion_potential: 83,
      brand_fit: 92,
    },
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Generate 14 days of realistic analytics
const initialAnalytics: AnalyticsRecord[] = Array.from({ length: 14 }).map((_, i) => {
  const dayOffset = 13 - i;
  const dateStr = new Date(Date.now() - dayOffset * 86400000).toISOString().split('T')[0];
  const baseReach = 18000 + i * 2200 + Math.floor(Math.sin(i) * 1200);
  const baseImp = Math.round(baseReach * 1.32);
  const likes = Math.round(baseReach * 0.082);
  const comments = Math.round(likes * 0.078);
  const shares = Math.round(likes * 0.27);
  const saves = Math.round(likes * 0.42);
  const views = Math.round(baseReach * 0.94);
  const profileVisits = Math.round(baseReach * 0.027);
  const followers = Math.round(baseReach * 0.0085);
  const engagementRate = Number(((likes + comments + shares + saves) / baseReach * 100).toFixed(2));

  return {
    id: `70000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`,
    brand_id: initialBrand.id,
    content_id: '40000000-0000-0000-0000-000000000001',
    instagram_media_id: '17983419082347101',
    date: dateStr,
    impressions: baseImp,
    reach: baseReach,
    likes,
    comments,
    shares,
    saves,
    video_views: views,
    profile_visits: profileVisits,
    followers_gained: followers,
    engagement_rate: engagementRate,
    created_at: new Date().toISOString(),
  };
});

const initialJobs: AutomationJob[] = [
  {
    id: '80000000-0000-0000-0000-000000000001',
    brand_id: initialBrand.id,
    job_type: 'daily_trend_research',
    status: 'COMPLETED',
    payload: { category: 'Streetwear & Lifestyle' },
    result: { trends_discovered: 4, top_category: 'Streetwear Silhouettes' },
    error: null,
    started_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    completed_at: new Date(Date.now() - 5.9 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: '80000000-0000-0000-0000-000000000002',
    brand_id: initialBrand.id,
    job_type: 'daily_content_ideas',
    status: 'COMPLETED',
    payload: { brand: 'RIIQX', count: 10 },
    result: { ideas_generated: 10, top_score: 94.5 },
    error: null,
    started_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    completed_at: new Date(Date.now() - 3.9 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: '80000000-0000-0000-0000-000000000003',
    brand_id: initialBrand.id,
    job_type: 'daily_analytics',
    status: 'COMPLETED',
    payload: { date: new Date().toISOString().split('T')[0] },
    result: { engagement_delta: '+14.8%', follower_net: '+355' },
    error: null,
    started_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    completed_at: new Date(Date.now() - 1.9 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

const initialLogs: AuditLog[] = [
  {
    id: '90000000-0000-0000-0000-000000000001',
    user_id: 'system_init',
    action: 'BRAND_INITIALIZED',
    resource_type: 'brand',
    resource_id: initialBrand.id,
    metadata: { brand_name: 'RIIQX', category: 'Fashion / Lifestyle' },
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '90000000-0000-0000-0000-000000000002',
    user_id: 'system_init',
    action: 'CONTENT_ITEM_CREATED',
    resource_type: 'content_items',
    resource_id: '40000000-0000-0000-0000-000000000001',
    metadata: { title: 'Stop buying hoodies that lose their shape' },
    created_at: new Date(Date.now() - 72000000).toISOString(),
  },
];

// Persistent In-Memory Store
class InMemoryStore {
  brands: Brand[] = [initialBrand];
  pillars: ContentPillar[] = [...initialPillars];
  products: Product[] = [...initialProducts];
  trends: Trend[] = [...initialTrends];
  contentItems: ContentItem[] = [...initialContentItems];
  analytics: AnalyticsRecord[] = [...initialAnalytics];
  jobs: AutomationJob[] = [...initialJobs];
  logs: AuditLog[] = [...initialLogs];
}

const memoryStore = new InMemoryStore();

// Repository Implementation
export const repository = {
  // BRANDS
  async getBrand(slug = 'riiqx-fashion'): Promise<Brand> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('brands').select('*').eq('slug', slug).single();
      if (!error && data) return data as Brand;
    }
    const found = memoryStore.brands.find(b => b.slug === slug || b.id === slug);
    return found || memoryStore.brands[0];
  },

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
    const brand = memoryStore.brands.find(b => b.id === id) || memoryStore.brands[0];
    Object.assign(brand, updates, { updated_at: new Date().toISOString() });
    
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('brands').update(updates).eq('id', id);
    }
    return brand;
  },

  // PILLARS
  async getContentPillars(brandId: string): Promise<ContentPillar[]> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('content_pillars').select('*').eq('brand_id', brandId);
      if (!error && data) return data as ContentPillar[];
    }
    return memoryStore.pillars.filter(p => p.brand_id === brandId);
  },

  // PRODUCTS
  async getProducts(brandId: string): Promise<Product[]> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('products').select('*').eq('brand_id', brandId);
      if (!error && data) return data as Product[];
    }
    return memoryStore.products.filter(p => p.brand_id === brandId && p.active);
  },

  async addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.products.unshift(newProduct);
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('products').insert(newProduct);
    }
    return newProduct;
  },

  // TRENDS
  async getTrends(): Promise<Trend[]> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('trends').select('*').order('trend_score', { ascending: false });
      if (!error && data) return data as Trend[];
    }
    return memoryStore.trends;
  },

  async addTrend(trend: Omit<Trend, 'id' | 'created_at'>): Promise<Trend> {
    const newTrend: Trend = {
      ...trend,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    memoryStore.trends.unshift(newTrend);
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('trends').insert(newTrend);
    }
    return newTrend;
  },

  // CONTENT ITEMS
  async getContentItems(brandId: string, filter?: { status?: ContentStatus; approval_status?: ApprovalStatus }): Promise<ContentItem[]> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      let query = supabase.from('content_items').select('*').eq('brand_id', brandId);
      if (filter?.status) query = query.eq('status', filter.status);
      if (filter?.approval_status) query = query.eq('approval_status', filter.approval_status);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) return data as ContentItem[];
    }

    return memoryStore.contentItems.filter(item => {
      if (item.brand_id !== brandId) return false;
      if (filter?.status && item.status !== filter.status) return false;
      if (filter?.approval_status && item.approval_status !== filter.approval_status) return false;
      return true;
    });
  },

  async getContentItemById(id: string): Promise<ContentItem | null> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('content_items').select('*').eq('id', id).single();
      if (!error && data) return data as ContentItem;
    }
    return memoryStore.contentItems.find(item => item.id === id) || null;
  },

  async createContentItem(item: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>): Promise<ContentItem> {
    const newItem: ContentItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.contentItems.unshift(newItem);
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('content_items').insert(newItem);
    }
    await this.logAudit({
      action: 'CONTENT_CREATED',
      resource_type: 'content_items',
      resource_id: newItem.id,
      metadata: { title: newItem.title, type: newItem.content_type, status: newItem.status },
    });
    return newItem;
  },

  async updateContentItem(id: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
    const item = memoryStore.contentItems.find(i => i.id === id);
    if (!item) return null;

    Object.assign(item, updates, { updated_at: new Date().toISOString() });

    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('content_items').update(updates).eq('id', id);
    }

    await this.logAudit({
      action: 'CONTENT_UPDATED',
      resource_type: 'content_items',
      resource_id: id,
      metadata: updates,
    });
    return item;
  },

  async approveContentItem(id: string, approvedBy = 'editor'): Promise<ContentItem | null> {
    const item = memoryStore.contentItems.find(i => i.id === id);
    if (!item) return null;

    item.approval_status = 'APPROVED';
    item.status = 'APPROVED';
    item.updated_at = new Date().toISOString();

    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('content_items').update({
        approval_status: 'APPROVED',
        status: 'APPROVED',
        updated_at: item.updated_at
      }).eq('id', id);
      await supabase.from('approvals').insert({
        content_id: id,
        status: 'APPROVED',
        approved_at: new Date().toISOString(),
        approved_by: approvedBy
      });
    }

    await this.logAudit({
      action: 'CONTENT_APPROVED',
      resource_type: 'content_items',
      resource_id: id,
      metadata: { approved_by: approvedBy },
    });

    return item;
  },

  async rejectContentItem(id: string, reason: string): Promise<ContentItem | null> {
    const item = memoryStore.contentItems.find(i => i.id === id);
    if (!item) return null;

    item.approval_status = 'REJECTED';
    item.status = 'REJECTED';
    item.updated_at = new Date().toISOString();

    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('content_items').update({
        approval_status: 'REJECTED',
        status: 'REJECTED',
        updated_at: item.updated_at
      }).eq('id', id);
      await supabase.from('approvals').insert({
        content_id: id,
        status: 'REJECTED',
        rejection_reason: reason
      });
    }

    await this.logAudit({
      action: 'CONTENT_REJECTED',
      resource_type: 'content_items',
      resource_id: id,
      metadata: { reason },
    });

    return item;
  },

  async scheduleContentItem(id: string, scheduledAt: string): Promise<ContentItem | null> {
    const item = memoryStore.contentItems.find(i => i.id === id);
    if (!item) return null;

    // Safety rule: item must be approved before scheduling
    if (item.approval_status !== 'APPROVED') {
      throw new Error(`SAFETY_GATE_VIOLATION: Cannot schedule content '${item.title}' because approval_status is ${item.approval_status}. Content must be APPROVED.`);
    }

    item.status = 'SCHEDULED';
    item.scheduled_at = scheduledAt;
    item.updated_at = new Date().toISOString();

    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('content_items').update({
        status: 'SCHEDULED',
        scheduled_at: scheduledAt,
        updated_at: item.updated_at
      }).eq('id', id);
    }

    await this.logAudit({
      action: 'CONTENT_SCHEDULED',
      resource_type: 'content_items',
      resource_id: id,
      metadata: { scheduled_at: scheduledAt },
    });

    return item;
  },

  async markContentPublished(id: string, instagramMediaId: string): Promise<ContentItem | null> {
    const item = memoryStore.contentItems.find(i => i.id === id);
    if (!item) return null;

    item.status = 'PUBLISHED';
    item.published_at = new Date().toISOString();
    item.instagram_media_id = instagramMediaId;
    item.updated_at = new Date().toISOString();

    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('content_items').update({
        status: 'PUBLISHED',
        published_at: item.published_at,
        instagram_media_id: instagramMediaId,
        updated_at: item.updated_at
      }).eq('id', id);
    }

    await this.logAudit({
      action: 'CONTENT_PUBLISHED',
      resource_type: 'content_items',
      resource_id: id,
      metadata: { instagram_media_id: instagramMediaId },
    });

    return item;
  },

  // ANALYTICS
  async getAnalytics(brandId: string, days = 30): Promise<AnalyticsRecord[]> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('analytics').select('*').eq('brand_id', brandId).order('date', { ascending: true });
      if (!error && data) return data as AnalyticsRecord[];
    }
    return memoryStore.analytics.slice(-days);
  },

  // AUTOMATION JOBS
  async getAutomationJobs(brandId: string): Promise<AutomationJob[]> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('automation_jobs').select('*').eq('brand_id', brandId).order('created_at', { ascending: false });
      if (!error && data) return data as AutomationJob[];
    }
    return memoryStore.jobs;
  },

  async createAutomationJob(job: Omit<AutomationJob, 'id' | 'created_at'>): Promise<AutomationJob> {
    const newJob: AutomationJob = {
      ...job,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    memoryStore.jobs.unshift(newJob);
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('automation_jobs').insert(newJob);
    }
    return newJob;
  },

  async updateAutomationJob(id: string, updates: Partial<AutomationJob>): Promise<AutomationJob | null> {
    const job = memoryStore.jobs.find(j => j.id === id);
    if (!job) return null;
    Object.assign(job, updates);
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('automation_jobs').update(updates).eq('id', id);
    }
    return job;
  },

  // AUDIT LOGS
  async logAudit(log: { action: string; resource_type: string; resource_id?: string | null; metadata?: Record<string, unknown>; user_id?: string }): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      user_id: log.user_id || 'system_worker',
      action: log.action,
      resource_type: log.resource_type,
      resource_id: log.resource_id || null,
      metadata: log.metadata || {},
      created_at: new Date().toISOString(),
    };
    memoryStore.logs.unshift(newLog);
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      await supabase.from('audit_logs').insert(newLog);
    }
    return newLog;
  },

  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    if (isSupabaseConfigured() && process.env.MOCK_MODE !== 'true') {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(limit);
      if (!error && data) return data as AuditLog[];
    }
    return memoryStore.logs.slice(0, limit);
  }
};
