// =============================================================================
// RIIQX Mobile — Screen 1: Splash Screen
// Matches Reference Board Screen 1
// Deep Violet Background • Glowing Stylized R Logo • Brand & Official Slogan
// =============================================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { lightColors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background glow orbs */}
      <View style={styles.glowOrbTop} />
      <View style={styles.glowOrbBottom} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          {/* Stylized Logo Badge */}
          <View style={styles.logoBadgeContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoLetter}>R</Text>
            </View>
            <View style={styles.glowRing} />
          </View>

          {/* Brand Name */}
          <Text style={styles.brandTitle}>RIIQX</Text>

          {/* Official Tagline from Master Design Board */}
          <Text style={styles.tagline}>Smarter Investments.</Text>
          <Text style={styles.taglineSub}>A Brighter Tomorrow.</Text>

          <Text style={styles.description}>
            All your investments. One intelligent platform. Track, analyze, and get AI-powered recommendations across Stocks, Mutual Funds, ETFs, Bonds, REITs, Gold, Crypto, FD and more.
          </Text>
        </View>

        {/* Action Controls */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/onboarding')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Open Dashboard Directly</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0B20',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  glowOrbTop: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(103, 80, 216, 0.35)',
  },
  glowOrbBottom: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(139, 92, 246, 0.25)',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logoBadgeContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 2,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    fontFamily: 'System',
  },
  glowRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    zIndex: 1,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 12,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  taglineSub: {
    color: '#8B5CF6',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  bottomActions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#6750D8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
});
