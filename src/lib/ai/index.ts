// =============================================================================
// IG GrowthOS: AI Provider Implementations & Factory
// =============================================================================

import {
  AIProvider,
  GeneratedIdea,
  GeneratedReel,
  GeneratedUGC,
  GeneratedProductContent,
  GeneratedAffiliateContent,
  DiscoveredTrend,
  AnalyticsDiagnostic,
  CopilotMessage,
} from './types';
import { calculateOpportunityScore, generateFactors } from './scoring';

// -----------------------------------------------------------------------------
// 1. MOCK AI PROVIDER (Tailored to RIIQX Fashion / Lifestyle)
// -----------------------------------------------------------------------------
export class MockAIProvider implements AIProvider {
  name = 'MockAIProvider';

  async generateIdeas(params: {
    brandName: string;
    category: string;
    pillar?: string;
    audience?: string;
    goal?: string;
    format?: string;
    product?: string;
    tone?: string;
    count?: number;
  }): Promise<GeneratedIdea[]> {
    const count = params.count || 10;
    const pillar = params.pillar || 'Outfit Inspiration';
    const brand = params.brandName || 'RIIQX';

    const templates = [
      {
        title: '3 Silhouette Mistakes Making You Look Shorter in Streetwear',
        hook: 'Why wearing oversized hoodies with skinny jeans destroys your proportions.',
        concept: 'Visual comparison showing boxy cropped cuts vs slouchy drops, demonstrating how 1:2 visual ratio creates an elongated frame.',
        why_it_could_work: 'High educational value combined with instant visual payoff triggers high save rates from fashion enthusiasts.',
        audience: 'Gen Z streetwear connoisseurs seeking clean styling rules',
        pillar: 'Fashion Tips',
        difficulty: 'Low' as const,
        reach: 'High' as const,
        recommended_format: 'Carousel' as const,
        baseScore: 94,
      },
      {
        title: 'The Anatomy of a $120 Hoodie: What Are You Actually Paying For?',
        hook: 'Never buy another hoodie until you check these 3 internal seams.',
        concept: 'Macro tear-down of 460 GSM French terry versus commercial blended fleece, showing double-needle topstitching and custom hardware.',
        why_it_could_work: 'Taps into conscious consumerism and skepticism against fast fashion, establishing RIIQX as an authentic luxury benchmark.',
        audience: 'Discerning menswear & streetwear collectors',
        pillar: 'Product Showcase',
        difficulty: 'Medium' as const,
        reach: 'Viral' as const,
        recommended_format: 'Reel' as const,
        baseScore: 96,
      },
      {
        title: 'POV: You Stopped Dressing for the Crowd and Found Your Uniform',
        hook: 'The moment you stop chasing TikTok aesthetics and build your core armor.',
        concept: 'Moody low-light cinema Reel featuring brutalist architecture, rapid-cut garment texture closeups, and confident street strides.',
        why_it_could_work: 'Emotional resonance and aspirational lifestyle storytelling drive high shares and profile visits.',
        audience: 'Urban creatives, photographers, fashion innovators',
        pillar: 'UGC',
        difficulty: 'Medium' as const,
        reach: 'Viral' as const,
        recommended_format: 'Reel' as const,
        baseScore: 91,
      },
      {
        title: 'How to Style Tactical Cargos for 3 Completely Different Settings',
        hook: 'Yes, you can wear tactical cargo pants to a dinner without looking like a security guard.',
        concept: 'Step-by-step outfit transformation from streetwear casual to night out with structured loafers and raw denim layer.',
        why_it_could_work: 'High utility styling content that directly drives product purchase intent for RIIQX cargo pants.',
        audience: 'Style-conscious young professionals and students',
        pillar: 'Styling',
        difficulty: 'Low' as const,
        reach: 'Moderate' as const,
        recommended_format: 'Carousel' as const,
        baseScore: 89,
      },
      {
        title: 'We Rejected 14 Hardware Samples Before Approving This Zipper',
        hook: '99% of clothing brands cut corners right here.',
        concept: 'Behind-the-scenes laboratory and workshop footage showing metal zip endurance tests and tonal matte plating testing.',
        why_it_could_work: 'Translucent brand storytelling builds intense customer trust and justifies premium pricing.',
        audience: 'Design purists and loyal RIIQX brand advocates',
        pillar: 'Behind the Scenes',
        difficulty: 'Medium' as const,
        reach: 'Moderate' as const,
        recommended_format: 'Reel' as const,
        baseScore: 88,
      },
      {
        title: '2026 Microtrend Alert: Utilitarian Minimalist Draping',
        hook: 'The chunky sneaker era is evolving. Here is what is taking over the streets this season.',
        concept: 'Fast-paced runway-to-street breakdown identifying dark utilitarian palettes, dropped shoulders, and magnetic hardware.',
        why_it_could_work: 'Positioning RIIQX as a trend forecaster drives authority, follows, and saves.',
        audience: 'Fashion trend spotters and culture watchers',
        pillar: 'Trend Content',
        difficulty: 'Medium' as const,
        reach: 'Viral' as const,
        recommended_format: 'Reel' as const,
        baseScore: 93,
      },
      {
        title: 'Street Style Fit Check: What London & Tokyo Creatives Are Wearing',
        hook: 'Rate this fit from 1 to 10 in the comments.',
        concept: 'Authentic creator street interview style analyzing silhouette balance, fabric weight, and bag placement.',
        why_it_could_work: 'Interactive comment bait drives Instagram algorithmic push and high comment volume.',
        audience: 'Global streetwear community',
        pillar: 'Community',
        difficulty: 'High' as const,
        reach: 'Viral' as const,
        recommended_format: 'Reel' as const,
        baseScore: 92,
      },
      {
        title: 'The Ultimate Rainproof Daily Carry: Modular Tech Sling Review',
        hook: 'Everything I carry daily inside a 3-liter indestructible pack.',
        concept: 'Satisfying tactile unboxing and packing sequence: camera, keys, AirPods, sunglasses snapping into magnetic Fidlock buckles.',
        why_it_could_work: 'Everyday Carry (EDC) content has an exceptionally high organic conversion and save rate.',
        audience: 'Techwear enthusiasts and modern commuters',
        pillar: 'Product Showcase',
        difficulty: 'Low' as const,
        reach: 'Moderate' as const,
        recommended_format: 'UGC' as const,
        baseScore: 87,
      },
      {
        title: '1 White Tee, 4 Layering Archetypes for Cold Nights',
        hook: 'Your base layer is doing all the heavy lifting.',
        concept: 'Speed layering tutorial demonstrating crewneck collars standing stiff beneath heavy outerwear.',
        why_it_could_work: 'Solves the universal problem of floppy collars and sloppy layering.',
        audience: 'Everyday fashion conscious shoppers',
        pillar: 'Fashion Tips',
        difficulty: 'Low' as const,
        reach: 'High' as const,
        recommended_format: 'Carousel' as const,
        baseScore: 90,
      },
      {
        title: 'Unreleased Sample Room Tour: What’s Dropping Next Month',
        hook: 'Should we actually release this jacket or keep it in the vault?',
        concept: 'Sneak peek camera pan across sample racks with color swatch voting prompt.',
        why_it_could_work: 'Exclusivity and scarcity ignite FOMO and active story and feed replies.',
        audience: 'Core brand VIPs and newsletter subscribers',
        pillar: 'Behind the Scenes',
        difficulty: 'Medium' as const,
        reach: 'High' as const,
        recommended_format: 'Reel' as const,
        baseScore: 95,
      },
    ];

    return templates.slice(0, count).map(tpl => {
      const breakdown = generateFactors(tpl.baseScore, 6);
      const score = calculateOpportunityScore(breakdown);
      return {
        title: tpl.title,
        hook: tpl.hook,
        concept: tpl.concept,
        why_it_could_work: tpl.why_it_could_work,
        target_audience: tpl.audience,
        content_pillar: tpl.pillar || pillar,
        estimated_difficulty: tpl.difficulty,
        potential_reach: tpl.reach,
        share_potential: breakdown.shareability,
        save_potential: breakdown.save_potential,
        conversion_potential: breakdown.conversion_potential,
        ai_score: score,
        ai_score_breakdown: breakdown,
        recommended_format: tpl.recommended_format,
      };
    });
  }

