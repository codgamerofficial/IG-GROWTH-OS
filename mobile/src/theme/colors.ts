// =============================================================================
// RIIQX Mobile 2.0 — Master Visual Design Tokens & Palette
// Clean Contemporary Creator-First Aesthetic (Matching Reference Image 2)
// White & Soft-Neutral Surfaces • Dark Charcoal Typography • Violet/Pink Accents
// =============================================================================

export const lightColors = {
  bg: '#F8FAFC',
  bgSubtle: '#F1F5F9',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardBorder: '#E2E8F0',
  borderHighlight: '#DDD6FE',
  glass: 'rgba(255, 255, 255, 0.90)',

  // Brand Accents
  violet: '#7C3AED',
  violetLight: '#8B5CF6',
  violetSubtle: '#EDE9FE',
  pink: '#EC4899',
  pinkLight: '#F472B6',
  pinkSubtle: '#FCE7F3',
  cyan: '#0EA5E9',
  blue: '#3B82F6',

  // Status & Highlights
  emerald: '#10B981',
  success: '#10B981',
  emeraldSubtle: '#D1FAE5',
  amber: '#F59E0B',
  warning: '#F59E0B',
  amberSubtle: '#FEF3C7',
  rose: '#EF4444',
  danger: '#EF4444',

  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverted: '#FFFFFF',
} as const;

export const darkColors = {
  bg: '#0B0F19',
  bgSubtle: '#111827',
  surface: '#111827',
  card: '#1E293B',
  cardElevated: '#334155',
  cardBorder: '#334155',
  borderHighlight: '#6D28D9',
  glass: 'rgba(17, 24, 39, 0.90)',

  // Brand Accents
  violet: '#8B5CF6',
  violetLight: '#A78BFA',
  violetSubtle: 'rgba(139, 92, 246, 0.20)',
  pink: '#EC4899',
  pinkLight: '#F472B6',
  pinkSubtle: 'rgba(236, 72, 153, 0.20)',
  cyan: '#06B6D4',
  blue: '#3B82F6',

  // Status & Highlights
  emerald: '#10B981',
  success: '#10B981',
  emeraldSubtle: 'rgba(16, 185, 129, 0.20)',
  amber: '#F59E0B',
  warning: '#F59E0B',
  amberSubtle: 'rgba(245, 158, 11, 0.20)',
  rose: '#EF4444',
  danger: '#EF4444',

  // Typography
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverted: '#0F172A',
} as const;

// Default exported colors (Clean light creator theme)
export const colors = lightColors;

export type ColorTheme = typeof colors;
