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
    bg: '#030712', // Obsidian Black
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
