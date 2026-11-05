// =============================================================================
// GlowFit AI / RIIQX — Dropshipping Product to AI Video Ad Project Bridge
// Route: POST /api/shopping/dropshipping/create-video-ad
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DROPSHIPPING_CATALOG } from '@/services/shopping/catalog';

const RAW_DIR = path.join(process.cwd(), 'AI Video Editor', 'Raw');

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    const product = DROPSHIPPING_CATALOG.find((p) => p.id === productId) || DROPSHIPPING_CATALOG[0];

    const safeTitle = product.title.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 35);
    const projectDirName = `${safeTitle} Ad Launch`;
    const projectPath = path.join(RAW_DIR, projectDirName);

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    const adNotes = {
      projectId: `proj_ad_${Date.now()}`,
      title: `${product.title} — Viral Dropshipping Ad`,
      targetPlatform: 'Instagram Reels / TikTok / YouTube Shorts',
      aspectRatio: '9:16',
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      status: 'ready_to_edit',
      brandKitRef: 'Brand Kit/brand-kit.md',
      productInfo: {
        id: product.id,
        supplierPrice: product.supplierPrice,
        sellingPrice: product.suggestedSellingPrice,
        profitMarginPct: product.profitMarginPct,
      },
      beats: [
        {
          beatNumber: 1,
          timecode: '00:00 - 00:02.0',
          durationSeconds: 2.0,
          speechTranscript: product.readyAdHooks[0] || 'You will not believe how game-changing this product is!',
          visualDirection: `Extreme 1.1x punch-in on problem scenario, fast cut to ${product.title} beauty shot with neon glow.`,
          captions: product.readyAdHooks[0] || 'STOP paying full price!',
          captionStyle: { highlightColor: '#FFD43B', animation: 'pop_bounce' },
          bRoll: 'problem_scenario_hook.mp4',
          assets: ['warning_icon.png', 'whoosh_sfx.wav'],
          approval: 'approved',
        },
        {
          beatNumber: 2,
          timecode: '00:02.0 - 00:05.5',
          durationSeconds: 3.5,
          speechTranscript: `Meet the ${product.title}. It features ${product.description.slice(0, 90)}...`,
          visualDirection: '360 rotating 3D product view with glowing feature callout pills.',
          captions: 'Engineered for MAXIMUM performance.',
          captionStyle: { highlightColor: '#06B6D4', animation: 'karaoke_flow' },
          bRoll: 'product_360_rotate.mp4',
          assets: ['spec_pill.png', 'digital_click.wav'],
          approval: 'approved',
        },
        {
          beatNumber: 3,
          timecode: '00:05.5 - 00:08.5',
          durationSeconds: 3.0,
          speechTranscript: `Get yours today for just ₹${product.suggestedSellingPrice.toLocaleString('en-IN')} with instant free shipping and cash on delivery!`,
          visualDirection: `Price tag reveal with glowing green slash badge from original MRP to ₹${product.suggestedSellingPrice.toLocaleString('en-IN')}.`,
          captions: `Only ₹${product.suggestedSellingPrice.toLocaleString('en-IN')} — Limited Stock!`,
          captionStyle: { highlightColor: '#10B981', animation: 'pop_bounce' },
          bRoll: 'unboxing_lifestyle.mp4',
          assets: ['price_badge.png', 'cash_register.wav'],
          approval: 'approved',
        },
        {
          beatNumber: 4,
          timecode: '00:08.5 - 00:11.0',
          durationSeconds: 2.5,
          speechTranscript: 'Tap the link in bio or order now before stock runs out!',
          visualDirection: 'Animated CTA arrow pointing down to link in bio with pulsing order button.',
          captions: 'TAP LINK IN BIO TO ORDER NOW!',
          captionStyle: { highlightColor: '#FFD43B', animation: 'pulse' },
          bRoll: 'outro_lifestyle.mp4',
          assets: ['cta_arrow.png', 'riser_braam.wav'],
          approval: 'approved',
        },
      ],
      creatorFeedbackNotes: 'High-converting dropshipping template pre-loaded with viral pacing rules.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const notesPath = path.join(projectPath, 'notes.json');
    fs.writeFileSync(notesPath, JSON.stringify(adNotes, null, 2), 'utf8');

    const readmePath = path.join(projectPath, 'README.md');
    fs.writeFileSync(
      readmePath,
      `# ${product.title} — Video Ad Project\n- Status: Ready to edit in Storyboard Dashboard\n- Margin: ${product.profitMarginPct.toFixed(1)}%\n- Duration: 11.0s\n`,
      'utf8'
    );

    return NextResponse.json({
      success: true,
      message: `Created Video Ad project in AI Video Editor/Raw/${projectDirName}`,
      projectDirName,
      adNotes,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

