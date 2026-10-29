// =============================================================================
// RIIQX Master UI Tokens & Layout Specifications
// 48-52px Touch Targets • 16-24px Rounded Cards • Consistent Padding
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  card: 20,
  cardLarge: 24,
  full: 9999,
} as const;

export const typography = {
  hero: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  h1: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  footnote: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
  tabularNumeral: {
    fontVariant: ['tabular-nums' as const],
    letterSpacing: -0.2,
  },
} as const;

export const touchTargets = {
  minHeight: 48,
  buttonHeight: 52,
  iconButtonSize: 44,
  chipHeight: 36,
} as const;
