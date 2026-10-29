// =============================================================================
// RIIQX Mobile — Screen 30: Help & Support
// Support knowledge base, searchable FAQs, and Grievance Redressal
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../src/context/RiiqxContext';
import { lightColors, darkColors } from '../src/theme/colors';

interface FAQItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const FAQS: FAQItem[] = [
  {
    id: 'f1',
    topic: 'Account & Login',
    question: 'How do I enable Biometric (Face ID / Fingerprint) Login?',
    answer: 'Navigate to Profile > Security (Face ID, PIN, 2FA) and toggle Biometric Authentication. Your device hardware securely verifies your biometrics; RIIQX never transmits or stores raw biometric data.',
    icon: 'finger-print',
  },
  {
    id: 'f2',
    topic: 'Investment Tracking',
    question: 'How often are Mutual Fund NAVs and Stock quotes updated?',
    answer: 'AMFI Mutual Fund NAVs update every business night between 9:00 PM and 11:30 PM IST via MFAPI.in. Indian stock quotes from NSE/BSE reflect end-of-day market closes or periodic 15-minute delayed ticks depending on API quotas. US Stocks and Precious Metals update via licensed daily feeds.',
    icon: 'sync',
  },
  {
    id: 'f3',
    topic: 'AI Recommendations',
    question: 'Is RIIQX AI Analyst considered registered SEBI financial advice?',
    answer: 'No. RIIQX AI Analyst provides algorithmic portfolio reviews, risk evaluations, and scenario analyses based strictly on verified inputs. It does NOT provide registered investment advisory or guaranteed returns. Consult a SEBI-registered Investment Adviser (RIA) for personalized financial planning.',
    icon: 'sparkles',
  },
  {
    id: 'f4',
    topic: 'Privacy & Security',
    question: 'Can RIIQX execute trades or withdraw funds from my broker?',
    answer: 'Absolutely not. RIIQX is strictly read-only. We do not store broker trading PINs, bank passwords, or debit permissions. We cannot place orders, transfer money, or modify your brokerage positions.',
    icon: 'shield-checkmark',
  },
  {
    id: 'f5',
    topic: 'Privacy & Security',
    question: 'How can I permanently delete my account and financial data?',
    answer: 'Go to Profile > Delete Account. Upon confirmation, all your portfolio holdings, transactions, snapshots, and personal identifiers are immediately and irreversibly purged from our database.',
    icon: 'trash',
  },
  {
    id: 'f6',
    topic: 'Investment Tracking',
    question: 'What is the DICGC guarantee on Bank Fixed Deposits?',
    answer: 'Deposits in insured banks in India are protected by the Deposit Insurance and Credit Guarantee Corporation (DICGC), an RBI subsidiary, up to ₹5,00,000 per depositor per bank.',
    icon: 'business',
  },
];

export default function HelpAndSupportScreen() {
  const router = useRouter();
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('f1');
  const [showContactModal, setShowContactModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleSendMessage = () => {
    if (!supportMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setShowContactModal(false);
      setSupportMessage('');
    }, 1500);
  };

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
          Help & Support
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <Ionicons name="search" size={18} color={theme.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search FAQs, topics, or issues..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Quick Topics */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          FREQUENTLY ASKED QUESTIONS
        </Text>

        <View style={styles.faqList}>
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <View
                key={faq.id}
                style={[
                  styles.faqCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isExpanded ? theme.primary : theme.cardBorder,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.faqQuestionRow}
                  onPress={() => toggleFaq(faq.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.faqIconBox, { backgroundColor: isDarkMode ? '#1E1B4B' : '#EDE9FE' }]}>
                    <Ionicons name={faq.icon} size={16} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.faqTopic, { color: theme.primary }]}>
                      {faq.topic}
                    </Text>
                    <Text style={[styles.faqQuestion, { color: theme.textPrimary }]}>
                      {faq.question}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.textTertiary}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={[styles.faqAnswerBox, { borderTopColor: theme.cardBorder }]}>
                    <Text style={[styles.faqAnswerText, { color: theme.textSecondary }]}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Grievance Redressal Card */}
        <View style={[styles.grievanceCard, { backgroundColor: isDarkMode ? '#172033' : '#F8FAFC' }]}>
          <Ionicons name="shield-checkmark-outline" size={20} color={theme.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.grievanceTitle, { color: theme.textPrimary }]}>
              Grievance Redressal Officer
            </Text>
            <Text style={[styles.grievanceDesc, { color: theme.textSecondary }]}>
              For compliance queries, regulatory issues, or unresolved service grievances:
            </Text>
            <Text style={[styles.grievanceEmail, { color: theme.primary }]}>
              compliance@riiqx.com
            </Text>
          </View>
        </View>

        {/* Contact Support Button */}
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: theme.primary }]}
          onPress={() => setShowContactModal(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" />
          <Text style={styles.contactBtnText}>Contact Support Team</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Contact Support Modal */}
      <Modal
        visible={showContactModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Contact Support
              </Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)}>
                <Ionicons name="close" size={22} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {messageSent ? (
              <View style={styles.sentContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#16865D" />
                <Text style={[styles.sentTitle, { color: theme.textPrimary }]}>
                  Ticket Created!
                </Text>
                <Text style={[styles.sentSubtitle, { color: theme.textSecondary }]}>
                  Our support desk has received your query. We will respond within 4 business hours.
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
                  How can we help you today?
                </Text>
                <TextInput
                  style={[
                    styles.supportTextArea,
                    {
                      backgroundColor: theme.canvas,
                      color: theme.textPrimary,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                  placeholder="Describe your issue or question in detail..."
                  placeholderTextColor={theme.textTertiary}
                  multiline
                  numberOfLines={4}
                  value={supportMessage}
                  onChangeText={setSupportMessage}
                />

                <TouchableOpacity
                  style={[styles.sendBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSendMessage}
                  activeOpacity={0.85}
                >
                  <Text style={styles.sendBtnText}>Submit Support Request</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  faqList: {
    gap: 10,
    marginBottom: 24,
  },
  faqCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  faqIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqTopic: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  faqAnswerBox: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  faqAnswerText: {
    fontSize: 12,
    lineHeight: 18,
  },
  grievanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    gap: 12,
    marginBottom: 20,
  },
  grievanceTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  grievanceDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  grievanceEmail: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  contactBtn: {
    height: 50,
    borderRadius: 14,
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
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  supportTextArea: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 13,
    marginBottom: 16,
  },
  sendBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  sentTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sentSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
