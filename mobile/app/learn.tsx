// =============================================================================
// RIIQX Mobile — Screen 24: Education / Learn & Grow
// Curated fintech curriculum, regulatory guides, and investor literacy
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../src/context/RiiqxContext';
import { lightColors, darkColors } from '../src/theme/colors';

interface ArticleItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  content: string[];
}

const ARTICLES: ArticleItem[] = [
  {
    id: 'beginners',
    title: 'Investing for Beginners',
    subtitle: 'A complete step-by-step roadmap to start compounding wealth early in India.',
    category: 'Fundamentals',
    readTime: '6 min read',
    icon: 'school',
    color: '#6750D8',
    content: [
      '1. Pay off high-interest debt first before deploying long-term equity capital.',
      '2. Build an emergency fund covering 6 months of essential living expenses in liquid instruments or sweep FDs.',
      '3. Start with low-cost broad index funds (Nifty 50 or Sensex) to capture economic growth without stock-picking risk.',
      '4. Set up an automated monthly SIP to average out market volatility through dollar/rupee cost averaging.',
      '5. Diversify across asset classes: Equities for wealth creation, Fixed Income for safety, and Bullion as an inflation hedge.',
    ],
  },
  {
    id: 'mutual_funds',
    title: 'Mutual Funds Explained',
    subtitle: 'Types, direct vs regular plans, expense ratios, and tracking errors.',
    category: 'Mutual Funds',
    readTime: '8 min read',
    icon: 'pie-chart',
    color: '#16865D',
    content: [
      '• Direct vs Regular: Direct plans do not pay commissions to distributors, saving you 0.5%–1.5% annually in Total Expense Ratio (TER). Over 20 years, this difference can amount to lakhs in additional corpus.',
      '• Large Cap vs Flexi Cap: Large-cap funds invest in top 100 Indian companies. Flexi-cap funds offer fund managers the freedom to dynamically allocate across large, mid, and small-cap stocks.',
      '• Exit Loads & Taxation: Equity funds held > 12 months are subject to Long-Term Capital Gains (LTCG) at 12.5% on profits exceeding ₹1.25 Lakh per fiscal year.',
    ],
  },
  {
    id: 'us_stocks',
    title: 'US Stock Investing from India',
    subtitle: 'How to invest in Apple, Microsoft, and global tech under RBI’s LRS route.',
    category: 'Global Markets',
    readTime: '7 min read',
    icon: 'globe',
    color: '#2563EB',
    content: [
      '• RBI Liberalised Remittance Scheme (LRS): Allows resident Indians to remit up to $250,000 per financial year for permissible investments and education.',
      '• Tax Collected at Source (TCS): Remittances exceeding ₹7 Lakh per financial year attract TCS (adjustable against final annual income tax liability).',
      '• Currency Diversification: Historically, the USD has appreciated against the INR at ~3–4% annualized, providing an additional currency hedge to Indian portfolios.',
    ],
  },
  {
    id: 'gold_silver',
    title: 'Gold vs Silver',
    subtitle: 'Physical bullion, Sovereign Gold Bonds (SGBs), and Gold ETFs compared.',
    category: 'Commodities',
    readTime: '5 min read',
    icon: 'medal',
    color: '#D97706',
    content: [
      '• Sovereign Gold Bonds (SGBs): Issued by the Reserve Bank of India on behalf of the Government. Pay 2.5% annual interest semi-annually and capital gains upon redemption are tax-exempt for individuals.',
      '• Digital Gold & ETFs: Gold ETFs trade on NSE/BSE with high liquidity and physical gold backing without making charges or locker storage concerns.',
      '• Allocation Rule: Most financial planners recommend keeping 5%–10% of a multi-asset portfolio in precious metals for crisis resilience.',
    ],
  },
  {
    id: 'fixed_income',
    title: 'Debt & Fixed Deposits',
    subtitle: 'Sovereign Treasury Bills, Bank FDs, and DICGC ₹5 Lakh Insurance guarantee.',
    category: 'Fixed Income',
    readTime: '9 min read',
    icon: 'shield-checkmark',
    color: '#0D9488',
    content: [
      '• DICGC Deposit Insurance: Every depositor in an insured bank is insured up to ₹5,00,000 (principal + interest) across all deposits (savings, current, FD, RD) in that bank.',
      '• RBI Retail Direct: Enables retail investors to buy Government of India Treasury Bills (T-Bills) and dated sovereign securities directly with zero default risk.',
      '• Real Returns: Always calculate post-tax, post-inflation returns. If FD yield is 7% and inflation is 5.5%, your real pre-tax return is approximately 1.5%.',
    ],
  },
  {
    id: 'scam_protection',
    title: 'SEBI Compliance & Scam Alert',
    subtitle: 'Identifying fraudulent high-yield schemes, unregistered advisors, and fake IPOs.',
    category: 'Investor Safety',
    readTime: '4 min read',
    icon: 'alert-circle',
    color: '#D64B55',
    content: [
      '⚠️ Red Flag 1: Guaranteed High Returns. Legitimate financial markets cannot guarantee 20%–50% annual returns without extreme risk.',
      '⚠️ Red Flag 2: Unregistered Telegram / WhatsApp Tip Channels. SEBI regulations strictly prohibit unregistered entities from providing personalized trading calls or collecting investment funds.',
      '✅ Always verify that any investment advisor or research analyst possesses a valid SEBI Registration Number before trusting third-party recommendations.',
    ],
  },
];

