// =============================================================================
// RIIQX Creator Studio — Cover & Thumbnail Engine
// 9:16 Vertical Cover Generation • Safe Margin Safe Zone Positioning
// High-Contrast Title Banner • Platform Specific UI Clearance
// =============================================================================

export interface ThumbnailConfig {
  title: string;
  subtitle?: string;
  theme: 'gold_black' | 'cyberpunk' | 'minimal' | 'bold_red';
  safeZoneOnly: boolean; // Avoids bottom 20% (caption/profile) & top 10% (status bar)
}

/**
 * Computes safe-zone bounding box for thumbnail titles in 1080x1920
 */
export function get916SafeZone(width = 1080, height = 1920): {
  topSafeY: number;
  bottomSafeY: number;
  safeHeight: number;
} {
  const topSafeY = Math.round(height * 0.15); // Clear top app headers
  const bottomSafeY = Math.round(height * 0.80); // Clear bottom like/comment/caption UI
  return {
    topSafeY,
    bottomSafeY,
    safeHeight: bottomSafeY - topSafeY,
  };
}

/**
 * Returns rendering styles for cover banner
 */
export function getCoverThemeStyles(theme: ThumbnailConfig['theme']) {
  switch (theme) {
    case 'cyberpunk':
      return { textColor: '#00F0FF', bannerBg: 'rgba(10, 10, 15, 0.85)', accent: '#FF0055' };
    case 'bold_red':
      return { textColor: '#FFFFFF', bannerBg: 'rgba(239, 68, 68, 0.9)', accent: '#FACC15' };
    case 'minimal':
      return { textColor: '#151515', bannerBg: 'rgba(255, 255, 255, 0.95)', accent: '#000000' };
    case 'gold_black':
    default:
      return { textColor: '#FFD43B', bannerBg: 'rgba(20, 20, 24, 0.9)', accent: '#FFFFFF' };
  }
}

