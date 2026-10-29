// =============================================================================
// RIIQX Mobile — Screen 9: Connect Accounts
// Secure account connection wizard with read-only permission disclosures
// =============================================================================

import React, { useState } from 'react';
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

interface AccountOption {
  id: string;
  title: string;
  subtitle: string;
  providers: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const ACCOUNT_OPTIONS: AccountOption[] = [
  {
    id: 'brokerage',
    title: 'Brokerage Accounts',
    subtitle: 'Stocks, ETFs, F&O holdings',
    providers: 'Zerodha, Groww, Upstox, Angel One',
    icon: 'trending-up',
    color: '#6750D8',
  },
  {
    id: 'bank',
    title: 'Bank Accounts',
    subtitle: 'Savings, Fixed Deposits & Recurring Deposits',
    providers: 'HDFC, SBI, ICICI, Axis Bank',
    icon: 'business',
    color: '#16865D',
  },
  {
    id: 'mf',
    title: 'MF Platforms',
    subtitle: 'Direct Mutual Funds & SIP schedules',
    providers: 'CAMS, KFintech, MF Central',
    icon: 'pie-chart',
    color: '#D97706',
  },
  {
    id: 'global',
    title: 'Global Accounts',
    subtitle: 'US Equities, Global ETFs & Cash',
    providers: 'INDmoney, Vested, Interactive Brokers',
    icon: 'globe',
    color: '#2563EB',
  },
  {
    id: 'crypto',
    title: 'Crypto Exchanges',
    subtitle: 'Bitcoin, Ethereum & Web3 wallets',
    providers: 'CoinDCX, WazirX, Binance, Ledger',
    icon: 'logo-bitcoin',
    color: '#F59E0B',
  },
];

export default function ConnectAccountsScreen() {
  const router = useRouter();
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [connectedIds, setConnectedIds] = useState<string[]>(['brokerage']);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const toggleConnect = (id: string) => {
    if (connectedIds.includes(id)) {
      setConnectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setConnectingId(id);
      setTimeout(() => {
        setConnectedIds((prev) => [...prev, id]);
        setConnectingId(null);
      }, 700);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 2 OF 3</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Connect Your Accounts
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Link your accounts for unified portfolio intelligence, or continue with manual entry.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Assurance Banner */}
        <View style={[styles.securityCard, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EEF2FF', borderColor: theme.primary }]}>
          <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.securityTitle, { color: theme.primary }]}>
              Bank-Grade Read-Only Sync
            </Text>
            <Text style={[styles.securityDesc, { color: theme.textSecondary }]}>
              RIIQX never stores bank passwords, broker MPINs, or places trades. 256-bit encrypted.
            </Text>
          </View>
        </View>

        {/* Account Cards */}
        <View style={styles.list}>
          {ACCOUNT_OPTIONS.map((acc) => {
            const isConnected = connectedIds.includes(acc.id);
            const isConnecting = connectingId === acc.id;

            return (
              <View
                key={acc.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isConnected ? theme.primary : theme.cardBorder,
                  },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: `${acc.color}15` }]}>
                  <Ionicons name={acc.icon} size={22} color={acc.color} />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                    {acc.title}
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                    {acc.subtitle}
                  </Text>
                  <Text style={[styles.cardProviders, { color: theme.textTertiary }]}>
                    {acc.providers}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    isConnected
                      ? { backgroundColor: '#16865D15', borderColor: '#16865D' }
                      : { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => toggleConnect(acc.id)}
                  activeOpacity={0.8}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>...</Text>
                  ) : isConnected ? (
                    <View style={styles.connectedRow}>
                      <Ionicons name="checkmark-circle" size={14} color="#16865D" />
                      <Text style={[styles.actionBtnText, { color: '#16865D' }]}>Linked</Text>
                    </View>
                  ) : (
                    <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Connect</Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Manual Tracker Reminder */}
        <View style={styles.manualNotice}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textTertiary} />
          <Text style={[styles.manualNoticeText, { color: theme.textTertiary }]}>
            Prefer manual entry? You can add, edit, or import CSV holdings anytime from your Portfolio.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/onboarding/permission' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#EDE9FE',
    marginBottom: 8,
  },
  stepBadgeText: {
    color: '#6750D8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  securityDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  cardProviders: {
    fontSize: 10,
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  manualNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 4,
  },
  manualNoticeText: {
    fontSize: 11,
    flex: 1,
    lineHeight: 15,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  continueBtn: {
    height: 52,
    borderRadius: 16,
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
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
