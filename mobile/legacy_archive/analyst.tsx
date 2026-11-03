// =============================================================================
// RIIQX Mobile — AI Analyst Screen
// Conversational Research Assistant • Portfolio Diagnostics • Scenario Modeling
// Compliant with SEBI Research Analyst Guidelines: Zero Price Hallucinations
// Matches Master Blueprint Specification & Design Mockup 2 & 4
// =============================================================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { Header } from '../../src/components/common/Header';
import { AIAnalyst, AIResearchReport } from '../../src/services/aiAnalyst';
import { lightColors, darkColors } from '../../src/theme/colors';

const PROMPT_CHIPS = [
  { id: 'p1', label: '🔍 Portfolio Health Audit', query: 'Run a complete health and risk audit on my portfolio' },
  { id: 'p2', label: '⚖️ Concentration Risk', query: 'Analyze my sector and single-asset concentration risks' },
  { id: 'p3', label: '🆚 Compare Funds', query: 'Compare Parag Parikh Flexi Cap vs Nippon Small Cap' },
  { id: 'p4', label: '💧 Liquidity & Emergency Buffer', query: 'Test my portfolio liquidity and emergency cash runway' },
  { id: 'p5', label: '💵 Inflation & Tax Drag', query: 'Explain the impact of inflation and capital gains taxes' },
];

interface ChatEntry {
  id: string;
  sender: 'user' | 'assistant';
  content?: string;
  report?: AIResearchReport;
  timestamp: string;
}