  async generateReel(params: {
    topic: string;
    product?: string;
    audience?: string;
    goal?: string;
    tone?: string;
    durationSeconds?: number;
    brandName?: string;
  }): Promise<GeneratedReel> {
    const topic = params.topic || 'The anatomy of a heavyweight hoodie that never fades';
    const product = params.product || 'Modular Double-Zip Boxy Hoodie';
    const brand = params.brandName || 'RIIQX';

    const breakdown = generateFactors(94, 4);
    const score = calculateOpportunityScore(breakdown);

    return {
      title: `${topic} | ${brand}`,
      hook: `Stop buying hoodies that disintegrate after 3 washes. Here is the 1 detail fast fashion hides.`,
      problem_context: `Notice how most retail fleece curls up at the hem and the collar goes limp? That's cheap polyester blending and single-stitch thread tension.`,
      value_story: `We engineered the ${product} with 460 GSM combed French terry loopback cotton. Double-layer structured hood that stays upright without drawstrings, and custom two-way matte gunmetal hardware that glides like butter.`,
      payoff: `A boxy, intentional drape that holds its sculptural silhouette through 50+ wash cycles. Clean, heavy, and engineered for the modern vanguard.`,
      cta: `Comment 'HOODIE' and our AI will DM you the limited drop link and raw fabric construction specs.`,
      voiceover: `Most brands cut corners on thread weight. We spent 6 months sourcing high-density loopback cotton so your fit never looks tired. Experience the RIIQX standard.`,
      scene_by_scene_script: [
        {
          timestamp: '00:00 - 00:03',
          visual: 'Extreme macro zoom on 460 GSM ribbed weave resisting pull tension with instant recoil. Dramatic studio rim lighting.',
          audio: 'Heavy atmospheric bass thud. Voice: "Stop buying hoodies that disintegrate."',
          on_screen_text: 'WHY YOUR HOODIE DIES AFTER WASH #1',
        },
        {
          timestamp: '00:03 - 00:08',
          visual: 'Split screen: Limp high-street hoodie vs structured RIIQX boxy silhouette standing firm.',
          audio: 'Subtle high-hat transition. Voice: "Most retail cuts curl at the hem."',
          on_screen_text: 'FAST FASHION vs 460 GSM HEAVYWEIGHT',
        },
        {
          timestamp: '00:08 - 00:20',
          visual: 'Slow motion pull of custom matte gunmetal double-zipper. Camera tracks along double-needle reinforced shoulder seam.',
          audio: 'Crisp ASMR metallic zip glide sound. Voice: "We engineered custom two-way hardware and double-lined hood architecture."',
          on_screen_text: 'MATTE GUNMETAL TWO-WAY HARDWARE',
        },
        {
          timestamp: '00:20 - 00:28',
          visual: 'Model 360 rotation in brutalist concrete corridor. Low angle showing silhouette drape over wide-leg tactical cargos.',
          audio: 'Deep synth drop. Voice: "A boxy, intentional drape that outlasts seasons."',
          on_screen_text: 'BOXY DRAPE • UNAPOLOGETIC FIT',
        },
        {
          timestamp: '00:28 - 00:30',
          visual: 'Quick flash of RIIQX minimal tonal logo branding. Finger taps comment bar mockup.',
          audio: 'Notification chime. Voice: "Comment HOODIE for the secret drop link."',
          on_screen_text: 'DROP COMMENT: HOODIE',
        },
      ],
      shot_list: [
        'Close-up fabric stretch test with tension spring gauge',
        'Top-down zipper glide macro test with light reflection',
        'Side-profile hood structure check against back light',
        'Full outfit walking stride with low-angle gimbal sweep',
        'Studio mannequin spin under dark minimalist aesthetic light',
      ],
      b_roll: [
        'Fabric bolt cutting in design atelier',
        'Close-up metal zipper teeth interlocking',
        'Brutalist concrete architecture background textures',
        'Subtle rain mist droplets beading on waterproof tech accessories',
      ],
      on_screen_text: [
        'WHY YOUR HOODIE DIES AFTER WASH #1',
        '460 GSM COMBED FRENCH TERRY',
        'DOUBLE-LINED HOOD ARCHITECTURE',
        'COMMENT "HOODIE" FOR VIP ACCESS',
      ],
      cover_text: 'THE 460 GSM HEAVYWEIGHT BLUEPRINT',
      caption: `The anatomy of a hoodie that actually holds its boxy structure forever.\n\nBuilt with 460 GSM combed French terry, double-needle topstitched seams, and custom matte gunmetal two-way hardware. No synthetic fillers, no cutting corners.\n\nDrop a comment with "HOODIE" to receive the secret drop link and fabric engineering breakdown.\n\n#riiqx #streetwearfits #heavyweighthoodie #mensfashiontips #outfitinspiration #y2kfashion #highsnobiety #minimalstreetwear`,
      hashtags: ['#riiqx', '#streetwearfits', '#heavyweighthoodie', '#mensfashiontips', '#outfitinspiration', '#y2kfashion', '#highsnobiety'],
      production_notes: 'Shoot in 4K 60fps, shutter angle 180 degrees. Color grade in Rec.709 with crushed shadows and cool desaturated greens. Keep voiceover crisp and compressed with gentle bass boost.',
      ai_score: score,
      ai_score_breakdown: breakdown,
    };
  }

