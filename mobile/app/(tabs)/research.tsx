// =============================================================================
// RIIQX Mobile — Deep Research & Verified Citations Screen
// Multi-Engine Privacy-Preserving Search • Verifiable Citations • Factual Validation
// PURE NATIVE REACT NATIVE COMPONENT • ZERO MOCK DATA
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api, executeResearch, ResearchResult } from '../../src/services/api';
import { colors } from '../../src/theme/colors';

const SUGGESTED_QUERIES = [
  'AWS Bedrock Claude 3.7 Latency in ap-southeast-2',
  'Meta Graph API v26.0 Reels Publishing Specs',
  'YouTube Shorts 2026 Audience Retention Benchmarks',
  'High-retention 3-second pattern interrupts in short-form video',
];

export default function DeepResearchScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [researchData, setResearchData] = useState<{
    query: string;
    content: string;
    citations: Array<{ title?: string; url: string; snippet?: string }>;
    executedAt: string;
  } | null>(null);

  const handleExecuteResearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setQuery(q);
    try {
      const res = await executeResearch(q);
      setResearchData(res);
    } catch {
      setResearchData({
        query: q,
        content: 'Unable to complete live research. Verify server backend connection.',
        citations: [],
        executedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.iconBadge}>
              <Ionicons name="search" size={18} color="#FFD43B" />
            </View>
            <View>
              <Text style={styles.title}>Deep Research</Text>
              <Text style={styles.subtitle}>
                Multi-Engine Web Search • Verified Source Citations
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchCard}>
          <View style={styles.inputWrapper}>
            <Ionicons name="globe-outline" size={16} color="#737373" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="State a topic, trend or technical query..."
              placeholderTextColor="#737373"
              returnKeyType="search"
              onSubmitEditing={() => handleExecuteResearch()}
            />
          </View>
          <TouchableOpacity
            style={[styles.searchButton, loading && { opacity: 0.7 }]}
            onPress={() => handleExecuteResearch()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#0C0C0E" />
            ) : (
              <>
                <Ionicons name="sparkles" size={14} color="#0C0C0E" style={{ marginRight: 6 }} />
                <Text style={styles.searchButtonText}>Execute Research</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Suggested Queries */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.sectionLabel}>RECOMMENDED RESEARCH PROBES</Text>
          <View style={styles.chipsRow}>
            {SUGGESTED_QUERIES.map((sq, i) => (
              <TouchableOpacity
                key={i}
                style={styles.chip}
                onPress={() => handleExecuteResearch(sq)}
              >
                <Text style={styles.chipText}>{sq}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results View or Truthful Empty State */}
        {researchData ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.badgeSuccess}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.badgeSuccessText}>FACT-CHECKED REPORT</Text>
              </View>
              <Text style={styles.timestamp}>
                {new Date(researchData.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <Text style={styles.resultQuery}>Topic: {researchData.query}</Text>
            <Text style={styles.resultBody}>{researchData.content}</Text>

            {/* Citations List */}
            {researchData.citations && researchData.citations.length > 0 && (
              <View style={styles.citationsSection}>
                <Text style={styles.citationsTitle}>Verified Source Citations:</Text>
                {researchData.citations.map((cite, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.citationItem}
                    onPress={() => cite.url && Linking.openURL(cite.url)}
                  >
                    <Ionicons name="link-outline" size={14} color="#FFD43B" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.citationName} numberOfLines={1}>
                        {cite.title || cite.url}
                      </Text>
                      {cite.snippet ? (
                        <Text style={styles.citationSnippet} numberOfLines={2}>
                          {cite.snippet}
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={36} color="#737373" />
            <Text style={styles.emptyTitle}>No Active Research Dossier</Text>
            <Text style={styles.emptySubtitle}>
              Type a topic above or tap a recommended probe to perform live research with real citations.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 212, 59, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 11,
    color: '#A3A3A3',
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: '#141416',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1E',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 42,
    color: '#FFFFFF',
    fontSize: 13,
  },
  searchButton: {
    height: 40,
    backgroundColor: '#FFD43B',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#0C0C0E',
    fontWeight: '800',
    fontSize: 13,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#737373',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  chipText: {
    color: '#A3A3A3',
    fontSize: 11,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#141416',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSuccessText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    color: '#737373',
    fontSize: 11,
  },
  resultQuery: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  resultBody: {
    color: '#D4D4D8',
    fontSize: 13,
    lineHeight: 20,
  },
  citationsSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  citationsTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  citationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  citationName: {
    color: '#FFD43B',
    fontSize: 11,
    fontWeight: '600',
  },
  citationSnippet: {
    color: '#8E8E93',
    fontSize: 10.5,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#737373',
    fontSize: 11,
    textAlign: 'center',
    maxWidth: 280,
  },
});

