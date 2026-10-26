// =============================================================================
// RIIQX Mobile — Master Visual Design Tokens & Color Palette
// One Goal. An AI That Gets It Done.
// Deep Obsidian Foundation (#030712) with Electric Cyan, Cobalt & Ultra Violet Accents
// =============================================================================

export const colors = {
  // Dark Obsidian & Surface Foundations
  bg: '#030712',
  surface: '#070D1F',
  card: '#0B132B',
  cardElevated: '#111C3A',
  cardBorder: '#1E2A4A',
  borderHighlight: '#2A3C6B',
  glassDark: 'rgba(7, 13, 31, 0.90)',

  // Brand Accents
  cyan: '#06B6D4',
  blue: '#3B82F6',
  violet: '#8B5CF6',
  purple: '#A855F7',
  pink: '#EC4899',

  // Semantic Status
  emerald: '#10B981',
  success: '#10B981',
  amber: '#F59E0B',
  warning: '#F59E0B',
  rose: '#F43F5E',
  danger: '#F43F5E',

  // Typography & Content
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
} as const;

export type ColorTheme = typeof colors;
