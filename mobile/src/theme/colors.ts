// =============================================================================
// RIIQX Master Visual Design Tokens & Color Palette
// AI Creator OS • Production Core (Matching Web Dashboard Reference)
// Deep Obsidian #0C0C0E • Trending Yellow #FFD43B • Coral #FF6B5E • Emerald #10B981
// =============================================================================

export const darkColors = {
  // Canvas & Surfaces (Obsidian Liquid Glass)
  canvas: '#0C0C0E',
  bg: '#0C0C0E',
  surface: '#141418',
  card: '#141418',
  cardElevated: '#1C1C22',
  cardBorder: '#1E1E24',
  cardBorderSubtle: 'rgba(255, 255, 255, 0.08)',
  divider: '#1E1E24',
  glass: 'rgba(20, 20, 24, 0.94)',

  // Primary Brand Accent (Trending Yellow & Coral from screenshot)
  primary: '#FFD43B',
  primaryHover: '#FFC928',
  primarySubtle: 'rgba(255, 212, 59, 0.15)',
  primaryGlow: 'rgba(255, 212, 59, 0.25)',

  // Secondary Accents
  coral: '#FF6B5E',
  coralSubtle: 'rgba(255, 107, 94, 0.15)',
  yellow: '#FFD43B',
  yellowSubtle: 'rgba(255, 212, 59, 0.15)',

  // Status Indicators
  positive: '#10B981',
  positiveSubtle: 'rgba(16, 185, 129, 0.15)',
  positiveText: '#10B981',

  negative: '#EF4444',
  negativeSubtle: 'rgba(239, 68, 68, 0.15)',
  negativeText: '#EF4444',

  warning: '#F59E0B',
  warningSubtle: 'rgba(245, 158, 11, 0.15)',
  warningText: '#F59E0B',

  info: '#38BDF8',
  infoSubtle: 'rgba(56, 189, 248, 0.15)',

  // Compatibility aliases
  violet: '#FFD43B',
  violetSubtle: 'rgba(255, 212, 59, 0.15)',
  rose: '#FF6B5E',
  emerald: '#10B981',
  emeraldSubtle: 'rgba(16, 185, 129, 0.15)',
  cyan: '#38BDF8',
  pink: '#FF6B5E',
  pinkSubtle: 'rgba(255, 107, 94, 0.15)',
  pinkLight: '#FF8A7D',
  amber: '#F59E0B',
  blue: '#38BDF8',
  bgSubtle: '#1C1C22',

  // Typography
  textPrimary: '#F4F4F6',
  textSecondary: '#A1A1AA',
  textTertiary: '#737373',
  textMuted: '#737373',
  textInverted: '#0C0C0E',

  // Scales
  gray50: '#141418',
  gray100: '#1C1C22',
  gray200: '#26262E',
  gray300: '#3F3F46',
  gray400: '#71717A',
  gray500: '#A1A1AA',
  gray600: '#D4D4D8',
  gray700: '#E4E4E7',
  gray800: '#F4F4F6',
  gray900: '#FFFFFF',
} as const;

export const lightColors = darkColors; // Strict obsidian default per specification
export const colors = darkColors;
export type ColorTheme = typeof darkColors;
