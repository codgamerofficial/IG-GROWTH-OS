// =============================================================================
// IG GrowthOS: Official Brand Configuration (Section 18)
// =============================================================================

export const brandConfig = {
  name: 'IG GrowthOS',
  shortName: 'IG GrowthOS',
  tagline: 'AI-POWERED SOCIAL GROWTH',
  subTagline: 'Create • Automate • Grow',
  primaryBrand: 'RIIQX',
  category: 'Fashion • Clothing • Lifestyle • AI UGC • Affiliate Content',
  description:
    'AI-powered Instagram and cross-platform automation command center for content creation, scheduling, publishing, analytics, and growth automation.',
  seo: {
    title: 'IG GrowthOS — AI-Powered Social Growth',
    description:
      'AI-powered social media automation, content creation, scheduling and analytics for modern brands.',
  },
  colors: {
    violet: '#7C3AED',
    purple: '#9333EA',
    magenta: '#C026D3',
    pink: '#EC4899',
    blue: '#2563EB',
    cyan: '#06B6D4',
    orange: '#F97316',
  },
} as const;

export type BrandConfig = typeof brandConfig;
