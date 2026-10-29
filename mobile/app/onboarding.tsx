// =============================================================================
// RIIQX Mobile — Screens 2, 3, 4: 3-Step Interactive Onboarding Carousel
// Matches Reference Board Screens 2, 3 & 4
// "Invest Smarter, Live Better" • "Everything in One Place" • "Personalized Recommendations"
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightColors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    step: 1,
    title: 'Invest Smarter\nLive Better',
    description: 'AI-powered insights for all your investment needs. Understand downside risks, monitor portfolio health, and grow wealth with clarity.',
    icon: 'leaf',
    badgeText: 'INTELLIGENT INSIGHTS',
    badgeColor: '#16865D',
    graphicBg: '#D1FAE5',
  },
  {
    step: 2,
    title: 'Everything\nIn One Place',
    description: 'Track Stocks, Mutual Funds, Bonds, ETFs, REITs, Gold, Crypto and more without logging into multiple brokerage apps.',
    icon: 'pie-chart',
    badgeText: 'MULTI-ASSET TRACKING',
    badgeColor: '#6750D8',
    graphicBg: '#EDE9FE',
  },
  {
    step: 3,
    title: 'Personalized\nRecommendations',
    description: 'Get AI-driven suggestions based on your goals, risk profile and market trends. Backed by verified data and zero price hallucinations.',
    icon: 'sparkles',
    badgeText: 'AI RESEARCH COPILOT',
    badgeColor: '#2563EB',
    graphicBg: '#DBEAFE',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = SLIDES[currentIndex];

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/auth/signup');
    }
  };

  const handleSkip = () => {
    router.push('/auth/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Row with Skip Button */}
      <View style={styles.topRow}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>RIIQX</Text>
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Center 3D Themed Graphic & Illustration Container */}
      <View style={styles.illustrationContainer}>
        <View style={[styles.graphicCircle, { backgroundColor: currentSlide.graphicBg }]}>
          <View style={[styles.innerBadge, { backgroundColor: currentSlide.badgeColor }]}>
            <Ionicons name={currentSlide.icon as any} size={42} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Bottom Content Card */}
      <View style={styles.bottomCard}>
        {/* Category Pill */}
        <View style={[styles.categoryBadge, { backgroundColor: currentSlide.graphicBg }]}>
          <Text style={[styles.categoryBadgeText, { color: currentSlide.badgeColor }]}>
            {currentSlide.badgeText}
          </Text>
        </View>

        {/* Slide Title */}
        <Text style={styles.title}>{currentSlide.title}</Text>

        {/* Slide Description */}
        <Text style={styles.description}>{currentSlide.description}</Text>

        {/* Pagination Dots */}
        <View style={styles.paginatorRow}>
          {SLIDES.map((_, idx) => (
            <View
              key={`dot_${idx}`}
              style={[
                styles.dot,
                currentIndex === idx && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  brandBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
  },
  brandBadgeText: {
    color: '#6750D8',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  skipBtn: {
    padding: 8,
  },
  skipBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  bottomCard: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  paginatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#6750D8',
  },
  nextButton: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6750D8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