export default function LearnAndGrowScreen() {
  const router = useRouter();
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'courses'>('articles');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Learn & Grow
        </Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['articles', 'videos', 'courses'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                isActive && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? '700' : '500' },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'articles' ? (
          <View style={styles.articlesList}>
            {ARTICLES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() => setSelectedArticle(item)}
                activeOpacity={0.75}
              >
                <View style={[styles.cardIconBox, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.metaRow}>
                    <Text style={[styles.categoryText, { color: item.color }]}>
                      {item.category.toUpperCase()}
                    </Text>
                    <Text style={[styles.readTimeText, { color: theme.textTertiary }]}>
                      {item.readTime}
                    </Text>
                  </View>

                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <Ionicons name="videocam-outline" size={40} color={theme.primary} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              {activeTab === 'videos' ? 'Video Masterclasses Coming Soon' : 'Interactive Courses In Development'}
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              We are working with accredited financial analysts to produce bite-sized multimedia guides for Indian & global investing.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Article Detail Modal */}
      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedArticle(null)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.canvas }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modalCategory, { color: selectedArticle?.color }]}>
                {selectedArticle?.category}
              </Text>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                {selectedArticle?.title}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.surface }]}
              onPress={() => setSelectedArticle(null)}
            >
              <Ionicons name="close" size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              {selectedArticle?.subtitle}
            </Text>

            <View style={styles.articleBody}>
              {selectedArticle?.content.map((paragraph, index) => (
                <View key={index} style={[styles.paraCard, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                  <Text style={[styles.paraText, { color: theme.textPrimary }]}>
                    {paragraph}
                  </Text>
                </View>
              ))}
            </View>

            <View style={[styles.disclaimerBox, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EDE9FE' }]}>
              <Ionicons name="information-circle" size={18} color="#6750D8" />
              <Text style={[styles.disclaimerText, { color: theme.textSecondary }]}>
                Educational purpose only. RIIQX does not provide personalized investment advice or guaranteed return securities.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB20',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabBtnText: {
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  articlesList: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  readTimeText: {
    fontSize: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  emptyContainer: {
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCategory: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  articleBody: {
    gap: 14,
    marginBottom: 24,
  },
  paraCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  paraText: {
    fontSize: 13,
    lineHeight: 20,
  },
  disclaimerBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
