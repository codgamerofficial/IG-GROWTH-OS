// =============================================================================
// RIIQX — Brand Intelligence Website Analyzer API Route
// POST /api/riiqx/brand/analyze
// =============================================================================

import { NextResponse } from 'next/server';
import { WebsiteAnalyzer } from '@/services/brand/website-analyzer';
import { BrandDNASynthesizer } from '@/services/brand/brand-dna-synthesizer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteUrl, brandName, businessDescription, targetAudience, logoUrl } = body;

    let websiteAnalysis = undefined;
    if (websiteUrl && websiteUrl.trim()) {
      try {
        websiteAnalysis = await WebsiteAnalyzer.analyzeWebsite(websiteUrl.trim());
      } catch (scrapeErr: any) {
        // If SSRF blocked, return clear 400 Bad Request
        if (scrapeErr.message.includes('SSRF Block')) {
          return NextResponse.json(
            {
              success: false,
              error: scrapeErr.message,
              securityWarning: 'Target URL resolved to a private or restricted network.',
            },
            { status: 400 }
          );
        }
        console.warn(`[BrandAnalyzeAPI] Scrape warning for ${websiteUrl}:`, scrapeErr.message);
      }
    }

    // Synthesize structured Brand DNA
    const brandDNA = await BrandDNASynthesizer.synthesizeBrandDNA({
      brandName,
      websiteAnalysis,
      businessDescription,
      targetAudience,
      logoUrl,
    });

    return NextResponse.json({
      success: true,
      brandDNA,
      websiteAnalysis: websiteAnalysis
        ? {
            domain: websiteAnalysis.domain,
            title: websiteAnalysis.title,
            colorsFound: websiteAnalysis.colors.length,
            fontsFound: websiteAnalysis.fonts,
            socialLinks: websiteAnalysis.socialLinks,
          }
        : null,
    });
  } catch (err: any) {
    console.error('[BrandAnalyzeAPI] Error synthesizing Brand DNA:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to synthesize Brand DNA.',
      },
      { status: 500 }
    );
  }
}

