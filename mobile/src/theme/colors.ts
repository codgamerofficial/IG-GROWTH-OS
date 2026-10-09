// =============================================================================
// PujaHop Kolkata Mobile: Master Design System Color Palette
// Section 6: Editorial Dark surfaces with Antique Gold & Durga Red accents
// =============================================================================

export const colors = {
  // Dark Surfaces
  deepCharcoal: '#09090B',
  midnight: '#11111A',
  warmBlack: '#171216',
  cardDark: '#141224',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  glassDark: 'rgba(17, 17, 26, 0.85)',

  // Sacred & Festive Accents
  durgaRed: '#C62828',
  sindoor: '#E53935',
  festiveOrange: '#FF8A3D',
  antiqueGold: '#D6A84F',
  softGold: '#F1D28A',

  // Light & Editorial Tones
  ivory: '#FFF7E8',
  mutedCream: '#E8DCC8',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',

  // Semantic Status
  success: '#35C98A',
  warning: '#F4B942',
  danger: '#EF4444',
  metroBlue: '#005691',
  metroGreen: '#008751',
} as const;

export type ColorTheme = typeof colors;
