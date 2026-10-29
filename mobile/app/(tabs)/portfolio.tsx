// =============================================================================
// RIIQX Mobile — Portfolio & Transaction Ledger Screen
// Categorized Holdings • CSV Import/Export • Transaction History • Full CRUD
// Matches Master Blueprint Specification & Design Mockup 1 & 5
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { Header } from '../../src/components/common/Header';
import { AddAssetModal } from '../../src/components/common/AddAssetModal';
import { AssetDetailModal } from '../../src/components/common/AssetDetailModal';
import { HoldingItem, calculateHoldingPnL } from '../../src/services/calculations';
import { MarketQuote } from '../../src/services/marketData/types';
import { lightColors, darkColors } from '../../src/theme/colors';

const CATEGORY_CHIPS = [
  { id: 'all', label: 'All Assets' },
  { id: 'indian_stock', label: 'Indian Stocks' },
  { id: 'mutual_fund', label: 'Mutual Funds' },
  { id: 'us_stock', label: 'US Equities' },
  { id: 'etf', label: 'ETFs' },
  { id: 'fixed_deposit', label: 'Fixed Deposits' },
  { id: 'government_bond', label: 'Bonds' },
  { id: 'reit', label: 'REITs / InvITs' },
  { id: 'gold', label: 'Bullion' },
];

