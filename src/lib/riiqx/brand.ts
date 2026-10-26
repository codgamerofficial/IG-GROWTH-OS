// =============================================================================
// RIIQX — Master Brand & Visual Design Tokens
// One Goal. An AI That Gets It Done.
// =============================================================================

export interface RiiqxBrandConfig {
  name: string;
  tagline: string;
  subheadline: string;
  version: string;
  palette: {
    bg: string;
    surface: string;
    card: string;
    cardElevated: string;
    border: string;
    borderHighlight: string;
    cyan: string;
    blue: string;
    violet: string;
    emerald: string;
    amber: string;
    rose: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
  theme?: {
    light: Record<string, string>;
    dark: Record<string, string>;
    accents: Record<string, string>;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const riiqxBrand: RiiqxBrandConfig = {
  name: 'RIIQX',
  tagline: 'One Goal. An AI That Gets It Done.',
  subheadline: 'The Online-First Agentic AI Platform • Autonomous Creator Studio & Social Autopilot',
  version: '2.0.0-production',
  palette: {
    bg: '#030712', // Obsidian Black (Legacy Fallback)
    surface: '#070D1F', // Deep Midnight Navy
    card: '#0B132B', // Structured Slate
    cardElevated: '#111C3A', // Elevated Panel
    border: '#1E2A4A', // Structural Border
    borderHighlight: '#2A3C6B', // Active Glow Border
    cyan: '#06B6D4', // Electric Cyan
    blue: '#3B82F6', // Neon Cobalt
    violet: '#8B5CF6', // Ultra Violet
    emerald: '#10B981', // Verified Green
    amber: '#F59E0B', // Alert Amber
    rose: '#F43F5E', // Emergency Crimson
    textPrimary: '#FFFFFF', // High-contrast White
    textSecondary: '#94A3B8', // Slate Text
    textMuted: '#64748B', // Muted Commentary
  },
  theme: {
    light: {
      canvas: '#F8FAFC',
      canvasSubtle: '#F1F5F9',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      cardHover: '#F8FAFC',
      border: '#E2E8F0',
      borderSubtle: '#F1F5F9',
      borderHighlight: '#DDD6FE',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
    },
    dark: {
      canvas: '#0B0F19',
      canvasSubtle: '#111827',
      surface: '#111827',
      card: '#1E293B',
      cardHover: '#334155',
      border: '#334155',
      borderSubtle: '#1E293B',
      borderHighlight: '#4C1D95',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      textMuted: '#64748B',
    },
    accents: {
      violet: '#7C3AED',
      pink: '#EC4899',
      emerald: '#10B981',
      sky: '#0EA5E9',
      amber: '#F59E0B',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    },
  },

  seo: {
    title: 'RIIQX — One Goal. An AI That Gets It Done.',
    description:
      'Production-oriented online-first Agentic AI platform with AWS Bedrock intelligence, autonomous 9:16 Creator Studio, and Level 3 Social Media Autopilot.',
    keywords: [
      'RIIQX',
      'Agentic AI',
      'AWS Bedrock',
      'Claude Sonnet',
      'Creator Studio',
      'Instagram Reels Autopilot',
      'YouTube Shorts AI',
      'Social Media Automation',
      'Autonomous Tasks',
      'Online First AI',
    ],
  },
};
