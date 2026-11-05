// =============================================================================
// GlowFit AI / RIIQX — Dropshipping Product to AI Video Ad Project Bridge
// Route: POST & GET /api/shopping/dropshipping/create-video-ad
// 1-Click Dropshipping Ad Generation • 4-Beat Storyboard • Brand Kit Sync • Affiliate Link
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DROPSHIPPING_CATALOG } from '@/services/shopping/catalog';
import { CommerceService } from '@/services/shopping/commerce-service';
import { AffiliateReferralService } from '@/services/shopping/affiliate-referral';

const RAW_DIR = path.join(process.cwd(), 'AI Video Editor', 'Raw');
const BRAND_KIT_PATH = path.join(process.cwd(), 'AI Video Editor', 'Brand Kit', 'brand-kit.md');

export async function GET() {
  try {
    if (!fs.existsSync(RAW_DIR)) {
      fs.mkdirSync(RAW_DIR, { recursive: true });
    }

    const entries = fs.readdirSync(RAW_DIR, { withFileTypes: true });
    const projects: any[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const notesPath = path.join(RAW_DIR, entry.name, 'notes.json');
        if (fs.existsSync(notesPath)) {
          try {
            const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));
            projects.push({
              folderName: entry.name,
              title: notes.title,
              status: notes.status,
              productId: notes.productInfo?.id,
              sellingPrice: notes.productInfo?.sellingPrice,
              profitMarginPct: notes.productInfo?.profitMarginPct,
              beatsCount: notes.beats?.length || 0,
              referralUrl: notes.affiliate?.canonicalReferralUrl,
              createdAt: notes.createdAt,
            });
          } catch {}
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalProjects: projects.length,
      projects,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      productId,
      productName,
      price,
      imageUrl,
      features,
      creatorId = 'creator_studio_01',
      customAngle,
    } = body;

    // 1. Resolve product from CommerceService or DROPSHIPPING_CATALOG or custom request
    let resolvedProduct: {
      id: string;
      title: string;
      description: string;
      sellingPrice: number;
      supplierPrice: number;
      profitMarginPct: number;
      imageUrl: string;
      readyAdHooks: string[];
      category: string;
    };

    const commerceProduct = productId
      ? CommerceService.getProductById(productId)
      : productName
      ? CommerceService.listProducts({ limit: 50 }).products.find(
          (p) => p.title.toLowerCase().includes(productName.toLowerCase()) || productName.toLowerCase().includes(p.title.toLowerCase())
        )
      : null;

    if (commerceProduct) {
      const sellingPrice = commerceProduct.currentPrice;
      const supplierPrice = commerceProduct.supplierCost || Math.round(sellingPrice * 0.45);
      const profitMarginPct = Math.round(((sellingPrice - supplierPrice) / sellingPrice) * 1000) / 10;
      resolvedProduct = {
        id: commerceProduct.id,
        title: commerceProduct.title,
        description: commerceProduct.description,
        sellingPrice,
        supplierPrice,
        profitMarginPct,
        imageUrl: commerceProduct.images?.[0] || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
        readyAdHooks: commerceProduct.readyAdHooks?.length
          ? commerceProduct.readyAdHooks
          : [
              `Stop scrolling! The ${commerceProduct.title} is an absolute viral game-changer.`,
              `Why is everyone online buying this right now? Here's the truth.`,
              `I tested this so you don't have to — and honestly, I was stunned.`,
            ],
        category: commerceProduct.category,
      };
    } else if (productId) {
      const dropItem =
        DROPSHIPPING_CATALOG.find((p) => p.id === productId) || DROPSHIPPING_CATALOG[0];
      resolvedProduct = {
        id: dropItem.id,
        title: dropItem.title,
        description: dropItem.description,
        sellingPrice: dropItem.suggestedSellingPrice,
        supplierPrice: dropItem.supplierPrice,
        profitMarginPct: dropItem.profitMarginPct,
        imageUrl: dropItem.imageUrl,
        readyAdHooks: dropItem.readyAdHooks || [
          'Stop scrolling! This product is taking over the internet.',
        ],
        category: dropItem.category,
      };
    } else if (productName) {
      const numericPrice = typeof price === 'number' ? price : parseInt(String(price).replace(/[^0-9]/g, '')) || 2499;
      const supplierPrice = Math.round(numericPrice * 0.45);
      const profitMarginPct = Math.round(((numericPrice - supplierPrice) / numericPrice) * 1000) / 10;
      resolvedProduct = {
        id: `custom_${Date.now().toString(36)}`,
        title: productName,
        description: Array.isArray(features) ? features.join('. ') : `Premium high-performance ${productName}.`,
        sellingPrice: numericPrice,
        supplierPrice,
        profitMarginPct,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
        readyAdHooks: [
          `Stop scrolling! The ${productName} is an absolute viral game-changer.`,
          `Here is why creators and tech lovers are obsessed with the ${productName}.`,
        ],
        category: body.category || 'Lifestyle & Tech',
      };
    } else {
      const defaultProd = CommerceService.listProducts({ limit: 1 }).products[0];
      const sellingPrice = defaultProd?.currentPrice || 2499;
      const supplierPrice = defaultProd?.supplierCost || Math.round(sellingPrice * 0.45);
      resolvedProduct = {
        id: defaultProd?.id || 'prod_lumina_aura_01',
        title: defaultProd?.title || 'Lumina RGB Aura Smart Desk Lamp',
        description: defaultProd?.description || 'Smart ambient kinetic lamp.',
        sellingPrice,
        supplierPrice,
        profitMarginPct: 55.0,
        imageUrl: defaultProd?.images?.[0] || 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
        readyAdHooks: ['Stop scrolling! This lamp levitates in mid-air.'],
        category: defaultProd?.category || 'Home & Electronics',
      };
    }

    const safeTitle = resolvedProduct.title.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 35);
    const projectDirName = `${safeTitle} Ad Launch`;
    const projectPath = path.join(RAW_DIR, projectDirName);

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    // 2. Generate trackable Affiliate / Referral link for this product & video ad
    const affiliateLink = AffiliateReferralService.createReferralLink({
      creatorId,
      productId: resolvedProduct.id,
      campaignId: `vid_ad_${safeTitle.toLowerCase().replace(/\s+/g, '_')}`,
      customCommissionRatePct: 8.5,
    });

    const hookText = customAngle || resolvedProduct.readyAdHooks[0] || 'STOP scrolling! You need to see this.';

    // 3. 4-Beat Storyboard Construction adhering to viral short-form pacing
    const adNotes = {
      projectId: `proj_ad_${Date.now()}`,
      title: `${resolvedProduct.title} — Viral Dropshipping Ad`,
      targetPlatform: 'Instagram Reels / TikTok / YouTube Shorts',
      aspectRatio: '9:16',
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      status: 'ready_to_edit',
      brandKitRef: 'Brand Kit/brand-kit.md',
      productInfo: {
        id: resolvedProduct.id,
        supplierPrice: resolvedProduct.supplierPrice,
        sellingPrice: resolvedProduct.sellingPrice,
        profitMarginPct: resolvedProduct.profitMarginPct,
        imageUrl: resolvedProduct.imageUrl,
        category: resolvedProduct.category,
      },
      affiliate: {
        referralCode: affiliateLink.referralCode,
        canonicalReferralUrl: affiliateLink.canonicalReferralUrl,
        commissionRatePct: affiliateLink.commissionRatePct,
      },
      beats: [
        {
          beatNumber: 1,
          timecode: '00:00 - 00:03.0',
          durationSeconds: 3.0,
          speechTranscript: hookText,
          visualDirection: `Extreme 1.1x punch-in on problem scenario, fast cut to ${resolvedProduct.title} beauty shot with neon ambient glow.`,
          captions: hookText.slice(0, 40).toUpperCase(),
          captionStyle: { highlightColor: '#FFD43B', animation: 'pop_bounce' },
          bRoll: 'problem_scenario_hook.mp4',
          assets: ['warning_icon.png', 'whoosh_sfx.wav'],
          approval: 'approved',
        },
        {
          beatNumber: 2,
          timecode: '00:03.0 - 00:07.0',
          durationSeconds: 4.0,
          speechTranscript: `Meet the ${resolvedProduct.title}. ${resolvedProduct.description.slice(0, 85)}...`,
          visualDirection: '360 rotating 3D turntable perspective with floating cyan feature badges.',
          captions: 'ENGINEERED FOR MAXIMUM PERFORMANCE',
          captionStyle: { highlightColor: '#06B6D4', animation: 'karaoke_flow' },
          bRoll: 'product_360_rotate.mp4',
          assets: ['spec_pill.png', 'digital_click.wav'],
          approval: 'approved',
        },
        {
          beatNumber: 3,
          timecode: '00:07.0 - 00:11.0',
          durationSeconds: 4.0,
          speechTranscript: `Regular retail stores charge way more, but you can get it for only ₹${resolvedProduct.sellingPrice.toLocaleString('en-IN')} with instant free shipping!`,
          visualDirection: `Side-by-side price comparison graphic slashing high retail price down to ₹${resolvedProduct.sellingPrice.toLocaleString('en-IN')}.`,
          captions: `ONLY ₹${resolvedProduct.sellingPrice.toLocaleString('en-IN')} — LIMITED STOCK!`,
          captionStyle: { highlightColor: '#10B981', animation: 'pop_bounce' },
          bRoll: 'unboxing_lifestyle.mp4',
          assets: ['price_badge.png', 'cash_register.wav'],
          approval: 'approved',
        },
        {
          beatNumber: 4,
          timecode: '00:11.0 - 00:15.0',
          durationSeconds: 4.0,
          speechTranscript: 'Tap the link in bio or use code RIIQX10 to order yours now before it sells out!',
          visualDirection: 'Animated CTA arrow pointing down to link in bio with pulsing amber order button.',
          captions: 'TAP LINK IN BIO TO ORDER NOW!',
          captionStyle: { highlightColor: '#FFD43B', animation: 'pulse' },
          bRoll: 'outro_lifestyle.mp4',
          assets: ['cta_arrow.png', 'riser_braam.wav'],
          approval: 'approved',
        },
      ],
      creatorFeedbackNotes: 'High-converting dropshipping template pre-loaded with viral pacing rules and trackable affiliate link.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const notesPath = path.join(projectPath, 'notes.json');
    fs.writeFileSync(notesPath, JSON.stringify(adNotes, null, 2), 'utf8');

    const readmePath = path.join(projectPath, 'README.md');
    fs.writeFileSync(
      readmePath,
      `# ${resolvedProduct.title} — Video Ad Project\n- Status: Ready to edit in Storyboard Dashboard\n- Margin: ${resolvedProduct.profitMarginPct.toFixed(1)}%\n- Duration: 15.0s\n- Affiliate Code: \`${affiliateLink.referralCode}\`\n- Tracking URL: ${affiliateLink.canonicalReferralUrl}\n`,
      'utf8'
    );

    // Sync reference to Brand Kit if needed
    if (fs.existsSync(BRAND_KIT_PATH)) {
      const brandKitAppend = `\n<!-- Video Ad Generated: ${resolvedProduct.title} on ${new Date().toISOString()} -->\n`;
      fs.appendFileSync(BRAND_KIT_PATH, brandKitAppend, 'utf8');
    }

    return NextResponse.json({
      success: true,
      message: `Created Video Ad project in AI Video Editor/Raw/${projectDirName}`,
      projectDirName,
      projectTitle: projectDirName,
      adNotes,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