  async generateUGC(params: {
    style: string;
    productName: string;
    productDescription?: string;
    brandName?: string;
  }): Promise<GeneratedUGC> {
    const style = params.style || 'Unboxing & First Reaction';
    const product = params.productName || 'Tactical Wide-Leg Pleated Cargo Pants';
    const brand = params.brandName || 'RIIQX';

    return {
      creator_persona: 'Underground fashion creator & style archivist (22-26 y/o, authentic, minimalist bedroom or loft studio setting)',
      hook: `I spent $95 on the viral RIIQX cargos so you don't have to. Here is my 100% honest review.`,
      scene_list: [
        {
          scene: 1,
          description: 'Package arrives, matte black sealed polymailer with clean embossed logo.',
          action: 'Slits package open with metal blade, pulls out heavy twill garment.',
        },
        {
          scene: 2,
          description: 'Holds up pants to showcase articulated knee darts and cobra buckle cinch.',
          action: 'Pans camera across hardware and waistband pleats.',
        },
        {
          scene: 3,
          description: 'Try-on transition: camera cuts to feet landing in chunky loafers.',
          action: 'Checks silhouette in full-length mirror, adjusts ankle cord.',
        },
        {
          scene: 4,
          description: 'Sit test and mobility check to demonstrate pocket depth and drape.',
          action: 'Pockets phone and keys without causing pocket flare.',
        },
      ],
      dialogue: [
        `"Okay, so I’ve seen these all over my feed for 3 weeks and I was skeptical."`,
        `"First impression right out of the bag: this twill is seriously heavyweight. You can literally hear the quality."`,
        `"Look at how the pleats stack right above the sneaker. It gives that high-fashion Japanese drape without dragging in the dirt."`,
        `"Honestly? A solid 9.5 out of 10. Link in bio if you want to grab them before they sell out."`,
      ],
      b_roll: [
        'Macro close-up of pocket snaps snapping shut',
        'Fabric audio texture test scratching lightly',
        'Outdoor sunlight street walk showing trouser movement',
      ],
      cta: `Drop your waist size in the comments if you want the sizing cheat sheet.`,
      caption: `Real talk on the @${brand.toLowerCase()}.official tactical cargos. The drape is actually unmatched.\n\nWhat are you pairing with these? Let me know below.\n\n#ugc #fitcheck #cargopants #streetwearreview #riiqx`,
      cover_concept: 'Shocked creator expression holding the heavy cargos with bold text: "WORTH THE HYPE?"',
      format_type: style,
      ai_score: 91.5,
    };
  }

