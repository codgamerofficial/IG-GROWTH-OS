// =============================================================================
// RIIQX Mobile — Screen 11: Onboarding Success
// Confirmation screen welcoming the user to the unified wealth dashboard
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { lightColors, darkColors } from '../../src/theme/colors';

export default function OnboardingSuccessScreen() {
  const router = useRouter();
  const { isDarkMode, portfolioSummary, holdings, formatMoney } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      <View style={styles.container}>
        {/* Animated Green Checkmark Graphic */}
        <View style={styles.iconWrapper}>
          <View style={styles.pulseOuter}>
            <View style={styles.pulseInner}>
              <Ionicons name="checkmark" size={44} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Headings */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          You're all set!
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Your accounts are synchronized and ready to monitor. Let's build a smarter financial future together.
        </Text>

        {/* Portfolio Snapshot Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Initialized Portfolio
            </Text>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
              {formatMoney(portfolioSummary.totalCurrentValue)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="pie-chart" size={16} color="#6750D8" />
              <Text style={[styles.featureText, { color: theme.textPrimary }]}>
                {holdings.length} Holdings Tracked
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="sparkles" size={16} color="#16865D" />
              <Text style={[styles.featureText, { color: theme.textPrimary }]}>
                AI Health Audit Ready
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={16} color="#2563EB" />
              <Text style={[styles.featureText, { color: theme.textPrimary }]}>
                SEBI Safe Mode
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="sync" size={16} color="#D97706" />
              <Text style={[styles.featureText, { color: theme.textPrimary }]}>
                Daily NAV & Price Sync
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          style={[styles.dashboardBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.replace('/(tabs)' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.dashboardBtnText}>Go to Dashboard</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 28,
  },
  pulseOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#16865D20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16865D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16865D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 8,
    marginBottom: 32,
  },
  summaryCard: {
    width: '100%',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 36,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  featureGrid: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dashboardBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  dashboardBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
