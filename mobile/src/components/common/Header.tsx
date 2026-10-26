// =============================================================================
// RIIQX Mobile — Header Component
// Brand lockup with active model status and quick actions
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Cpu, Settings } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useRiiqxMobile } from '../../context/RiiqxMobileContext';

export function Header() {
  const router = useRouter();
  const { selectedModel } = useRiiqxMobile();

  return (
    <View style={styles.container}>
      {/* Brand Lockup */}
      <View style={styles.brandContainer}>
        <View style={styles.logoMark}>
          <Text style={styles.logoSymbol}>R</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>RIIQX</Text>
          <Text style={styles.brandTagline}>ONLINE AGENTIC AI</Text>
        </View>
      </View>

      {/* Model & Settings Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.modelChip}>
          <Cpu size={12} color={colors.cyan} />
          <Text style={styles.modelChipText}>
            {selectedModel?.provider === 'bedrock' ? 'AWS Bedrock' : 'Agent Router'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          style={styles.settingsButton}
          accessibilityLabel="System Settings"
        >
          <Settings size={15} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    color: colors.cyan,
    fontSize: 16,
    fontWeight: '800',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTagline: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modelChipText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
