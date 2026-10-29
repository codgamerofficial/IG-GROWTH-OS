// =============================================================================
// RIIQX Mobile — Wealth Dashboard (Home Screen)
// Total Net Worth • Allocation Donut • Health Score • Maturities • AI Feed
// Matches Master Blueprint Specification & Design Mockups 1, 2, 4 & 5
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { Header } from '../../src/components/common/Header';
import { AllocationChart } from '../../src/components/common/AllocationChart';
import { AddAssetModal } from '../../src/components/common/AddAssetModal';
import { lightColors, darkColors } from '../../src/theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, portfolioSummary, holdings, goals, formatMoney } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const isPositive = portfolioSummary.unrealizedPnL >= 0;

  // Upcoming fixed income maturities
  const upcomingMaturities = holdings.filter((h) => h.maturityDate);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]} edges={['top']}>
      <Header />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        {/* Hero Net Worth Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={[styles.heroLabel, { color: theme.textMuted }]}>TOTAL PORTFOLIO VALUE</Text>
              <Text style={[styles.heroValue, { color: theme.textPrimary }]}>
                {formatMoney(portfolioSummary.totalCurrentValue)}
              </Text>
            </View>

            <View
              style={[
                styles.pnlBadge,
                { backgroundColor: isPositive ? theme.positiveSubtle : theme.negativeSubtle },
              ]}
            >
              <Ionicons
                name={isPositive ? 'arrow-up-circle' : 'arrow-down-circle'}
                size={16}
                color={isPositive ? theme.positiveText : theme.negativeText}
              />
              <Text
                style={[
                  styles.pnlBadgeText,
                  { color: isPositive ? theme.positiveText : theme.negativeText },
                ]}
              >
                {isPositive ? '+' : ''}{portfolioSummary.unrealizedPnLPct}%
              </Text>
            </View>
          </View>

          {/* Invested vs P&L row */}
          <View style={[styles.heroSubRow, { borderTopColor: theme.cardBorderSubtle }]}>
            <View style={styles.heroSubCol}>
              <Text style={[styles.subColLabel, { color: theme.textMuted }]}>Invested Capital</Text>
              <Text style={[styles.subColValue, { color: theme.textPrimary }]}>
                {formatMoney(portfolioSummary.totalInvested)}
              </Text>
            </View>

            <View style={styles.heroSubCol}>
              <Text style={[styles.subColLabel, { color: theme.textMuted }]}>Unrealized Profit/Loss</Text>
              <Text
                style={[
                  styles.subColValue,
                  { color: isPositive ? theme.positive : theme.negative },
                ]}
              >
                {isPositive ? '+' : ''}{formatMoney(portfolioSummary.unrealizedPnL)}
              </Text>
            </View>
          </View>

          {/* Period selector */}
          <View style={[styles.periodBar, { backgroundColor: isDarkMode ? '#1E2430' : '#F9FAFB' }]}>
            {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodBtn,
                  selectedPeriod === period && {
                    backgroundColor: theme.primary,
                    borderRadius: 8,
                  },
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: selectedPeriod === period ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: selectedPeriod === period ? '700' : '500',
                    },
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Action Bar */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="add" size={20} color="#6750D8" />
            </View>
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Add Asset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/(tabs)/analyst')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="sparkles" size={18} color="#16865D" />
            </View>
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>AI Audit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/(tabs)/explore')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="search" size={18} color="#2563EB" />
            </View>
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Screener</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={() => router.push('/(tabs)/portfolio')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="receipt-outline" size={18} color="#D97706" />
            </View>
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Ledger</Text>
          </TouchableOpacity>
        </View>

        {/* Allocation Donut & Breakdown */}
        <AllocationChart
          allocation={portfolioSummary.allocation}
          totalValue={portfolioSummary.totalCurrentValue}
        />

        {/* Portfolio Health & Risk Score */}
        <View style={[styles.healthCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.healthTopRow}>
            <View style={styles.healthScoreBadge}>
              <Text style={styles.healthScoreNum}>{portfolioSummary.healthScore}</Text>
              <Text style={styles.healthScoreMax}>/100</Text>
            </View>
            <View style={styles.healthTextCol}>
              <View style={styles.healthTitleRow}>
                <Text style={[styles.healthTitle, { color: theme.textPrimary }]}>Portfolio Health Score</Text>
                <View style={[styles.healthPill, { backgroundColor: theme.positiveSubtle }]}>
                  <Text style={[styles.healthPillText, { color: theme.positiveText }]}>
                    {portfolioSummary.healthStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.healthDesc, { color: theme.textSecondary }]}>
                {portfolioSummary.healthScore >= 75
                  ? `Balanced multi-asset cushioning across ${portfolioSummary.allocation.length} asset classes with low single-stock correlation.`
                  : `Elevated concentration in ${portfolioSummary.topAsset} (${portfolioSummary.topConcentrationPct}%). Consider rebalancing.`}
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming Maturities & Liquidity Tracker */}
        {upcomingMaturities.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <View style={styles.cardHeaderRow}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Upcoming Maturities</Text>
              <Ionicons name="calendar-outline" size={18} color={theme.textMuted} />
            </View>
            {upcomingMaturities.map((item) => (
              <View key={item.id} style={[styles.maturityRow, { borderBottomColor: theme.cardBorderSubtle }]}>
                <View style={styles.maturityIconBox}>
                  <Ionicons name="shield-checkmark" size={18} color={theme.primary} />
                </View>
                <View style={styles.maturityTextCol}>
                  <Text style={[styles.maturityName, { color: theme.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.maturityDate, { color: theme.textMuted }]}>
                    Maturity: {item.maturityDate} {item.interestRatePct ? `· ${item.interestRatePct}% p.a.` : ''}
                  </Text>
                </View>
                <Text style={[styles.maturityAmount, { color: theme.textPrimary }]}>
                  {formatMoney(item.quantity * item.currentPrice)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Financial Goals Tracker */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Financial Goals Progress</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Text style={[styles.viewAllText, { color: theme.primary }]}>Plan More</Text>
            </TouchableOpacity>
          </View>

          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            return (
              <View key={g.id} style={styles.goalRow}>
                <View style={styles.goalTitleRow}>
                  <Text style={[styles.goalTitle, { color: theme.textPrimary }]}>{g.title}</Text>
                  <Text style={[styles.goalPct, { color: theme.textSecondary }]}>{pct}%</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#2D3748' : '#F3F4F6' }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: pct >= 80 ? theme.positive : theme.primary,
                      },
                    ]}
                  />
                </View>
                <View style={styles.goalBottomRow}>
                  <Text style={[styles.goalValues, { color: theme.textMuted }]}>
                    {formatMoney(g.currentAmount)} of {formatMoney(g.targetAmount)}
                  </Text>
                  <Text style={[styles.goalTargetDate, { color: theme.textMuted }]}>
                    Target: {g.targetDate}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* AI Portfolio Observation Card */}
        <View style={[styles.aiCard, { backgroundColor: isDarkMode ? '#1E2430' : '#F5F3FF', borderColor: theme.primary }]}>
          <View style={styles.aiCardHeader}>
            <View style={styles.aiIconBadge}>
              <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            </View>
            <Text style={[styles.aiCardTitle, { color: theme.primary }]}>RIIQX AI RESEARCH INSIGHT</Text>
          </View>
          <Text style={[styles.aiCardBody, { color: theme.textPrimary }]}>
            Your multi-asset allocation maintains strong downside resistance. Equity represents{' '}
            {portfolioSummary.allocation
              .filter((a) => ['indian_stock', 'mutual_fund', 'us_stock'].includes(a.assetClass))
              .reduce((s, a) => s + a.percentage, 0)
              .toFixed(1)}
            % while fixed-income & sovereign debt form a reliable inflation-hedged foundation.
          </Text>
          <TouchableOpacity
            style={[styles.aiActionBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/(tabs)/analyst')}
          >
            <Text style={styles.aiActionBtnText}>Ask AI Analyst</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Asset Modal */}
      <AddAssetModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  heroValue: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pnlBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  heroSubRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    marginBottom: 14,
  },
  heroSubCol: {
    flex: 1,
  },
  subColLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  subColValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  periodBar: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 11,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  healthCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  healthTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  healthScoreBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthScoreNum: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  healthScoreMax: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    fontWeight: '700',
  },
  healthTextCol: {
    flex: 1,
  },
  healthTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  healthTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  healthPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  healthPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  healthDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  maturityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  maturityIconBox: {
    marginRight: 10,
  },
  maturityTextCol: {
    flex: 1,
  },
  maturityName: {
    fontSize: 13,
    fontWeight: '600',
  },
  maturityDate: {
    fontSize: 11,
    marginTop: 2,
  },
  maturityAmount: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  goalRow: {
    marginBottom: 12,
  },
  goalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  goalTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  goalPct: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalValues: {
    fontSize: 10,
  },
  goalTargetDate: {
    fontSize: 10,
  },
  aiCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  aiCardBody: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  aiActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  aiActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
