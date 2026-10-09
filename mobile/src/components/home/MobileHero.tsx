// =============================================================================
// PujaHop Kolkata Mobile: Cinematic Mobile Hero
// Section 8: 9:16 adaptive hero with Bengali headline and dual CTA
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Compass } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useHaptics } from '../../hooks/useHaptics';

export function MobileHero() {
  const router = useRouter();
  const haptics = useHaptics();

  return (
    <View style={styles.heroWrapper}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1570700005880-4ecdb8595d4a?auto=format&fit=crop&w=1080&q=80' }}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          {/* Bengali Header Badge */}
          <View style={styles.badge}>
            <Sparkles size={12} color={colors.antiqueGold} />
            <Text style={styles.badgeText}>KOLKATA DURGA PUJA 2026</Text>
          </View>

          {/* Headlines */}
          <Text style={styles.bengaliHeadline}>একদিনে{'\n'}সারা কলকাতার{'\n'}সেরা পুজো</Text>
          <Text style={styles.englishHeadline}>One Day. One City. Maximum Puja.</Text>
          <Text style={styles.supportingText}>
            AI-powered routes • Real-time Metro • Verified pandal intelligence
          </Text>

          {/* Action CTAs */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              onPress={() => {
                haptics.heavy();
                router.push('/plan');
              }}
              style={styles.primaryCta}
              activeOpacity={0.88}
            >
              <Text style={styles.primaryCtaText}>PLAN MY PUJA DAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                router.push('/explore');
              }}
              style={styles.secondaryCta}
              activeOpacity={0.8}
            >
              <Compass size={16} color={colors.softGold} />
              <Text style={styles.secondaryCtaText}>EXPLORE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    width: '100%',
    height: 440,
    overflow: 'hidden',
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.3)',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: colors.softGold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bengaliHeadline: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 6,
  },
  englishHeadline: {
    color: colors.antiqueGold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  supportingText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryCta: {
    flex: 1,
    backgroundColor: colors.durgaRed,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.durgaRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
  secondaryCtaText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