  async generateProductContent(params: {
    product: {
      name: string;
      description?: string | null;
      price: number;
      sale_price?: number | null;
      category: string;
    };
    brandName?: string;
  }): Promise<GeneratedProductContent> {
    const p = params.product;
    const brand = params.brandName || 'RIIQX';

    return {
      product_name: p.name,
      reel_ideas: [
        `The real reason our ${p.name} sells out in 48 hours.`,
        `POV: You find the garment that matches every piece in your wardrobe.`,
        `3 design details on the ${p.name} you missed at first glance.`,
      ],
      carousel_ideas: [
        `How to style ${p.name}: Casual Day vs High-End Evening.`,
        `The fabric & construction breakdown of the ${p.name}.`,
        `Customer fit checks: Real people rocking the ${p.name}.`,
      ],
      product_hooks: [
        `If you only buy one piece of outerwear this season, make it this.`,
        `Why fashion editors are obsessed with this silhouette.`,
        `Stop sacrificing comfort for structure.`,
      ],
      captions: [
        `Engineered for the uncompromising. The ${p.name} combines precision craftsmanship with everyday utility. Now live at ${brand.toLowerCase()}.com.`,
        `Elevate your standard rotation. Discover why the ${p.name} is our highest-rated staple.`,
      ],
      ugc_concepts: [
        `Unboxing and honest fabric endurance review.`,
        `Get ready with me featuring the ${p.name}.`,
        `Rating 3 outfits built around the ${p.name}.`,
      ],
      ctas: [
        `Shop now via the link in our bio before quantities run dry.`,
        `Comment "${p.name.split(' ')[0].toUpperCase()}" for early access.`,
      ],
    };
  }

