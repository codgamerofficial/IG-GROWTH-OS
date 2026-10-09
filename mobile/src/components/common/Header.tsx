// =============================================================================
// PujaHop Kolkata Mobile: Native Header Component
// Section 7: PujaHop Logo, SOS Trigger, Copilot Quick-Access, and Date Chip
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ShieldAlert } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { usePujaHop } from '../../hooks/usePujaHop';
import { useHaptics } from '../../hooks/useHaptics';

export function Header() {
  const router = useRouter();
  const { selectedDate } = usePujaHop();
  const haptics = useHaptics();

  const isPrePuja = selectedDate === '2026-10-13' || selectedDate === '2026-10-14';
  const dateLabel = isPrePuja ? '14 OCT • PRE-PUJA' : '18 OCT • MAHA SAPTAMI';

  return (
    <View style={styles.container}>
      {/* Brand Lockup */}
      <View style={styles.brandContainer}>
        <View style={styles.logoMark}>
          <Text style={styles.logoSymbol}>🪔</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>PujaHop</Text>
          <Text style={styles.brandCity}>KOLKATA</Text>
        </View>
      </View>

      {/* Date & Actions */}
      <View style={styles.actionsContainer}>
        <View style={[styles.dateChip, isPrePuja ? styles.dateChipPrePuja : styles.dateChipMain]}>
          <Text style={styles.dateChipText}>{dateLabel}</Text>
        </View>

        {/* SOS */}
        <TouchableOpacity
          onPress={() => {
            haptics.heavy();
            router.push('/emergency');
          }}
          style={styles.sosButton}
          accessibilityLabel="Emergency SOS"
        >
          <ShieldAlert size={16} color={colors.danger} />
        </TouchableOpacity>

        {/* Copilot */}
        <TouchableOpacity
          onPress={() => {
            haptics.medium();
            router.push('/copilot');
          }}
          style={styles.copilotButton}
          accessibilityLabel="Puja Copilot AI"
        >
          <Sparkles size={16} color="#FFFFFF" />
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
    backgroundColor: colors.deepCharcoal,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.antiqueGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    fontSize: 16,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandCity: {
    color: colors.antiqueGold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateChipPrePuja: {
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    borderColor: 'rgba(214, 168, 79, 0.4)',
  },
  dateChipMain: {
    backgroundColor: 'rgba(198, 40, 40, 0.15)',
    borderColor: 'rgba(198, 40, 40, 0.4)',
  },
  dateChipText: {
    color: colors.softGold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sosButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copilotButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.durgaRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
