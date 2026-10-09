// =============================================================================
// PujaHop Kolkata Mobile: Collectible Digital Passport Stamp
// Section 31 & 40: Ink-reveal visual stamp for visited pandals with date & verification badge
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface Props {
  pandalName: string;
  area: string;
  visitedAt: string;
}

export function StampCard({ pandalName, area, visitedAt }: Props) {
  const formattedDate = new Date(visitedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.stampBorder}>
      <View style={styles.stampInner}>
        <View style={styles.topRow}>
          <Text style={styles.stampLocation}>KOLKATA • 2026</Text>
          <CheckCircle2 size={12} color={colors.antiqueGold} />
        </View>

        <Text style={styles.pandalName} numberOfLines={2}>
          {pandalName}
        </Text>

        <Text style={styles.areaText}>{area.toUpperCase()}</Text>

        <View style={styles.visitedBadge}>
          <Text style={styles.visitedText}>OFFICIALLY STAMPED</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stampBorder: {
    padding: 2,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(214, 168, 79, 0.4)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(20, 18, 36, 0.6)',
  },
  stampInner: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(214, 168, 79, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stampLocation: {
    color: colors.softGold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  pandalName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  areaText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  visitedBadge: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(214, 168, 79, 0.2)',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visitedText: {
    color: colors.antiqueGold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'monospace',
  },
});
