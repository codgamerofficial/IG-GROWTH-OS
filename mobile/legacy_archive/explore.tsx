// =============================================================================
// RIIQX Mobile — All-Asset Screener & Intelligence Explorer Screen
// Smart Filters (Budget, Horizon, Risk, Liquidity) • Multi-Provider Live Feeds
// Matches Master Blueprint Specification & Design Mockup 1 & 5
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { Header } from '../../src/components/common/Header';
import { AssetDetailModal } from '../../src/components/common/AssetDetailModal';
import { MarketDataService } from '../../src/services/marketData/MarketDataService';
import { MarketQuote, AssetClass, AssetScreenerFilter } from '../../src/services/marketData/types';
import { lightColors, darkColors } from '../../src/theme/colors';

const ASSET_PILLS: Array<{ id: string; label: string; assetClass?: AssetClass }> = [
  { id: 'all', label: 'All Assets' },
  { id: 'indian_stock', label: 'Stocks (NSE/BSE)', assetClass: 'indian_stock' },
  { id: 'mutual_fund', label: 'Mutual Funds', assetClass: 'mutual_fund' },
  { id: 'us_stock', label: 'US Equities', assetClass: 'us_stock' },
  { id: 'etf', label: 'ETFs', assetClass: 'etf' },
  { id: 'fixed_deposit', label: 'Fixed Deposits', assetClass: 'fixed_deposit' },
  { id: 'government_bond', label: 'Bonds', assetClass: 'government_bond' },
  { id: 'reit', label: 'REITs / InvITs', assetClass: 'reit' },
  { id: 'gold', label: 'Gold / Silver', assetClass: 'gold' },
];

const BUDGET_PRESETS = [
  { label: 'All Budgets', value: undefined },
  { label: 'Under ₹500', value: 500 },
  { label: 'Under ₹5,000', value: 5000 },
  { label: 'Under ₹50,000', value: 50000 },
  { label: '₹1L+', value: 100000 },
];

