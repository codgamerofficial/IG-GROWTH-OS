// =============================================================================
// RIIQX Mobile — Profile, Goal Planner & Legal Trust Center Screen
// Risk Tolerance Questionnaire • Goal Calculator • Legal Disclosures • Data Deletion
// Matches Master Blueprint Section 6 & 7 (SEBI Regulatory Compliance & Data Privacy)
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx, FinancialGoal } from '../../src/context/RiiqxContext';
import { Header } from '../../src/components/common/Header';
import { calculateGoalProjection } from '../../src/services/calculations';
import { lightColors, darkColors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const {
    userName,
    userEmail,
    baseCurrency,
    setBaseCurrency,
    isDarkMode,
    toggleDarkMode,
    riskTolerance,
    setRiskTolerance,
    goals,
    addGoal,
    exportPortfolioAsJson,
    resetAllUserData,
    formatMoney,
  } = useRiiqx();

  const theme = isDarkMode ? darkColors : lightColors;

  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // New goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<FinancialGoal['category']>('wealth_creation');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('2030-12-31');
  const [monthlySip, setMonthlySip] = useState('10000');

  const handleSaveGoal = () => {
    const targetNum = parseFloat(targetAmount);
    const currNum = parseFloat(currentAmount) || 0;
    const sipNum = parseFloat(monthlySip) || 0;

    if (!goalTitle.trim() || isNaN(targetNum) || targetNum <= 0) {
      Alert.alert('Required Fields', 'Please provide a goal title and target amount.');
      return;
    }

    addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
      targetAmount: targetNum,
      currentAmount: currNum,
      targetDate,
      monthlySip: sipNum,
      expectedReturnPct: 10.0,
      inflationPct: 6.0,
    });

    setShowAddGoalModal(false);
    setGoalTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    Alert.alert('Goal Created', `Goal "${goalTitle}" added to your wealth plan.`);
  };

  const handleExportJson = () => {
    const jsonStr = exportPortfolioAsJson();
    Alert.alert(
      'Full Portfolio JSON Exported',
      `Complete user portfolio, transactions and goals data exported.\n\nPayload Size: ${jsonStr.length} characters.`
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Wipe All Financial Data?',
      'This will permanently delete all your holdings, transactions, and goals from this device. This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: async () => {
            await resetAllUserData();
            Alert.alert('Data Deleted', 'All local portfolio data has been wiped.');
          },
        },
      ]
    );
  };

  // Legal Modal Content Generator
  const renderLegalContent = (key: string) => {
    switch (key) {
      case 'risk_disclosure':
        return {
          title: 'Investment Risk Disclosure & Disclaimer',
          body: `1. SEBI REGULATORY NOTICE:\nRIIQX is an educational portfolio intelligence and tracking technology platform. It is NOT registered with the Securities and Exchange Board of India (SEBI) as an Investment Adviser (RIA) or Research Analyst (RA).\n\n2. NO PERSONALIZED ADVICE:\nThe metrics, portfolio health audits, asset comparisons, and scenario projections provided within RIIQX are purely mathematical, descriptive, and educational. They do not constitute personalized investment advice or recommendations to buy, sell, or hold any security.\n\n3. CAPITAL RISK:\nInvestments in mutual funds, equities, ETFs, and REITs are subject to market risks, including the potential loss of principal capital. Past performance does not guarantee future results.\n\n4. DUE DILIGENCE:\nInvestors must independently evaluate offer documents (KIM/SID/DRHP) and consult a qualified, registered financial professional before making financial commitments.`,
        };
      case 'ai_disclosure':
        return {
          title: 'AI Usage Disclosure & Governance',
          body: `1. DETERMINISTIC ARCHITECTURE:\nRIIQX AI does NOT generate, guess, or invent market prices, NAVs, historical returns, or financial yields. All analysis is computed using strict mathematical algorithms before narrative explanation.\n\n2. PROVENANCE TRANSPARENCY:\nEvery AI research output includes explicit analysis dates, timestamps, cited data sources, and underlying macroeconomic assumptions.\n\n3. NO GUARANTEED FORECASTS:\nScenario analysis (Bull, Base, Bear) models hypothetical outcomes based on stated parameters and does not represent promised returns.`,
        };
      case 'data_sources':
        return {
          title: 'Data Sources, Freshness & Licenses',
          body: `• MFAPI.in: Real-time and historical Mutual Fund Net Asset Values (NAVs) sourced from AMFI.\n• Tapetide Gateway: Verified End-of-Day (EOD) Indian equities and indices (50 calls/day free tier quota).\n• Alpha Vantage: 15-minute delayed US equities, ETFs, and physical bullion spot prices.\n• RBI Retail Direct: Official Government of India sovereign bond coupon rates and benchmarks.\n• Institutional Bank Catalogs: Published fixed deposit card rates verified for DICGC ₹5 Lakh insurance eligibility.\n• Manual Tracking: Fully functional offline even when external APIs are disconnected.`,
        };
      case 'privacy_policy':
        return {
          title: 'Privacy Policy & Consent Management',
          body: `• ZERO CREDENTIAL SCRAPING: RIIQX never asks for, stores, or handles your bank passwords, net banking logins, or broker credentials.\n• ACCOUNT AGGREGATOR READY: Any future external financial data synchronization strictly utilizes RBI-licensed Account Aggregator consent handles.\n• LOCAL ENCRYPTION: Your portfolio holdings and transactions are stored locally with hardware-backed encryption.\n• DATA OWNERSHIP: You retain 100% ownership of your financial records. You can export or delete your account at any time.`,
        };
      case 'grievance':
        return {
          title: 'Grievance Redressal & Support',
          body: `For questions, data disputes, or privacy compliance requests:\n\n• Officer: Saswata Dey (Riik)\n• Email: support@riiqx.ai\n• Response Turnaround: Within 48 business hours\n• Jurisdiction: Kolkata, West Bengal, India`,
        };
      default:
        return { title: 'Legal Notice', body: 'RIIQX Master Legal & Compliance Framework.' };
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]} edges={['top']}>
      <Header title="Profile & Settings" subtitle="Goals, risk assessment & legal trust center" />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* User Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <View style={styles.profileTextCol}>
            <Text style={[styles.userNameText, { color: theme.textPrimary }]}>{userName}</Text>
            <Text style={[styles.userEmailText, { color: theme.textSecondary }]}>{userEmail}</Text>
            <View style={styles.profileBadgeRow}>
              <View style={[styles.profilePill, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.profilePillText, { color: '#6750D8' }]}>
                  {riskTolerance.toUpperCase()} RISK
                </Text>
              </View>
              <View style={[styles.profilePill, { backgroundColor: '#D1FAE5' }]}>
                <Text style={[styles.profilePillText, { color: '#065F46' }]}>INDIA (INR ₹)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Risk Capacity & Tolerance Questionnaire */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="compass-outline" size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Risk Tolerance Profile</Text>
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Determines your AI Portfolio Health audits and recommended asset allocation bands.
          </Text>

          <View style={styles.riskButtonsGrid}>
            {(['conservative', 'moderate', 'growth', 'aggressive'] as const).map((r) => {
              const isSelected = riskTolerance === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.riskBtn,
                    {
                      backgroundColor: isSelected ? theme.primary : isDarkMode ? '#1E2430' : '#F9FAFB',
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                    },
                  ]}
                  onPress={() => setRiskTolerance(r)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.riskBtnText,
                      { color: isSelected ? '#FFFFFF' : theme.textPrimary },
                    ]}
                  >
                    {r.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.riskBtnSub,
                      { color: isSelected ? 'rgba(255,255,255,0.8)' : theme.textMuted },
                    ]}
                  >
                    {r === 'conservative'
                      ? 'Capital preservation'
                      : r === 'moderate'
                      ? 'Balanced growth'
                      : r === 'growth'
                      ? 'Equity compounding'
                      : 'High volatility alpha'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Financial Goal Planner */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.goalHeaderRow}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy-outline" size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Financial Goals Planner</Text>
            </View>
            <TouchableOpacity
              style={[styles.addGoalBtn, { backgroundColor: theme.primary }]}
              onPress={() => setShowAddGoalModal(true)}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" />
              <Text style={styles.addGoalBtnText}>New Goal</Text>
            </TouchableOpacity>
          </View>

          {goals.map((g) => {
            const proj = calculateGoalProjection({
              currentSavings: g.currentAmount,
              monthlySip: g.monthlySip,
              targetAmount: g.targetAmount,
              targetDate: g.targetDate,
              expectedReturnRatePct: g.expectedReturnPct,
              inflationRatePct: g.inflationPct,
            });

            return (
              <View
                key={g.id}
                style={[
                  styles.goalItemCard,
                  { backgroundColor: isDarkMode ? '#1E2430' : '#F9FAFB', borderColor: theme.cardBorderSubtle },
                ]}
              >
                <View style={styles.goalItemTop}>
                  <Text style={[styles.goalItemTitle, { color: theme.textPrimary }]}>{g.title}</Text>
                  <View
                    style={[
                      styles.goalTrackPill,
                      { backgroundColor: proj.isFundedOnTrack ? theme.positiveSubtle : theme.warningSubtle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.goalTrackPillText,
                        { color: proj.isFundedOnTrack ? theme.positiveText : theme.warningText },
                      ]}
                    >
                      {proj.isFundedOnTrack ? 'ON TRACK' : 'NEEDS ATTENTION'}
                    </Text>
                  </View>
                </View>

                <View style={styles.goalItemGrid}>
                  <View style={styles.goalGridCol}>
                    <Text style={[styles.goalGridLabel, { color: theme.textMuted }]}>TARGET CORPUS</Text>
                    <Text style={[styles.goalGridVal, { color: theme.textPrimary }]}>
                      {formatMoney(g.targetAmount)}
                    </Text>
                  </View>
                  <View style={styles.goalGridCol}>
                    <Text style={[styles.goalGridLabel, { color: theme.textMuted }]}>INFLATION-ADJUSTED</Text>
                    <Text style={[styles.goalGridVal, { color: theme.textPrimary }]}>
                      {formatMoney(proj.inflationAdjustedTarget)}
                    </Text>
                  </View>
                  <View style={styles.goalGridCol}>
                    <Text style={[styles.goalGridLabel, { color: theme.textMuted }]}>MONTHLY SIP</Text>
                    <Text style={[styles.goalGridVal, { color: theme.primary }]}>
                      {formatMoney(g.monthlySip)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Preferences & App Settings */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 12 }]}>
            Application Preferences
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Dark Theme</Text>
              <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                Switch between analytical dark and clean editorial light mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#6750D8' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: theme.cardBorderSubtle }]}>
            <View style={styles.settingTextCol}>
              <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Base Currency</Text>
              <Text style={[styles.settingSub, { color: theme.textSecondary }]}>
                Primary valuation currency across all multi-asset conversions
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.currencySwitchBtn, { borderColor: theme.cardBorder }]}
              onPress={() => setBaseCurrency(baseCurrency === 'INR' ? 'USD' : 'INR')}
            >
              <Text style={[styles.currencySwitchText, { color: theme.primary }]}>
                {baseCurrency === 'INR' ? '₹ INR' : '$ USD'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Portability & GDPR Compliance */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 12 }]}>
            Data Portability & Isolation
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.cardBorderSubtle }]}
            onPress={handleExportJson}
          >
            <Ionicons name="code-download-outline" size={18} color={theme.textPrimary} />
            <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>Export Complete JSON Backup</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleResetData}>
            <Ionicons name="trash-outline" size={18} color={theme.negative} />
            <Text style={[styles.menuItemText, { color: theme.negative }]}>
              Wipe Data & Reset Local Cache
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Legal, Regulatory & Trust Center */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 12 }]}>
            Legal & Trust Center
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.cardBorderSubtle }]}
            onPress={() => setActiveLegalModal('risk_disclosure')}
          >
            <Ionicons name="shield-outline" size={18} color={theme.primary} />
            <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>
              Investment Risk Disclosure & SEBI Notice
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.cardBorderSubtle }]}
            onPress={() => setActiveLegalModal('ai_disclosure')}
          >
            <Ionicons name="sparkles-outline" size={18} color={theme.primary} />
            <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>
              AI Usage Disclosure & Governance
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.cardBorderSubtle }]}
            onPress={() => setActiveLegalModal('data_sources')}
          >
            <Ionicons name="server-outline" size={18} color={theme.primary} />
            <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>
              Data Sources, Freshness & Licenses
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.cardBorderSubtle }]}
            onPress={() => setActiveLegalModal('privacy_policy')}
          >
            <Ionicons name="lock-closed-outline" size={18} color={theme.primary} />
            <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>
              Privacy Policy & Consent Framework
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveLegalModal('grievance')}
          >
            <Ionicons name="help-circle-outline" size={18} color={theme.primary} />
            <Text style={[styles.menuItemText, { color: theme.textPrimary }]}>
              Grievance Redressal & Support
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Footer Brand Credit */}
        <View style={styles.footerCredit}>
          <Text style={[styles.footerCreditBrand, { color: theme.textMuted }]}>
            RIIQX Intelligence v2.0.0
          </Text>
          <Text style={[styles.footerCreditCopy, { color: theme.textMuted }]}>
            Invest smarter. Understand deeper. Build wealth with clarity.
          </Text>
        </View>
      </ScrollView>

      {/* Legal Text Modal */}
      {activeLegalModal && (
        <Modal visible={true} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {renderLegalContent(activeLegalModal).title}
                </Text>
                <TouchableOpacity onPress={() => setActiveLegalModal(null)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={22} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBodyScroll}>
                <Text style={[styles.modalBodyText, { color: theme.textSecondary }]}>
                  {renderLegalContent(activeLegalModal).body}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* New Goal Modal */}
      {showAddGoalModal && (
        <Modal visible={true} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Add Financial Goal</Text>
                <TouchableOpacity onPress={() => setShowAddGoalModal(false)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={22} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBodyScroll}>
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>GOAL TITLE</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: isDarkMode ? '#141821' : '#F9FAFB', borderColor: theme.cardBorder, color: theme.textPrimary }]}
                    placeholder="e.g. Dream House Downpayment"
                    placeholderTextColor={theme.textMuted}
                    value={goalTitle}
                    onChangeText={setGoalTitle}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>TARGET AMOUNT (₹)</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: isDarkMode ? '#141821' : '#F9FAFB', borderColor: theme.cardBorder, color: theme.textPrimary }]}
                    placeholder="e.g. 2000000"
                    placeholderTextColor={theme.textMuted}
                    value={targetAmount}
                    onChangeText={setTargetAmount}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>CURRENT ACCUMULATED (₹)</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: isDarkMode ? '#141821' : '#F9FAFB', borderColor: theme.cardBorder, color: theme.textPrimary }]}
                    placeholder="e.g. 500000"
                    placeholderTextColor={theme.textMuted}
                    value={currentAmount}
                    onChangeText={setCurrentAmount}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>MONTHLY SIP CONTRIBUTION (₹)</Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: isDarkMode ? '#141821' : '#F9FAFB', borderColor: theme.cardBorder, color: theme.textPrimary }]}
                    placeholder="e.g. 15000"
                    placeholderTextColor={theme.textMuted}
                    value={monthlySip}
                    onChangeText={setMonthlySip}
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.saveGoalBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSaveGoal}
                >
                  <Text style={styles.saveGoalBtnText}>Save Financial Goal</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileTextCol: {
    flex: 1,
  },
  userNameText: {
    fontSize: 17,
    fontWeight: '800',
  },
  userEmailText: {
    fontSize: 12,
    marginTop: 1,
  },
  profileBadgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  profilePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  profilePillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  sectionDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  riskButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  riskBtn: {
    width: '48%',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  riskBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  riskBtnSub: {
    fontSize: 10,
    marginTop: 2,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addGoalBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  goalItemCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  goalItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalItemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  goalTrackPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  goalTrackPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  goalItemGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalGridCol: {
    flex: 1,
  },
  goalGridLabel: {
    fontSize: 8,
    fontWeight: '700',
  },
  goalGridVal: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 11,
    marginTop: 2,
  },
  currencySwitchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  currencySwitchText: {
    fontSize: 12,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  menuItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  footerCredit: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  footerCreditBrand: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerCreditCopy: {
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    paddingRight: 10,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBodyScroll: {
    marginBottom: 10,
  },
  modalBodyText: {
    fontSize: 13,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  formInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  saveGoalBtn: {
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveGoalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
