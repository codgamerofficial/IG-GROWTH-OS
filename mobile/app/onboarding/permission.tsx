// =============================================================================
// RIIQX Mobile — Screen 10: Permission
// Transparent read-only authorization and security disclosures
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { lightColors, darkColors } from '../../src/theme/colors';

const PERMISSION_ITEMS = [
  {
    id: 'portfolio',
    title: 'Portfolio Overview',
    desc: 'Aggregate current net worth, asset valuations, and cash holdings in one view.',
    icon: 'pie-chart-outline',
  },
  {
    id: 'transactions',
    title: 'Transaction History',
    desc: 'Compute precise XIRR, realized gains, tax-lot cost basis, and dividend cash flows.',
    icon: 'receipt-outline',
  },
  {
    id: 'holdings',
    title: 'Account Holdings',
    desc: 'Classify asset allocation across Equities, Debt, Bullion, and Fixed Income.',
    icon: 'layers-outline',
  },
  {
    id: 'market_data',
    title: 'Market Data Sync',
    desc: 'Fetch verified AMFI NAVs, NSE/BSE stock quotes, and RBI Treasury benchmarks.',
    icon: 'trending-up-outline',
  },
];

export default function PermissionScreen() {
  const router = useRouter();
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step Badge */}
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 3 OF 3</Text>
        </View>

        {/* Security Illustration / Lock Graphic */}
        <View style={styles.lockGraphicContainer}>
          <View style={[styles.lockCircleOuter, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EDE9FE' }]}>
            <View style={[styles.lockCircleInner, { backgroundColor: theme.primary }]}>
              <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Title & Explanations */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Allow Access
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          We need read-only access to analyze your investments. Your data is always secure, encrypted, and private.
        </Text>

        {/* Permission List */}
        <View style={styles.permissionsList}>
          {PERMISSION_ITEMS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.permCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color="#16865D" />
              </View>
              <View style={styles.permTextContainer}>
                <Text style={[styles.permTitle, { color: theme.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.permDesc, { color: theme.textSecondary }]}>
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Security Disclosures */}
        <View style={[styles.securityGuarantee, { backgroundColor: isDarkMode ? '#172033' : '#F8FAFC' }]}>
          <View style={styles.guaranteeRow}>
            <Ionicons name="shield-checkmark" size={16} color="#16865D" />
            <Text style={[styles.guaranteeText, { color: theme.textSecondary }]}>
              Read-Only: Zero withdrawal, trade execution, or payment capabilities.
            </Text>
          </View>
          <View style={styles.guaranteeRow}>
            <Ionicons name="key-outline" size={16} color="#6750D8" />
            <Text style={[styles.guaranteeText, { color: theme.textSecondary }]}>
              Zero credential storage: We use tokenized RBI AA & broker OAuth standards.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity
          style={[styles.allowBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/onboarding/success' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.allowBtnText}>Allow Access</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  stepBadge: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#EDE9FE',
    marginBottom: 20,
  },
  stepBadgeText: {
    color: '#6750D8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  lockGraphicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lockCircleOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  permissionsList: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  permCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#16865D15',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  permTextContainer: {
    flex: 1,
  },
  permTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  permDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  securityGuarantee: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guaranteeText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  allowBtn: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  allowBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