export default function ExploreScreen() {
  const { isDarkMode, addHolding, formatMoney } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [query, setQuery] = useState('');
  const [selectedPill, setSelectedPill] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState<number | undefined>(undefined);
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'conservative' | 'moderate' | 'aggressive'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<MarketQuote | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filter: AssetScreenerFilter = {
      query: query.trim() || undefined,
      maxBudget: selectedBudget,
      assetClasses:
        selectedPill === 'all'
          ? undefined
          : [selectedPill as AssetClass],
    };

    MarketDataService.screenInstruments(filter)
      .then((data) => {
        if (isMounted) setResults(data);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, selectedPill, selectedBudget]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]} edges={['top']}>
      <Header title="Explore & Screener" subtitle="Multi-asset screener across Indian & Global markets" />

      {/* Search Input & Filter Toggle Bar */}
      <View style={styles.searchBarRow}>
        <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <Ionicons name="search" size={18} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search stocks, mutual funds, FDs, bonds, gold..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterToggleBtn,
            {
              backgroundColor: showFilters ? theme.primary : theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={showFilters ? '#FFFFFF' : theme.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Expandable Smart Screener Filter Drawer */}
      {showFilters && (
        <View style={[styles.filtersDrawer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>AVAILABLE BUDGET</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterPillsRow}>
              {BUDGET_PRESETS.map((b, idx) => (
                <TouchableOpacity
                  key={`budget_${idx}`}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedBudget === b.value ? theme.primary : isDarkMode ? '#252D3D' : '#F3F4F6',
                    },
                  ]}
                  onPress={() => setSelectedBudget(b.value)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: selectedBudget === b.value ? '#FFFFFF' : theme.textPrimary },
                    ]}
                  >
                    {b.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>RISK TOLERANCE</Text>
            <View style={styles.filterPillsRow}>
              {(['all', 'conservative', 'moderate', 'aggressive'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedRisk === r ? theme.primary : isDarkMode ? '#252D3D' : '#F3F4F6',
                    },
                  ]}
                  onPress={() => setSelectedRisk(r)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: selectedRisk === r ? '#FFFFFF' : theme.textPrimary },
                    ]}
                  >
                    {r.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Asset Category Horizontal Pills */}
      <View style={styles.pillsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsContainer}
        >
          {ASSET_PILLS.map((pill) => {
            const isSelected = selectedPill === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surface,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => setSelectedPill(pill.id)}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                  ]}
                >
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results List */}
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Querying verified multi-asset market feeds...
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Ionicons name="search-outline" size={32} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No assets match your filter</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
              Try broadening your budget or clearing keyword search terms.
            </Text>
          </View>
        ) : (
          <View style={styles.resultsGrid}>
            {results.map((quote, idx) => {
              const isGain = quote.dayChange >= 0;
              return (
                <TouchableOpacity
                  key={`res_${quote.symbol}_${idx}`}
                  style={[styles.assetCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
                  onPress={() => setSelectedQuote(quote)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleCol}>
                      <View style={styles.symbolBadgeRow}>
                        <Text style={[styles.assetSymbol, { color: theme.textPrimary }]}>
                          {quote.symbol}
                        </Text>
                        <View style={[styles.classTag, { backgroundColor: isDarkMode ? '#252D3D' : '#EDE9FE' }]}>
                          <Text style={[styles.classTagText, { color: theme.primary }]}>
                            {quote.assetClass.toUpperCase().replace('_', ' ')}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.assetName, { color: theme.textSecondary }]} numberOfLines={1}>
                        {quote.name}
                      </Text>
                    </View>

                    <View style={styles.cardPriceCol}>
                      <Text style={[styles.assetPrice, { color: theme.textPrimary }]}>
                        {quote.currency === 'INR' ? '₹' : '$'}{quote.price.toLocaleString('en-IN')}
                      </Text>
                      {quote.interestRate ? (
                        <View style={[styles.rateBadge, { backgroundColor: theme.positiveSubtle }]}>
                          <Text style={[styles.rateBadgeText, { color: theme.positiveText }]}>
                            {quote.interestRate}% p.a.
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.rateBadge,
                            { backgroundColor: isGain ? theme.positiveSubtle : theme.negativeSubtle },
                          ]}
                        >
                          <Text
                            style={[
                              styles.rateBadgeText,
                              { color: isGain ? theme.positiveText : theme.negativeText },
                            ]}
                          >
                            {isGain ? '+' : ''}{quote.dayChangePct}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Provenance & Key Metrics Footer */}
                  <View style={[styles.cardFooter, { borderTopColor: theme.cardBorderSubtle }]}>
                    <View style={styles.footerLeft}>
                      <View style={styles.sourceDot} />
                      <Text style={[styles.providerText, { color: theme.textMuted }]}>
                        {quote.providerName}
                      </Text>
                    </View>

                    <View style={styles.footerRight}>
                      {quote.peRatio && (
                        <Text style={[styles.metricSnippet, { color: theme.textSecondary }]}>
                          P/E {quote.peRatio}x
                        </Text>
                      )}
                      {quote.expenseRatio && (
                        <Text style={[styles.metricSnippet, { color: theme.textSecondary }]}>
                          TER {(quote.expenseRatio * 100).toFixed(2)}%
                        </Text>
                      )}
                      {quote.creditRating && (
                        <Text style={[styles.metricSnippet, { color: theme.positive }]}>
                          {quote.creditRating}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        quote={selectedQuote}
        visible={Boolean(selectedQuote)}
        onClose={() => setSelectedQuote(null)}
        onAddToPortfolio={(q) => {
          addHolding({
            symbol: q.symbol,
            name: q.name,
            assetClass: q.assetClass,
            quantity: q.assetClass === 'fixed_deposit' ? 1 : 10,
            averageBuyPrice: q.price,
            currentPrice: q.price,
            currency: q.currency,
            interestRatePct: q.interestRate,
          });
        }}
      />
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
  searchBarRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  searchBox: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  filterToggleBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersDrawer: {
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    gap: 10,
  },
  filterSection: {
    gap: 6,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  pillsWrapper: {
    marginBottom: 10,
  },
  pillsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultsGrid: {
    gap: 10,
  },
  assetCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleCol: {
    flex: 1,
    paddingRight: 10,
  },
  symbolBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  assetSymbol: {
    fontSize: 15,
    fontWeight: '800',
  },
  classTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  classTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  assetName: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardPriceCol: {
    alignItems: 'flex-end',
  },
  assetPrice: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  rateBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  rateBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#6750D8',
  },
  providerText: {
    fontSize: 10,
    fontWeight: '500',
  },
  footerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  metricSnippet: {
    fontSize: 10,
    fontWeight: '700',
  },
  loadingBox: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyBox: {
    padding: 30,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
  },
});