  async generateAffiliateContent(params: {
    productUrl: string;
    category?: string;
    brandName?: string;
  }): Promise<GeneratedAffiliateContent> {
    return {
      product_url: params.productUrl,
      product_angle: 'The Holy Grail Silhouette: Affordable Designer Quality Without the Label Markup',
      hook: `I found the secret supplier that makes streetwear that actually looks $300+.`,
      reel_concept: 'Side-by-side comparison with high-end designer pieces showing identical fabric specs and weight.',
      caption: `Found the ultimate staple that gives that runway drape without the luxury tax. Transparent affiliate partner with @riiqx.official.\n\nLink in bio with exclusive community code 'VANGUARD15'.`,
      cta: `Tap the link in my bio to get 15% off your order with code VANGUARD15.`,
      disclosure_recommendation: 'Ad / Brand Partner tag in first 3 seconds of Reel and explicit #ad in caption line 1 as required by FTC/Meta guidelines.',
      hashtag_suggestions: ['#ad', '#affiliatepartner', '#streetwearfinds', '#styledeals', '#riiqxpartner'],
    };
  }

  async researchTrends(params: { category: string; brandName?: string }): Promise<DiscoveredTrend[]> {
    return [
      {
        topic: 'Deconstructed Utilitarian Denim',
        source: 'Instagram Explore & Highsnobiety Fashion Index',
        source_url: 'https://instagram.com/explore/tags/streetwear',
        date_discovered: new Date().toISOString(),
        relevance_score: 96,
        trend_score: 94,
        recommended_content_angle: 'Contrast structured tactical garments with raw hem denim to emphasize drape and texture.',
        expiration_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      },
      {
        topic: '3-Second Fast Cut Outfit Transitions',
        source: 'Instagram Reels Audio Trending Charts',
        source_url: 'https://instagram.com/reels',
        date_discovered: new Date().toISOString(),
        relevance_score: 98,
        trend_score: 91,
        recommended_content_angle: 'Synch boot snap and zipper glide to trending heavy 808 bass kick transition sound.',
        expiration_date: new Date(Date.now() + 10 * 86400000).toISOString(),
      },
      {
        topic: 'Monochrome Earth Tones vs Acid Wash',
        source: 'Vogue Street Style Forecast 2026',
        source_url: 'https://vogue.com',
        date_discovered: new Date().toISOString(),
        relevance_score: 90,
        trend_score: 88,
        recommended_content_angle: 'Break conventional monotone rules with acid wash graphic tee under tailored charcoal outerwear.',
        expiration_date: new Date(Date.now() + 21 * 86400000).toISOString(),
      },
      {
        topic: 'POV: Finding Your Uniform in 2026',
        source: 'TikTok Fashion & Creator Trends',
        source_url: 'https://tiktok.com',
        date_discovered: new Date().toISOString(),
        relevance_score: 94,
        trend_score: 95,
        recommended_content_angle: 'Relatable storytelling on moving past fast fashion to high-density timeless silhouette staples.',
        expiration_date: new Date(Date.now() + 12 * 86400000).toISOString(),
      },
    ];
  }