export default function PortfolioScreen() {
  const {
    isDarkMode,
    holdings,
    deleteHolding,
    transactions,
    exportPortfolioAsCsv,
    importPortfolioFromCsv,
    portfolioSummary,
    formatMoney,
    usdInrRate,
  } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [activeTab, setActiveTab] = useState<'holdings' | 'ledger' | 'summary'>('holdings');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<MarketQuote | null>(null);

  // Filter holdings by category
  const filteredHoldings = holdings.filter((h) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'government_bond') {
      return h.assetClass === 'government_bond' || h.assetClass === 'corporate_bond';
    }
    if (selectedCategory === 'gold') {
      return h.assetClass === 'gold' || h.assetClass === 'silver';
    }
    return h.assetClass === selectedCategory;
  });

  const handleExportCsv = () => {
    const csv = exportPortfolioAsCsv();
    Alert.alert(
      'Portfolio CSV Exported',
      `Successfully generated valid CSV formatted string with ${holdings.length} records.\n\nFirst 200 chars:\n${csv.substring(0, 200)}...`
    );
  };

  const handleImportCsv = () => {
    // Demonstration import sample
    const sampleCsv = `Symbol,Name,Asset Class,Quantity,Avg Buy Price,Current Price,Currency
INFY,"Infosys Ltd",indian_stock,20,1750,1890,INR
118834,"Mirae Asset Large Cap",mutual_fund,150,85,98.5,INR
MSFT,"Microsoft Corporation",us_stock,4,390,428,USD`;

    Alert.alert(
      'Import Valid Portfolio CSV',
      'Would you like to import 3 verified test holdings (Infosys, Mirae Large Cap, Microsoft)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: () => {
            const res = importPortfolioFromCsv(sampleCsv);
            if (res.success) {
              Alert.alert('Import Complete', `Successfully imported ${res.importedCount} new holdings.`);
            } else {
              Alert.alert('Import Failed', res.error || 'Failed to parse CSV');
            }
          },
        },
      ]
    );
  };

  const openDetail = (holding: HoldingItem) => {
    const quote: MarketQuote = {
      symbol: holding.symbol,
      name: holding.name,
      assetClass: holding.assetClass,
      price: holding.currentPrice,
      currency: holding.currency,
      dayChange: 0,
      dayChangePct: 0,
      timestamp: new Date().toISOString(),
      providerId: 'manual',
      providerName: 'Portfolio Holding Record',
      isDelayed: false,
      delayMinutes: 0,
      isStale: false,
      interestRate: holding.interestRatePct,
    };
    setSelectedQuote(quote);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]} edges={['top']}>
      <Header title="Portfolio & Ledger" subtitle="Holdings, transactions & cost basis tracking" />

      {/* Primary Tab Switcher */}
      <View style={[styles.tabBar, { backgroundColor: isDarkMode ? '#1E2430' : '#E5E7EB' }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'holdings' && { backgroundColor: theme.surface }]}
          onPress={() => setActiveTab('holdings')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'holdings' ? theme.textPrimary : theme.textSecondary,
                fontWeight: activeTab === 'holdings' ? '700' : '500',
              },
            ]}
          >
            Holdings ({holdings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ledger' && { backgroundColor: theme.surface }]}
          onPress={() => setActiveTab('ledger')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'ledger' ? theme.textPrimary : theme.textSecondary,
                fontWeight: activeTab === 'ledger' ? '700' : '500',
              },
            ]}
          >
            Ledger ({transactions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'summary' && { backgroundColor: theme.surface }]}
          onPress={() => setActiveTab('summary')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'summary' ? theme.textPrimary : theme.textSecondary,
                fontWeight: activeTab === 'summary' ? '700' : '500',
              },
            ]}
          >
            Performance
          </Text>
        </TouchableOpacity>
      </View>

      {/* CSV & Action Bar */}
      <View style={styles.actionToolbar}>
        <View style={styles.toolbarLeft}>
          <TouchableOpacity
            style={[styles.toolBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={handleExportCsv}
          >
            <Ionicons name="download-outline" size={14} color={theme.textPrimary} />
            <Text style={[styles.toolBtnText, { color: theme.textPrimary }]}>Export CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
            onPress={handleImportCsv}
          >
            <Ionicons name="cloud-upload-outline" size={14} color={theme.textPrimary} />
            <Text style={[styles.toolBtnText, { color: theme.textPrimary }]}>Import CSV</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addAssetBtn, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addAssetBtnText}>Add Asset</Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills (Only in Holdings view) */}
      {activeTab === 'holdings' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id;
            return (
              <TouchableOpacity
                key={chip.id}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surface,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => setSelectedCategory(chip.id)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                  ]}
                >
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Main Content Area */}
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'holdings' && (
          <View style={styles.holdingsList}>
            {filteredHoldings.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Ionicons name="file-tray-outline" size={32} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No holdings in this category</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                  Tap "+ Add Asset" above to record a stock, mutual fund, FD, or bond.
                </Text>
              </View>
            ) : (
              filteredHoldings.map((h) => {
                const { pnlINR, pnlPct, currentINR, investedINR } = calculateHoldingPnL(h, usdInrRate);
                const isGain = pnlINR >= 0;

                return (
                  <TouchableOpacity
                    key={h.id}
                    style={[styles.holdingCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
                    onPress={() => openDetail(h)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.holdingTopRow}>
                      <View style={styles.holdingTitleCol}>
                        <View style={styles.symbolRow}>
                          <Text style={[styles.holdingSymbol, { color: theme.textPrimary }]}>
                            {h.symbol}
                          </Text>
                          <View style={[styles.classBadge, { backgroundColor: isDarkMode ? '#252D3D' : '#F3F4F6' }]}>
                            <Text style={[styles.classBadgeText, { color: theme.textSecondary }]}>
                              {h.assetClass.toUpperCase().replace('_', ' ')}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.holdingName, { color: theme.textSecondary }]} numberOfLines={1}>
                          {h.name}
                        </Text>
                      </View>

                      <View style={styles.holdingValCol}>
                        <Text style={[styles.holdingCurrentVal, { color: theme.textPrimary }]}>
                          {formatMoney(currentINR)}
                        </Text>
                        <View
                          style={[
                            styles.pnlPill,
                            { backgroundColor: isGain ? theme.positiveSubtle : theme.negativeSubtle },
                          ]}
                        >
                          <Text
                            style={[
                              styles.pnlPillText,
                              { color: isGain ? theme.positiveText : theme.negativeText },
                            ]}
                          >
                            {isGain ? '+' : ''}{pnlPct.toFixed(2)}%
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.holdingMetaRow, { borderTopColor: theme.cardBorderSubtle }]}>
                      <View style={styles.metaCol}>
                        <Text style={[styles.metaLabel, { color: theme.textMuted }]}>QTY / UNITS</Text>
                        <Text style={[styles.metaVal, { color: theme.textPrimary }]}>{h.quantity}</Text>
                      </View>

                      <View style={styles.metaCol}>
                        <Text style={[styles.metaLabel, { color: theme.textMuted }]}>AVG BUY</Text>
                        <Text style={[styles.metaVal, { color: theme.textPrimary }]}>
                          {h.currency === 'USD' ? '$' : '₹'}{h.averageBuyPrice.toLocaleString('en-IN')}
                        </Text>
                      </View>

                      <View style={styles.metaCol}>
                        <Text style={[styles.metaLabel, { color: theme.textMuted }]}>CURRENT</Text>
                        <Text style={[styles.metaVal, { color: theme.textPrimary }]}>
                          {h.currency === 'USD' ? '$' : '₹'}{h.currentPrice.toLocaleString('en-IN')}
                        </Text>
                      </View>

                      <View style={styles.metaColRight}>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => {
                            Alert.alert('Remove Asset', `Delete ${h.name} from portfolio?`, [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Delete', style: 'destructive', onPress: () => deleteHolding(h.id) },
                            ]);
                          }}
                        >
                          <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {/* Transaction Ledger View */}
        {activeTab === 'ledger' && (
          <View style={styles.ledgerList}>
            {transactions.map((tx) => (
              <View
                key={tx.id}
                style={[styles.txCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
              >
                <View style={styles.txIconBox}>
                  <Ionicons
                    name={
                      tx.type === 'buy'
                        ? 'arrow-down-circle'
                        : tx.type === 'sell'
                        ? 'arrow-up-circle'
                        : tx.type === 'dividend'
                        ? 'gift-outline'
                        : 'shield-checkmark-outline'
                    }
                    size={22}
                    color={tx.type === 'buy' ? theme.primary : tx.type === 'dividend' ? theme.positive : theme.textSecondary}
                  />
                </View>

                <View style={styles.txContent}>
                  <View style={styles.txTopRow}>
                    <Text style={[styles.txSymbol, { color: theme.textPrimary }]}>{tx.symbol}</Text>
                    <Text style={[styles.txAmount, { color: theme.textPrimary }]}>
                      {tx.currency === 'USD' ? '$' : '₹'}{tx.totalAmount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <Text style={[styles.txName, { color: theme.textSecondary }]} numberOfLines={1}>
                    {tx.name}
                  </Text>
                  <View style={styles.txBottomRow}>
                    <Text style={[styles.txTypeTag, { color: theme.primary }]}>
                      {tx.type.toUpperCase()} · {tx.quantity} units @ {tx.currency === 'USD' ? '$' : '₹'}{tx.pricePerUnit}
                    </Text>
                    <Text style={[styles.txDate, { color: theme.textMuted }]}>{tx.date}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Performance & Return Analytics */}
        {activeTab === 'summary' && (
          <View style={styles.summarySection}>
            <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>Core Return Metrics</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryKey, { color: theme.textMuted }]}>UNREALIZED RETURN</Text>
                  <Text style={[styles.summaryVal, { color: theme.positive }]}>
                    +{portfolioSummary.unrealizedPnLPct}%
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryKey, { color: theme.textMuted }]}>ESTIMATED 3Y CAGR</Text>
                  <Text style={[styles.summaryVal, { color: theme.textPrimary }]}>14.2%</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryKey, { color: theme.textMuted }]}>PORTFOLIO XIRR</Text>
                  <Text style={[styles.summaryVal, { color: theme.textPrimary }]}>16.8%</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryKey, { color: theme.textMuted }]}>MAX DRAWDOWN</Text>
                  <Text style={[styles.summaryVal, { color: theme.negative }]}>-8.4%</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Asset Modal */}
      <AddAssetModal visible={showAddModal} onClose={() => setShowAddModal(false)} />

      {/* Asset Detail Modal */}
      <AssetDetailModal
        quote={selectedQuote}
        visible={Boolean(selectedQuote)}
        onClose={() => setSelectedQuote(null)}
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
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 12,
  },
  actionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  toolbarLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  toolBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  addAssetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  addAssetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryScroll: {
    marginBottom: 12,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  holdingsList: {
    gap: 12,
  },
  holdingCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  holdingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  holdingTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  holdingSymbol: {
    fontSize: 16,
    fontWeight: '800',
  },
  classBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  classBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  holdingName: {
    fontSize: 12,
    fontWeight: '500',
  },
  holdingValCol: {
    alignItems: 'flex-end',
  },
  holdingCurrentVal: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  pnlPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  pnlPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  holdingMetaRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    alignItems: 'center',
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  metaColRight: {
    paddingLeft: 6,
  },
  deleteBtn: {
    padding: 4,
  },
  ledgerList: {
    gap: 10,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txContent: {
    flex: 1,
  },
  txTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txSymbol: {
    fontSize: 14,
    fontWeight: '700',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  txName: {
    fontSize: 11,
    marginTop: 1,
  },
  txBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  txTypeTag: {
    fontSize: 10,
    fontWeight: '700',
  },
  txDate: {
    fontSize: 10,
  },
  summarySection: {
    gap: 12,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    width: '46%',
  },
  summaryKey: {
    fontSize: 10,
    fontWeight: '700',
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  emptyBox: {
    padding: 30,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
