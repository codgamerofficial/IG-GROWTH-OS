// =============================================================================
// PujaHop Kolkata Mobile: Pandal Opening Status & Provenance Badges
// Sections 14 & 45: Honest status indicators without defaulting everything to OPEN
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PandalOpeningStatus } from '../../../../src/lib/types/pujahop';
import { colors } from '../../theme/colors';

interface StatusBadgeProps {
  status: PandalOpeningStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'OPEN':
        return {
          bg: 'rgba(53, 201, 138, 0.15)',
          border: 'rgba(53, 201, 138, 0.4)',
          text: colors.success,
          label: 'OPEN FOR DARSHAN',
        };
      case 'EARLY OPENING':
        return {
          bg: 'rgba(214, 168, 79, 0.15)',
          border: 'rgba(214, 168, 79, 0.4)',
          text: colors.softGold,
          label: 'EARLY OPENING',
        };
      case 'INAUGURATION':
        return {
          bg: 'rgba(255, 138, 61, 0.15)',
          border: 'rgba(255, 138, 61, 0.4)',
          text: colors.festiveOrange,
          label: 'INAUGURATION TODAY',
        };
      case 'UNDER PREPARATION':
        return {
          bg: 'rgba(244, 185, 66, 0.15)',
          border: 'rgba(244, 185, 66, 0.4)',
          text: colors.warning,
          label: 'UNDER PREPARATION',
        };
      case 'CLOSED':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.4)',
          text: colors.danger,
          label: 'TEMPORARILY CLOSED',
        };
      default:
        return {
          bg: 'rgba(113, 113, 122, 0.15)',
          border: 'rgba(113, 113, 122, 0.3)',
          text: colors.textSecondary,
          label: 'STATUS UNVERIFIED',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.border }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
