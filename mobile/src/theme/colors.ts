// =============================================================================
// RIIQX Master Visual Design Tokens & Color Palette
// Editorial Fintech Aesthetic (Matching Specification & Reference Mockups)
// Warm Off-White / Charcoal Dark Canvas • Modern Violet #6750D8 • Emerald #16865D
// =============================================================================

export const lightColors = {
  // Canvas & Surfaces
  canvas: '#F5F5F0',
  bg: '#F5F5F0',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardElevated: '#FFFFFF',
  cardBorder: '#E5E7EB',
  cardBorderSubtle: '#F3F4F6',
  divider: '#E5E7EB',
  glass: 'rgba(255, 255, 255, 0.94)',

  // Primary Brand Accent
  primary: '#6750D8',
  primaryHover: '#563EC2',
  primarySubtle: '#EDE9FE',
  primaryGlow: 'rgba(103, 80, 216, 0.15)',

  // Financial Status Indicators
  positive: '#16865D',
  positiveSubtle: '#D1FAE5',
  positiveText: '#065F46',

  negative: '#D64B55',
  negativeSubtle: '#FEE2E2',
  negativeText: '#991B1B',

  warning: '#D97706',
  warningSubtle: '#FEF3C7',
  warningText: '#92400E',

  info: '#2563EB',
  infoSubtle: '#DBEAFE',

  // Legacy compatibility aliases
  violet: '#6750D8',
  violetSubtle: '#EDE9FE',
  rose: '#D64B55',
  emerald: '#16865D',
  emeraldSubtle: '#D1FAE5',
  cyan: '#0EA5E9',
  pink: '#EC4899',
  pinkSubtle: '#FCE7F3',
  pinkLight: '#F472B6',
  amber: '#D97706',
  blue: '#2563EB',
  bgSubtle: '#F3F4F6',

  // Typography
  textPrimary: '#141821',
  textSecondary: '#4B5563',
  textTertiary: '#9CA3AF',
  textMuted: '#9CA3AF',
  textInverted: '#FFFFFF',

  // Asset Class Badges & Colors
  assetIndianStock: '#2563EB',
  assetMutualFund: '#7C3AED',
  assetUsStock: '#0284C7',
  assetEtf: '#0D9488',
  assetBond: '#059669',
  assetReit: '#D97706',
  assetFd: '#4F46E5',
  assetGold: '#EAB308',
  assetSilver: '#94A3B8',

  // Neutral Scales
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

export const darkColors = {
  // Canvas & Surfaces
  canvas: '#141821',
  bg: '#141821',
  surface: '#1A202C',
  card: '#1E2430',
  cardElevated: '#252D3D',
  cardBorder: '#2D3748',
  cardBorderSubtle: '#232A38',
  divider: '#2D3748',
  glass: 'rgba(26, 32, 44, 0.94)',

  // Primary Brand Accent
  primary: '#8570FA',
  primaryHover: '#725BE3',
  primarySubtle: 'rgba(133, 112, 250, 0.18)',
  primaryGlow: 'rgba(133, 112, 250, 0.25)',

  // Financial Status Indicators
  positive: '#22C55E',
  positiveSubtle: 'rgba(34, 197, 94, 0.16)',
  positiveText: '#4ADE80',

  negative: '#F87171',
  negativeSubtle: 'rgba(248, 113, 113, 0.16)',
  negativeText: '#FCA5A5',

  warning: '#FBBF24',
  warningSubtle: 'rgba(251, 191, 36, 0.16)',
  warningText: '#FDE68A',

  info: '#60A5FA',
  infoSubtle: 'rgba(96, 165, 250, 0.16)',

  // Legacy compatibility aliases
  violet: '#8570FA',
  violetSubtle: 'rgba(133, 112, 250, 0.20)',
  rose: '#F87171',
  emerald: '#22C55E',
  emeraldSubtle: 'rgba(34, 197, 94, 0.20)',
  cyan: '#38BDF8',
  pink: '#F472B6',
  pinkSubtle: 'rgba(244, 114, 182, 0.20)',
  pinkLight: '#F472B6',
  amber: '#FBBF24',
  blue: '#60A5FA',
  bgSubtle: '#1E2430',

  // Typography
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#64748B',
  textMuted: '#6B7280',
  textInverted: '#141821',

  // Asset Class Badges & Colors
  assetIndianStock: '#60A5FA',
  assetMutualFund: '#A78BFA',
  assetUsStock: '#38BDF8',
  assetEtf: '#2DD4BF',
  assetBond: '#34D399',
  assetReit: '#FBBF24',
  assetFd: '#818CF8',
  assetGold: '#FACC15',
  assetSilver: '#CBD5E1',

  // Neutral Scales
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#2D3748',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',
} as const;

export const colors = lightColors;
export type ColorTheme = typeof lightColors;
