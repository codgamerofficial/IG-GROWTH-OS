// =============================================================================
// RIIQX — Master Brand DNA Synthesizer & Guidelines Generator
// Grounded Synthesis • Observed vs Recommended Telemetry • Markdown & JSON Export
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { BrandDNA, BrandGuidelinesExport, WebsiteAnalysisResult } from './types';
import { AIServiceManager } from '../ai/ai-service-manager';
import { PromptTemplateEngine } from '../prompts/prompt-template-engine';

const BrandDNASchema = z.object({
  brandName: z.string().default('RIIQX Brand'),
  tagline: z.string().default('One Goal. An AI That Gets It Done.'),
  mission: z.string().default('Empowering creators with autonomous intelligence.'),
  description: z.string().default('High-impact creative operations.'),
  industry: z.string().default('AI & Creator Economy'),
  targetAudience: z.string().default('Modern digital creators and professionals'),
  customerPersonas: z.array(z.string()).default(['Digital Creator', 'Growth Operator']),
  brandPersonality: z.array(z.string()).default(['Visionary', 'Precise', 'Modern']),
  toneOfVoice: z.string().default('Confident, direct, empowering'),
  coreMessages: z.array(z.string()).default(['Scale creative output with autonomous AI.']),
  colorPalette: z
    .object({
      primary: z.string().default('#FFD43B'),
      secondary: z.string().default('#202124'),
      accent: z.string().default('#06B6D4'),
      background: z.string().default('#0C0C0E'),
      neutral: z.string().default('#FFFFFF'),
      additional: z.array(z.string()).optional().default([]),
    })
    .default({
      primary: '#FFD43B',
      secondary: '#202124',
      accent: '#06B6D4',
      background: '#0C0C0E',
      neutral: '#FFFFFF',
      additional: [],
    }),
  typography: z
    .object({
      heading: z.string().default('Inter'),
      body: z.string().default('Inter'),
      code: z.string().optional().default('JetBrains Mono'),
    })
    .default({
      heading: 'Inter',
      body: 'Inter',
      code: 'JetBrains Mono',
    }),
  visualRules: z.array(z.string()).default(['High contrast obsidian dark theme', 'Electric yellow hero highlights']),
  contentGuidelines: z.array(z.string()).default(['Hook within 3 seconds', 'Clear actionable CTA']),
  ctaStyles: z.array(z.string()).default(['Get started today']),
  doNotUseRules: z.array(z.string()).default(['No low contrast text']),
});

export class BrandDNASynthesizer {
  private static activeBrandDNA: BrandDNA | null = null;
  private static storagePath = path.join(process.cwd(), 'AI Video Editor', 'styles', 'brand-guidelines.json');

  static {
    // Hydrate existing Brand DNA if present on disk
    try {
      if (fs.existsSync(this.storagePath)) {
        const raw = fs.readFileSync(this.storagePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.brandName) {
          this.activeBrandDNA = parsed;
        }
      }
    } catch {}
  }

