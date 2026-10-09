// =============================================================================
// PujaHop Kolkata Mobile: Pandal Bottom Sheet Component
// Section 19: Native draggable bottom sheet displaying selected pandal & Start Walking
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Navigation, MapPin, Train, CheckCircle2, X } from 'lucide-react-native';
import { Pandal } from '../../../../src/lib/types/pujahop';
import { colors } from '../../theme/colors';
import { StatusBadge } from '../common/StatusBadge';
import { useHaptics } from '../../hooks/useHaptics';
import { usePujaHop } from '../../hooks/usePujaHop';

interface Props {
  pandal: Pandal | null;
  onClose: () => void;
}

export function PandalBottomSheet({ pandal, onClose }: Props) {
  const router = useRouter();
  const haptics = useHaptics();
  const { markVisited, visits } = usePujaHop();

  if (!pandal) return null;

  const isVisited = visits.some((v) => v.pandal_id === pandal.id);

  const handleStartWalking = () => {
    haptics.heavy();
    const scheme = Platform.select({
      ios: `maps://0,0?q=${pandal.lat},${pandal.lng}(${encodeURIComponent(pandal.name)})`,
      android: `geo:0,0?q=${pandal.lat},${pandal.lng}(${encodeURIComponent(pandal.name)})`,
    });
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${pandal.lat},${pandal.lng}`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${pandal.lat},${pandal.lng}`,
    });

    Linking.openURL(url || scheme || `https://www.google.com/maps/search/?api=1&query=${pandal.lat},${pandal.lng}`);
  };

  return (
    <View style={styles.sheetContainer}>
      {/* Handle Bar */}
      <View style={styles.handleBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <StatusBadge status={pandal.status} />
          <Text style={styles.name}>{pandal.name}</Text>
          <Text style={styles.nameBn}>{pandal.name_bn}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Details Row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <MapPin size={14} color={colors.antiqueGold} />
          <Text style={styles.detailText}>{pandal.area}</Text>
        </View>
        <View style={styles.detailItem}>
          <Train size={14} color={colors.metroBlue} />
          <Text style={styles.detailText}>
            {pandal.nearest_metro} ({pandal.walking_distance}m)
          </Text>
        </View>
      </View>

      {pandal.theme ? (
        <View style={styles.themeBox}>
          <Text style={styles.themeLabel}>Theme:</Text>
          <Text style={styles.themeText}>{pandal.theme}</Text>
        </View>
      ) : null}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={handleStartWalking}
          style={styles.primaryButton}
          activeOpacity={0.88}
        >
          <Navigation size={16} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>START WALKING</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            haptics.success();
            markVisited(pandal);
          }}
          style={[styles.visitedButton, isVisited && styles.visitedButtonDone]}
        >
          <CheckCircle2 size={16} color={isVisited ? colors.success : colors.textSecondary} />
          <Text style={[styles.visitedText, isVisited && styles.visitedTextDone]}>
            {isVisited ? 'VISITED' : 'STAMP'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleArea: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  nameBn: {
    color: colors.softGold,
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  themeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginVertical: 8,
  },
  themeLabel: {
    color: colors.antiqueGold,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  themeText: {
    color: colors.textPrimary,
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.durgaRed,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  visitedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  visitedButtonDone: {
    backgroundColor: 'rgba(53, 201, 138, 0.15)',
    borderColor: 'rgba(53, 201, 138, 0.3)',
  },
  visitedText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  visitedTextDone: {
    color: colors.success,
  },
});