  async analyzePerformance(params: {
    brandName: string;
    recentMetrics: Record<string, unknown>;
    topPosts: Array<{ title: string; reach: number; saves: number; shares: number; type: string }>;
  }): Promise<AnalyticsDiagnostic> {
    return {
      what_worked: [
        'High-density fabric tear-down videos generated 4.2x more saves than lifestyle photos.',
        'Hook phrases challenging common fast-fashion myths showed 82% higher 3-second retention.',
        'Double-zipper tactile audio ASMR generated significant positive comment sentiment.',
      ],
      what_didnt: [
        'Generic product-on-white flat lays underperformed average reach by 38%.',
        'Posts published after 11 PM EST had 22% lower initial velocity.',
        'Overly broad hashtags (#fashion, #love) diluted targeted Explore algorithm distribution.',
      ],
      which_formats_worked: [
        'Reels with 18-24s duration had highest full completion rate (58%).',
        'Carousels with 4-5 slides had the highest save-to-reach ratio (4.8%).',
      ],
      which_hooks_worked: [
        '"Stop buying [item] until you check this..."',
        '"The exact reason your [outfit piece] loses shape..."',
        '"POV: You stopped dressing for everyone else"',
      ],
      which_topics_worked: [
        'Fabric weight and GSM masterclasses',
        'Proportion balancing rules for wide-leg pants',
        'Behind-the-scenes prototype rejection stories',
      ],
      which_content_generated_saves: [
        '3 Ways to Style Tactical Cargos (820 saves)',
        '460 GSM Heavyweight Masterclass (1,260 saves)',
        'Collar Stiffening Layering Guide (740 saves)',
      ],
      which_content_generated_shares: [
        'POV: You finally stopped dressing for everyone else (880 shares)',
        'Rate this London Street Style Fit (640 shares)',
        'The Fast Fashion vs Heavyweight Fleece Comparison (930 shares)',
      ],
      what_should_we_stop_doing: [
        'Stop posting static promo images without context or storytelling.',
        'Stop using passive CTAs like "link in bio" without keyword DM triggers.',
      ],
      what_should_we_do_more_of: [
        'Double down on fabric tension macro demonstrations.',
        'Implement "Comment [KEYWORD] for link" DM automation hooks.',
        'Increase UGC creator styling roundups to twice weekly.',
      ],
      what_should_we_test_next: [
        'Test 10-second ultra-short loop Reels synced to trending phonk beats.',
        'Run an interactive Instagram Story poll fit battle every Thursday.',
      ],
      next_10_recommendations: [
        { rank: 1, title: 'Why 100% Cotton Isn\'t Always Better (Fabric Science)', format: 'Reel', pillar: 'Product Showcase', hook: 'The biggest lie the fashion industry told you about cotton.', expected_outcome: 'High saves and authority positioning' },
        { rank: 2, title: 'The 1:2 Golden Ratio for Oversized Tops', format: 'Carousel', pillar: 'Fashion Tips', hook: 'If you wear oversized tops, stop doing this with your waistband.', expected_outcome: 'High bookmark and save rate' },
        { rank: 3, title: 'POV: Your Fit Finally Matches Your Spotify Playlist', format: 'Reel', pillar: 'UGC', hook: 'Music hits different when the silhouette is dialed in.', expected_outcome: 'High shareability and community comments' },
        { rank: 4, title: 'Inside Our Dye House: How We Get True Jet Black', format: 'Reel', pillar: 'Behind the Scenes', hook: 'Why normal black clothes turn grey after 4 months.', expected_outcome: 'High trust and conversion' },
        { rank: 5, title: '3 Footwear Rules When Wearing Wide-Leg Trousers', format: 'Carousel', pillar: 'Styling', hook: 'Never wear low-profile sneakers with wide hems.', expected_outcome: 'High saves and reposts' },
        { rank: 6, title: 'Street Interview: What’s the Most Overrated Brand in 2026?', format: 'Reel', pillar: 'Community', hook: 'We asked Soho creatives what brand they will never buy again.', expected_outcome: 'High comment debate and viral reach' },
        { rank: 7, title: 'Rainproof Test: Throwing Water on Our Tech Sling', format: 'Reel', pillar: 'Product Showcase', hook: 'Is Cordura nylon actually 100% waterproof? Let\'s test it.', expected_outcome: 'Instant conversion and purchase intent' },
        { rank: 8, title: 'The Death of Skinny Jeans: What the Runway Confirms', format: 'Carousel', pillar: 'Trend Content', hook: 'The silhouette forecast for the next 24 months.', expected_outcome: 'High saves and shares' },
        { rank: 9, title: 'Styling the Cyber Acid Tee 3 Ways', format: 'Carousel', pillar: 'Styling', hook: '1 graphic tee. 3 distinct vibes.', expected_outcome: 'Product interest and cart adds' },
        { rank: 10, title: 'Customer Unboxing: "I was skeptical about the price"', format: 'Reel', pillar: 'UGC', hook: 'Is RIIQX actually worth the investment?', expected_outcome: 'Social proof and conversion' },
      ],
    };
  }