  /**
   * Synthesize Brand DNA from Website Analysis and/or Manual Inputs
   */
  public static async synthesizeBrandDNA(inputs: {
    brandName?: string;
    websiteAnalysis?: WebsiteAnalysisResult;
    businessDescription?: string;
    targetAudience?: string;
    logoUrl?: string;
  }): Promise<BrandDNA> {
    const analysis = inputs.websiteAnalysis;
    const resolvedName =
      inputs.brandName?.trim() ||
      analysis?.title?.split(/[-|–:]/)[0].trim() ||
      analysis?.domain ||
      'RIIQX Creator Brand';

    const scrapedContent = analysis
      ? `Website Title: ${analysis.title || 'N/A'}
Domain: ${analysis.domain}
Meta Description: ${analysis.description || 'N/A'}
Extracted Keywords: ${analysis.keywords.join(', ') || 'N/A'}
Observed Colors: ${analysis.colors.map((c) => `${c.hex} (${c.source})`).join(', ') || 'None observed'}
Observed Fonts: ${analysis.fonts.join(', ') || 'Inter'}
Observed Headings: ${analysis.headings.join(' | ') || 'N/A'}
Observed CTAs: ${analysis.ctas.join(' | ') || 'N/A'}
Observed Socials: ${JSON.stringify(analysis.socialLinks)}
Text Sample: ${analysis.rawTextSample.substring(0, 1500)}`
      : `Brand Name: ${resolvedName}
Description: ${inputs.businessDescription || 'Modern AI-driven creative enterprise'}
Audience: ${inputs.targetAudience || 'Creators, professionals and modern audiences'}`;

    const renderedPrompt = PromptTemplateEngine.render('BRAND_DNA_SYNTHESIS', {
      brandName: resolvedName,
      websiteUrl: analysis?.url || 'N/A',
      scrapedContent,
    });

    // Execute structured synthesis with Gemini / Groq fallback
    const result = await AIServiceManager.executeStructured(
      renderedPrompt.userPrompt,
      BrandDNASchema,
      {
        systemPrompt: renderedPrompt.systemPrompt,
        taskType: 'brand_dna',
        temperature: 0.4,
        maxTokens: 4096,
      }
    );

    const generated = result.data as any;

    // Ground observed colors from actual website analysis
    const primaryColor =
      analysis?.colors?.[0]?.hex || generated.colorPalette?.primary || '#FFD43B';
    const secondaryColor =
      analysis?.colors?.[1]?.hex || generated.colorPalette?.secondary || '#202124';
    const accentColor =
      analysis?.colors?.[2]?.hex || generated.colorPalette?.accent || '#06B6D4';

    const factsCount = analysis
      ? (analysis.title ? 1 : 0) +
        analysis.colors.length +
        analysis.fonts.length +
        analysis.logoUrls.length +
        Object.keys(analysis.socialLinks).length
      : 2;

    const brandDNA: BrandDNA = {
      id: `brand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      brandName: generated.brandName || resolvedName,
      websiteUrl: analysis?.url,
      tagline: generated.tagline || 'One Goal. An AI That Gets It Done.',
      mission: generated.mission || 'Empowering creators with autonomous intelligence.',
      description: generated.description || 'High-impact creative operations.',
      industry: generated.industry || 'Creator Economy',
      targetAudience: inputs.targetAudience || generated.targetAudience || 'Modern digital creators and professionals',
      customerPersonas: Array.isArray(generated.customerPersonas) ? generated.customerPersonas : ['Digital Creator'],
      brandPersonality: Array.isArray(generated.brandPersonality) ? generated.brandPersonality : ['Visionary', 'Modern'],
      toneOfVoice: generated.toneOfVoice || 'Confident, direct, empowering',
      coreMessages: Array.isArray(generated.coreMessages) ? generated.coreMessages : ['Scale creative output with autonomous AI.'],
      colorPalette: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        background: generated.colorPalette?.background || '#0C0C0E',
        neutral: generated.colorPalette?.neutral || '#FFFFFF',
        additional: generated.colorPalette?.additional || [],
      },
      typography: {
        heading: analysis?.fonts?.[0] || generated.typography?.heading || 'Inter',
        body: analysis?.fonts?.[1] || generated.typography?.body || 'Inter',
        code: generated.typography?.code || 'JetBrains Mono',
      },
      logoVariants: {
        primaryUrl: inputs.logoUrl || analysis?.logoUrls?.[0],
        iconOnlyUrl: analysis?.logoUrls?.[1] || analysis?.logoUrls?.[0],
      },
      visualRules: Array.isArray(generated.visualRules) ? generated.visualRules : ['High contrast obsidian dark theme'],
      contentGuidelines: Array.isArray(generated.contentGuidelines) ? generated.contentGuidelines : ['Hook within 3 seconds'],
      ctaStyles: Array.isArray(generated.ctaStyles) ? generated.ctaStyles : ['Get started today'],
      doNotUseRules: Array.isArray(generated.doNotUseRules) ? generated.doNotUseRules : ['No low contrast text'],
      confidence: {
        overallScore: analysis ? Math.min(98, 80 + factsCount * 2) : 85,
        extractedFactsCount: factsCount,
        aiRecommendationsCount:
          (generated.customerPersonas?.length || 2) +
          (generated.visualRules?.length || 2) +
          (generated.doNotUseRules?.length || 2),
      },
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.activeBrandDNA = brandDNA;
    this.persistBrandDNA(brandDNA);

    return brandDNA;
  }

  /**
   * Generates formatted Markdown and JSON guidelines exports
   */
  public static generateGuidelinesExport(brand: BrandDNA): BrandGuidelinesExport {
    const md = `# ${brand.brandName} — Brand DNA & Guidelines Specification
> **Version**: ${brand.version}.0 | **Generated**: ${new Date(brand.updatedAt).toLocaleDateString()}
> **Tagline**: *${brand.tagline}*
> **Confidence Score**: ${brand.confidence.overallScore}% (${brand.confidence.extractedFactsCount} observed facts · ${brand.confidence.aiRecommendationsCount} AI recommendations)

---

## 1. Brand Identity & Purpose
- **Mission**: ${brand.mission}
- **Industry**: ${brand.industry}
- **Description**: ${brand.description}
- **Target Audience**: ${brand.targetAudience}

### Customer Personas:
${brand.customerPersonas.map((p) => `- ${p}`).join('\n')}

---

## 2. Voice, Tone & Personality
- **Tone of Voice**: ${brand.toneOfVoice}
- **Personality Pillars**: ${brand.brandPersonality.join(' • ')}

### Core Messaging:
${brand.coreMessages.map((m) => `- "${m}"`).join('\n')}

---

## 3. Visual Identity & Design Tokens

### Color Palette:
| Role | Color Swatch | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary** | 🟡 | \`${brand.colorPalette.primary}\` | Hero accents, primary buttons, brand emblem |
| **Secondary** | ⚫ | \`${brand.colorPalette.secondary}\` | Structural dark containers, header elements |
| **Accent** | 🔵 | \`${brand.colorPalette.accent}\` | Kinetic highlights, badges, active glows |
| **Background** | ⬛ | \`${brand.colorPalette.background}\` | Core backdrop canvas |
| **Neutral** | ⚪ | \`${brand.colorPalette.neutral}\` | High-contrast readability text |

### Typography:
- **Heading**: \`${brand.typography.heading}\` (Bold, tight tracking)
- **Body**: \`${brand.typography.body}\` (Clean, accessible line-height)
- **Code / Metrics**: \`${brand.typography.code || 'JetBrains Mono'}\`

---

## 4. Visual Execution & Content Rules

### Mandatory Visual Rules:
${brand.visualRules.map((r) => `- [x] ${r}`).join('\n')}

### Content Guidelines:
${brand.contentGuidelines.map((g) => `- ${g}`).join('\n')}

### Call to Action Styles:
${brand.ctaStyles.map((c) => `- "${c}"`).join('\n')}

---

## 5. Strict Do-Not-Use Rules (Brand Safety)
${brand.doNotUseRules.map((rule) => `> ❌ **FORBIDDEN**: ${rule}`).join('\n')}

---
*Exported automatically by RIIQX AI Brand Intelligence System.*
`;

    return {
      markdown: md,
      json: brand,
    };
  }

  /**
   * Save active Brand DNA to disk and synchronize with Video Editor
   */
  public static persistBrandDNA(brand: BrandDNA): void {
    try {
      const stylesDir = path.dirname(this.storagePath);
      if (!fs.existsSync(stylesDir)) {
        fs.mkdirSync(stylesDir, { recursive: true });
      }

      // 1. Write JSON guidelines
      fs.writeFileSync(this.storagePath, JSON.stringify(brand, null, 2), 'utf-8');

      // 2. Write Markdown style-sheet for Video Editor
      const exportData = this.generateGuidelinesExport(brand);
      const styleSheetPath = path.join(stylesDir, 'style-sheet.md');
      fs.writeFileSync(styleSheetPath, exportData.markdown, 'utf-8');
    } catch (err: any) {
      console.warn('[BrandDNASynthesizer] Failed to persist brand guidelines to disk:', err.message);
    }
  }

  /**
   * Retrieve current active Brand DNA
   */
  public static getActiveBrandDNA(): BrandDNA | null {
    return this.activeBrandDNA;
  }
}