export default function AnalystScreen() {
  const { isDarkMode, holdings, riskTolerance } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;
  const scrollViewRef = useRef<any>(null);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Initial welcome message with pre-baked health audit
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      id: 'init_welcome',
      sender: 'assistant',
      report: AIAnalyst.generatePortfolioHealthAudit(holdings, riskTolerance),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text || loading) return;

    const userEntry: ChatEntry = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userEntry]);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const report = await AIAnalyst.answerFinancialQuery(text, holdings, riskTolerance);

      const assistantEntry: ChatEntry = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        report,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantEntry]);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]} edges={['top']}>
      <Header title="RIIQX AI Analyst" subtitle="Grounded investment intelligence & scenario modeling" />

      {/* Preset Action Chips */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {PROMPT_CHIPS.map((chip) => (
            <TouchableOpacity
              key={chip.id}
              style={[
                styles.promptChip,
                { backgroundColor: theme.surface, borderColor: theme.cardBorder },
              ]}
              onPress={() => handleSend(chip.query)}
              activeOpacity={0.7}
            >
              <Text style={[styles.promptChipText, { color: theme.textPrimary }]}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Conversation Thread */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <View key={msg.id} style={styles.userBubbleWrapper}>
                <View style={[styles.userBubble, { backgroundColor: theme.primary }]}>
                  <Text style={styles.userBubbleText}>{msg.content}</Text>
                  <Text style={styles.userBubbleTime}>{msg.timestamp}</Text>
                </View>
              </View>
            );
          }

          const rep = msg.report;
          if (!rep) return null;

          return (
            <View key={msg.id} style={styles.assistantReportWrapper}>
              <View
                style={[
                  styles.reportCard,
                  { backgroundColor: theme.surface, borderColor: theme.cardBorder },
                ]}
              >
                {/* Report Header */}
                <View style={styles.reportHeader}>
                  <View style={styles.aiBadge}>
                    <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                  </View>
                  <View style={styles.reportTitleCol}>
                    <Text style={[styles.reportTitle, { color: theme.textPrimary }]}>{rep.title}</Text>
                    <Text style={[styles.reportMeta, { color: theme.textMuted }]}>
                      Analysis Date: {rep.analysisDate} · Grounded deterministic calculations
                    </Text>
                  </View>
                </View>

                {/* Deterministic Metrics Table */}
                {rep.deterministicMetrics && (
                  <View
                    style={[
                      styles.metricsBox,
                      { backgroundColor: isDarkMode ? '#1E2430' : '#F9FAFB', borderColor: theme.cardBorderSubtle },
                    ]}
                  >
                    <Text style={[styles.metricsBoxTitle, { color: theme.textSecondary }]}>
                      DETERMINISTIC PORTFOLIO METRICS
                    </Text>
                    <View style={styles.metricsGrid}>
                      {Object.entries(rep.deterministicMetrics).map(([key, val], idx) => (
                        <View key={`met_${idx}`} style={styles.metricItem}>
                          <Text style={[styles.metricItemKey, { color: theme.textMuted }]}>{key}</Text>
                          <Text style={[styles.metricItemVal, { color: theme.textPrimary }]}>{val}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Narrative Breakdown */}
                <Text style={[styles.narrativeText, { color: theme.textPrimary }]}>
                  {rep.narrativeExplanation}
                </Text>

                {/* Scenarios if present */}
                {rep.scenarios && (
                  <View style={styles.scenarioSection}>
                    <Text style={[styles.subSectionTitle, { color: theme.textPrimary }]}>
                      Scenario Projections
                    </Text>
                    <View style={[styles.scenarioMiniCard, { borderColor: theme.positive }]}>
                      <Text style={[styles.scenTitle, { color: theme.positive }]}>
                        {rep.scenarios.bull.title} (+{rep.scenarios.bull.projectedReturnPct}%)
                      </Text>
                      <Text style={[styles.scenDesc, { color: theme.textSecondary }]}>
                        {rep.scenarios.bull.assumption}
                      </Text>
                    </View>
                    <View style={[styles.scenarioMiniCard, { borderColor: theme.primary }]}>
                      <Text style={[styles.scenTitle, { color: theme.primary }]}>
                        {rep.scenarios.base.title} (+{rep.scenarios.base.projectedReturnPct}%)
                      </Text>
                      <Text style={[styles.scenDesc, { color: theme.textSecondary }]}>
                        {rep.scenarios.base.assumption}
                      </Text>
                    </View>
                    <View style={[styles.scenarioMiniCard, { borderColor: theme.negative }]}>
                      <Text style={[styles.scenTitle, { color: theme.negative }]}>
                        {rep.scenarios.bear.title} ({rep.scenarios.bear.projectedReturnPct}%)
                      </Text>
                      <Text style={[styles.scenDesc, { color: theme.textSecondary }]}>
                        {rep.scenarios.bear.assumption}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Data Provenance & Sources */}
                <View style={styles.provenanceRow}>
                  <Text style={[styles.provenanceTitle, { color: theme.textMuted }]}>
                    Verified Sources: {rep.dataSources.join(' · ')}
                  </Text>
                </View>

                {/* Statutory Regulatory Disclaimer */}
                <View
                  style={[
                    styles.disclaimerBox,
                    { backgroundColor: isDarkMode ? '#141821' : '#FFFBEB' },
                  ]}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#D97706" />
                  <Text style={[styles.disclaimerText, { color: isDarkMode ? '#FBBF24' : '#92400E' }]}>
                    {rep.disclaimer}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingBubbleText, { color: theme.textSecondary }]}>
              Calculating deterministic portfolio metrics & researching sources...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input Field Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View
          style={[
            styles.inputBar,
            { backgroundColor: theme.surface, borderTopColor: theme.cardBorder },
          ]}
        >
          <TextInput
            style={[
              styles.chatInput,
              {
                backgroundColor: isDarkMode ? '#141821' : '#F9FAFB',
                borderColor: theme.cardBorder,
                color: theme.textPrimary,
              },
            ]}
            placeholder="Ask AI Analyst (e.g. Test emergency fund or compare assets)..."
            placeholderTextColor={theme.textMuted}
            value={inputQuery}
            onChangeText={setInputQuery}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              { backgroundColor: inputQuery.trim() ? theme.primary : theme.cardBorder },
            ]}
            onPress={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  chipsWrapper: {
    paddingVertical: 6,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 16,
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
  },
  userBubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  userBubbleTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  assistantReportWrapper: {
    alignItems: 'flex-start',
  },
  reportCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTitleCol: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  reportMeta: {
    fontSize: 10,
    marginTop: 2,
  },
  metricsBox: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  metricsBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricItem: {
    width: '46%',
  },
  metricItemKey: {
    fontSize: 10,
    fontWeight: '500',
  },
  metricItemVal: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  narrativeText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  scenarioSection: {
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  scenarioMiniCard: {
    borderLeftWidth: 3,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: 6,
  },
  scenTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  scenDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  provenanceRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 8,
    marginBottom: 8,
  },
  provenanceTitle: {
    fontSize: 10,
    fontWeight: '600',
  },
  disclaimerBox: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    fontSize: 10,
    lineHeight: 14,
    flex: 1,
    fontWeight: '500',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
  },
  loadingBubbleText: {
    fontSize: 12,
  },
  inputBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