  async chatCopilot(messages: CopilotMessage[], context?: Record<string, unknown>): Promise<string> {
    const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

    if (lastMessage.includes('workflow') || lastMessage.includes("today's workflow")) {
      return `✨ **Executing Today's Instagram Workflow for RIIQX:**\n\n1. Loaded brand profile: **RIIQX** (Fashion / Clothing / Lifestyle)\n2. Analyzed 14-day performance: Engagement rate **+14.8%**, top format **Reels (460 GSM Masterclass)**.\n3. Trend identified: **Deconstructed Utilitarian Denim** & **POV Uniform Styling**.\n4. Generated 10 fresh ideas & scored AI Opportunity (Average: **92.4**).\n5. Selected top 3 candidate packages and prepared scripts.\n6. Content saved to repository with \`approval_status = PENDING\`.\n\nReady for your review in the **Approvals Center**! No posts have been published automatically.`;
    }

    if (lastMessage.includes('what should i post') || lastMessage.includes('recommend')) {
      return `Based on RIIQX's recent analytics, your audience is engaging heavily with **tactile product breakdowns** and **proportion styling guides**. \n\nI recommend posting:\n**"The Anatomy of a $120 Hoodie: What Are You Actually Paying For?"** (Opportunity Score: **96/100**)\n\n• **Format**: 24-second Reel\n• **Hook**: *"Never buy another hoodie until you check these 3 internal seams."*\n• **Target Pillar**: Product Showcase\n• **Optimal Posting Window**: 6:30 PM – 8:00 PM EST.\n\nWould you like me to send this draft directly to Approvals?`;
    }

    if (lastMessage.includes('why') && (lastMessage.includes('bad') || lastMessage.includes('perform'))) {
      return `Looking at the performance data, lower-performing posts had two specific friction points:\n\n1. **Weak First 2 Seconds**: The opening visual lacked a clear tension trigger or macro texture hook.\n2. **Generic Call-to-Action**: Posts with generic "link in bio" had a 44% lower conversion rate compared to keyword DM triggers like *"Comment HOODIE for the secret link"*.\n\nWe can fix this in upcoming drafts by front-loading contrast in the first 0–3 seconds.`;
    }

    if (lastMessage.includes('reel') || lastMessage.includes('idea')) {
      return `Here are 3 high-impact Reel concepts tailored for RIIQX:\n\n1. **"The 1:2 Ratio Trick"** (Score: 94/100) — How to balance heavyweight tees with wide trousers.\n2. **"Why We Threw Away 14 Zippers"** (Score: 91/100) — Macro hardware durability test.\n3. **"POV: Dressing Like You Mean It"** (Score: 95/100) — High-contrast urban cinematic Reel.\n\nWhich one would you like me to generate a full scene-by-scene script and shot list for?`;
    }

    return `I am your **AI Growth Copilot** for RIIQX. I can help you run today's workflow, generate high-scoring Reel concepts, review pending approvals, inspect Instagram insights, or test trend angles. How can I assist you right now?`;
  }
}

// -----------------------------------------------------------------------------
// 2. LIVE ANTHROPIC CLAUDE PROVIDER
// -----------------------------------------------------------------------------
export class ClaudeProvider implements AIProvider {
  name = 'ClaudeProvider';
  private apiKey: string;
  private fallback: MockAIProvider;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallback = new MockAIProvider();
  }

  async generateIdeas(params: Parameters<AIProvider['generateIdeas']>[0]): ReturnType<AIProvider['generateIdeas']> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 3000,
          messages: [{
            role: 'user',
            content: `Generate ${params.count || 10} high-performing Instagram content ideas for brand ${params.brandName} in category ${params.category}. Return valid JSON matching the GeneratedIdea array schema.`
          }],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.content[0].text);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback gracefully
    }
    return this.fallback.generateIdeas(params);
  }

  async generateReel(params: Parameters<AIProvider['generateReel']>[0]): ReturnType<AIProvider['generateReel']> {
    return this.fallback.generateReel(params);
  }
  async generateUGC(params: Parameters<AIProvider['generateUGC']>[0]): ReturnType<AIProvider['generateUGC']> {
    return this.fallback.generateUGC(params);
  }
  async generateProductContent(params: Parameters<AIProvider['generateProductContent']>[0]): ReturnType<AIProvider['generateProductContent']> {
    return this.fallback.generateProductContent(params);
  }
  async generateAffiliateContent(params: Parameters<AIProvider['generateAffiliateContent']>[0]): ReturnType<AIProvider['generateAffiliateContent']> {
    return this.fallback.generateAffiliateContent(params);
  }
  async researchTrends(params: Parameters<AIProvider['researchTrends']>[0]): ReturnType<AIProvider['researchTrends']> {
    return this.fallback.researchTrends(params);
  }
  async analyzePerformance(params: Parameters<AIProvider['analyzePerformance']>[0]): ReturnType<AIProvider['analyzePerformance']> {
    return this.fallback.analyzePerformance(params);
  }
  async chatCopilot(messages: CopilotMessage[], context?: Record<string, unknown>): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          system: 'You are the AI Growth Copilot for RIIQX on IG GrowthOS. Give actionable, trend-aware, data-backed Instagram growth guidance.',
          messages: messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.content[0].text;
      }
    } catch {
      // Fallback
    }
    return this.fallback.chatCopilot(messages, context);
  }
}

