// =============================================================================
// RIIQX — Master AI Brand Intelligence Types
// Brand DNA Profile • SSRF-Safe Website Scrape • Guidelines Specification
// =============================================================================

export interface ExtractedColor {
  hex: string;
  source: 'css_var' | 'inline_style' | 'meta_theme' | 'logo' | 'ai_recommendation';
  frequency: number;
}

export interface WebsiteAnalysisResult {
  url: string;
  domain: string;
  title?: string;
  description?: string;
  keywords: string[];
  colors: ExtractedColor[];
  fonts: string[];
  logoUrls: string[];
  headings: string[];
  ctas: string[];
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
    github?: string;
  };
  rawTextSample: string;
  analyzedAt: string;
}

export interface BrandPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  neutral: string;
  additional?: string[];
}

export interface BrandTypography {
  heading: string;
  body: string;
  code?: string;
  googleFontImportUrl?: string;
}

export interface BrandDNA {
  id: string;
  brandName: string;
  websiteUrl?: string;
  tagline: string;
  mission: string;
  description: string;
  industry: string;
  targetAudience: string;
  customerPersonas: string[];
  brandPersonality: string[];
  toneOfVoice: string;
  coreMessages: string[];
  colorPalette: BrandPalette;
  typography: BrandTypography;
  logoVariants: {
    primaryUrl?: string;
    iconOnlyUrl?: string;
    darkUrl?: string;
    lightUrl?: string;
  };
  visualRules: string[];
  contentGuidelines: string[];
  ctaStyles: string[];
  doNotUseRules: string[];
  confidence: {
    overallScore: number;
    extractedFactsCount: number;
    aiRecommendationsCount: number;
  };
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrandGuidelinesExport {
  markdown: string;
  json: BrandDNA;
}
