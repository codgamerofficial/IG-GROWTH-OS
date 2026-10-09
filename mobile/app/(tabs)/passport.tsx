// =============================================================================
// PujaHop Kolkata Mobile: Digital Puja Passport Screen
// Section 31 & 40: Collectible festival stamps, visit counter, and area badges
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Award, CheckCircle2, MapPin, Footprints, Camera, Share2 } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { StampCard } from '../../src/components/passport/StampCard';
import { usePujaHop } from '../../src/hooks/usePujaHop';
import { useHaptics } from '../../src/hooks/useHaptics';

export function PassportScreen() {
  const { visits, pandals } = usePujaHop();
  const haptics = useHaptics();

  const totalVisited = visits.length;
  const totalPandals = pandals.length;
  const completionPct = Math.round((totalVisited / Math.max(totalPandals, 1)) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Passport Header Badge */}
        <View style={styles.headerBox}>
          <View style={styles.headerIcon}>
            <Award size={28} color={colors.antiqueGold} />
          </View>
          <Text style={styles.headerTitle}>Digital Puja Passport</Text>
          <Text style={styles.headerSubtitle}>Official 2026 Festival Darshan &amp; Exploration Collector</Text>

          {/* Stats Bar */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalVisited}</Text>
              <Text style={styles.statLabel}>STAMPS EARNED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completionPct}%</Text>
              <Text style={styles.statLabel}>COMPLETED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalPandals}</Text>
              <Text style={styles.statLabel}>CITY PANDALS</Text>
            </View>
          </View>
        </View>

        {/* Verification Transparency Notice */}
        <View style={styles.noticeBox}>
          <CheckCircle2 size={14} color={colors.success} />
          <Text style={styles.noticeText}>
            Stamps require physical GPS proximity verification or manual confirmed check-in. Zero fake visits.
          </Text>
        </View>

        {/* Stamps Gallery */}
        <View style={styles.stampsSection}>
          <Text style={styles.sectionTitle}>Your Verified Stamps ({visits.length})</Text>

          {visits.length === 0 ? (
            <View style={styles.emptyState}>
              <Award size={36} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Stamps Collected Yet</Text>
              <Text style={styles.emptySubtitle}>
                Visit a pandal, open its detail screen or bottom sheet, and tap &quot;STAMP&quot; to log your darshan.
              </Text>
            </View>
          ) : (
            <View style={styles.stampGrid}>
              {visits.map((v) => (
                <StampCard
                  key={v.id}
                  pandalName={v.pandal_name}
                  area={v.area}
                  visitedAt={v.visited_at}
                />
              ))}
            </View>
          )}
        </View>

        {/* Creator Attribution */}
        <View style={styles.footerCredit}>
          <Text style={styles.footerBrand}>PUJAHOP DIGITAL PASSPORT • 2026</Text>
          <Text style={styles.footerCreator}>Created &amp; Conceptualized by Saswata Dey (Riik)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default PassportScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBox: {
    backgroundColor: colors.cardDark,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.3)',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    borderWidth: 1,
    borderColor: colors.antiqueGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: colors.softGold,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.cardBorder,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(53, 201, 138, 0.08)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(53, 201, 138, 0.2)',
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    color: colors.success,
    fontSize: 11,
    lineHeight: 16,
  },
  stampsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  stampGrid: {
    gap: 12,
  },
  footerCredit: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  footerBrand: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerCreator: {
    color: colors.antiqueGold,
    fontSize: 11,
    fontWeight: '600',
  },
});