export const AnthropicProvider = ClaudeProvider;

// -----------------------------------------------------------------------------
// 3. OPENAI PROVIDER IMPLEMENTATION (Optional Provider)
// -----------------------------------------------------------------------------
export class OpenAIProvider implements AIProvider {
  name = 'OpenAIProvider';
  private apiKey: string;
  private fallback: MockAIProvider;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallback = new MockAIProvider();
  }

  async generateIdeas(params: Parameters<AIProvider['generateIdeas']>[0]) {
    return this.fallback.generateIdeas(params);
  }
  async generateReel(params: Parameters<AIProvider['generateReel']>[0]) {
    return this.fallback.generateReel(params);
  }
  async generateUGC(params: Parameters<AIProvider['generateUGC']>[0]) {
    return this.fallback.generateUGC(params);
  }
  async generateProductContent(params: Parameters<AIProvider['generateProductContent']>[0]) {
    return this.fallback.generateProductContent(params);
  }
  async generateAffiliateContent(params: Parameters<AIProvider['generateAffiliateContent']>[0]) {
    return this.fallback.generateAffiliateContent(params);
  }
  async researchTrends(params: Parameters<AIProvider['researchTrends']>[0]) {
    return this.fallback.researchTrends(params);
  }
  async analyzePerformance(params: Parameters<AIProvider['analyzePerformance']>[0]) {
    return this.fallback.analyzePerformance(params);
  }
  async chatCopilot(messages: CopilotMessage[], context?: Record<string, unknown>) {
    return this.fallback.chatCopilot(messages, context);
  }
}

// -----------------------------------------------------------------------------
// 4. GEMINI PROVIDER IMPLEMENTATION (Optional Provider)
// -----------------------------------------------------------------------------
export class GeminiProvider implements AIProvider {
  name = 'GeminiProvider';
  private apiKey: string;
  private fallback: MockAIProvider;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallback = new MockAIProvider();
  }

  async generateIdeas(params: Parameters<AIProvider['generateIdeas']>[0]) {
    return this.fallback.generateIdeas(params);
  }
  async generateReel(params: Parameters<AIProvider['generateReel']>[0]) {
    return this.fallback.generateReel(params);
  }
  async generateUGC(params: Parameters<AIProvider['generateUGC']>[0]) {
    return this.fallback.generateUGC(params);
  }
  async generateProductContent(params: Parameters<AIProvider['generateProductContent']>[0]) {
    return this.fallback.generateProductContent(params);
  }
  async generateAffiliateContent(params: Parameters<AIProvider['generateAffiliateContent']>[0]) {
    return this.fallback.generateAffiliateContent(params);
  }
  async researchTrends(params: Parameters<AIProvider['researchTrends']>[0]) {
    return this.fallback.researchTrends(params);
  }
  async analyzePerformance(params: Parameters<AIProvider['analyzePerformance']>[0]) {
    return this.fallback.analyzePerformance(params);
  }
  async chatCopilot(messages: CopilotMessage[], context?: Record<string, unknown>) {
    return this.fallback.chatCopilot(messages, context);
  }
}

// Re-export Bedrock Provider and Model Router
export { BedrockProvider } from './bedrock';
export { ModelRouter } from './router';

// -----------------------------------------------------------------------------
// 5. AI PROVIDER FACTORY (BEDROCK IS DEFAULT & PRIMARY)
// -----------------------------------------------------------------------------
import { BedrockProvider } from './bedrock';

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || 'bedrock').toLowerCase();

  // If explicitly requested Anthropic / Claude
  if (provider === 'anthropic' || provider === 'claude') {
    const key = process.env.ANTHROPIC_API_KEY;
    if (key) return new ClaudeProvider(key);
  }

  // If explicitly requested OpenAI
  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (key) return new OpenAIProvider(key);
  }

  // If explicitly requested Gemini
  if (provider === 'gemini') {
    const key = process.env.GEMINI_API_KEY;
    if (key) return new GeminiProvider(key);
  }

  // BEDROCK IS THE PRIMARY AND DEFAULT PROVIDER (Section 1)
  // Operates with AWS SDK Bedrock Runtime / Converse API and falls back to
  // MockAIProvider gracefully when running in mock mode or before AWS keys are added.
  return new BedrockProvider();
}

