// =============================================================================
// RIIQX Mobile — Status Badge Component
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export type RiiqxMobileStatus =
  | 'ONLINE'
  | 'STANDBY'
  | 'QUEUED'
  | 'RENDERING'
  | 'PUBLISHED'
  | 'ERROR'
  | 'HALTED';

interface StatusBadgeProps {
  status: RiiqxMobileStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || '').toUpperCase();

  const getBadgeConfig = () => {
    switch (normalized) {
      case 'ONLINE':
      case 'PUBLISHED':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.4)',
          text: colors.emerald,
          label: normalized,
        };
      case 'RENDERING':
      case 'RUNNING':
        return {
          bg: 'rgba(6, 182, 212, 0.15)',
          border: 'rgba(6, 182, 212, 0.4)',
          text: colors.cyan,
          label: normalized,
        };
      case 'QUEUED':
      case 'STANDBY':
        return {
          bg: 'rgba(139, 92, 246, 0.15)',
          border: 'rgba(139, 92, 246, 0.4)',
          text: colors.violet,
          label: normalized,
        };
      case 'HALTED':
      case 'ERROR':
        return {
          bg: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(244, 63, 94, 0.4)',
          text: colors.rose,
          label: normalized,
        };
      default:
        return {
          bg: 'rgba(100, 116, 139, 0.15)',
          border: 'rgba(100, 116, 139, 0.3)',
          text: colors.textSecondary,
          label: normalized || 'UNKNOWN',
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
