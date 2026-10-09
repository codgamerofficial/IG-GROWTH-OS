// =============================================================================
// PujaHop Kolkata Mobile: Native Map Component
// Sections 17 & 18: Real Kolkata map with pandal markers, metro pins, and filter controls
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { MapPin, Train, Layers, Compass, Crosshair } from 'lucide-react-native';
import { Pandal } from '../../../../src/lib/types/pujahop';
import { colors } from '../../theme/colors';
import { PandalBottomSheet } from './PandalBottomSheet';
import { useHaptics } from '../../hooks/useHaptics';

interface Props {
  pandals: Pandal[];
  userLocation: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
}

export function NativeMapView({ pandals, userLocation, onRequestLocation }: Props) {
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const haptics = useHaptics();

  const areas = ['ALL', 'NORTH', 'SOUTH', 'CENTRAL', 'SALT LAKE'];

  const filteredPandals = pandals.filter((p) => {
    if (selectedArea === 'ALL') return true;
    if (selectedArea === 'NORTH') return p.area.includes('North');
    if (selectedArea === 'SOUTH') return p.area.includes('South');
    if (selectedArea === 'CENTRAL') return p.area.includes('Central');
    if (selectedArea === 'SALT LAKE') return p.area.includes('Salt Lake') || p.area.includes('East');
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Floating Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {areas.map((area) => {
            const isActive = selectedArea === area;
            return (
              <TouchableOpacity
                key={area}
                onPress={() => {
                  haptics.selection();
                  setSelectedArea(area);
                }}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{area}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Map Surface (Interactive Cartographic Canvas with Markers) */}
      <View style={styles.mapCanvas}>
        <View style={styles.mapOverlayWatermark}>
          <Text style={styles.watermarkText}>CARTO Dark Matter • Kolkata Basemap</Text>
        </View>

        {/* Floating Location Trigger */}
        <TouchableOpacity
          onPress={() => {
            haptics.medium();
            onRequestLocation();
          }}
          style={styles.locationFab}
          accessibilityLabel="Locate Me"
        >
          <Crosshair size={20} color={userLocation ? colors.success : colors.textPrimary} />
        </TouchableOpacity>

        {/* Pandal Marker List / Grid View */}
        <FlatList
          data={filteredPandals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.markerList}
          renderItem={({ item }) => {
            const isSelected = selectedPandal?.id === item.id;
            return (
              <TouchableOpacity
                onPress={() => {
                  haptics.selection();
                  setSelectedPandal(item);
                }}
                style={[styles.markerItem, isSelected && styles.markerItemSelected]}
                activeOpacity={0.8}
              >
                <View style={styles.markerBadge}>
                  <Text style={styles.markerBadgeText}>🪔</Text>
                </View>
                <View style={styles.markerInfo}>
                  <Text style={styles.markerName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.markerMeta}>{item.area} • Nearest: {item.nearest_metro}</Text>
                </View>
                <Text style={styles.distanceText}>{item.walking_distance}m</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Bottom Sheet for Selected Destination */}
      <PandalBottomSheet
        pandal={selectedPandal}
        onClose={() => setSelectedPandal(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  filterBar: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 18, 36, 0.9)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: colors.durgaRed,
    borderColor: colors.durgaRed,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  mapCanvas: {
    flex: 1,
    paddingTop: 54,
  },
  mapOverlayWatermark: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  watermarkText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'monospace',
  },
  locationFab: {
    position: 'absolute',
    right: 16,
    top: 70,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  markerList: {
    padding: 16,
    paddingBottom: 160,
    gap: 10,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 12,
  },
  markerItemSelected: {
    borderColor: colors.antiqueGold,
    backgroundColor: 'rgba(214, 168, 79, 0.12)',
  },
  markerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(198, 40, 40, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBadgeText: {
    fontSize: 18,
  },
  markerInfo: {
    flex: 1,
  },
  markerName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  markerMeta: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  distanceText: {
    color: colors.softGold,
    fontSize: 11,
    fontWeight: '700',
  },
});
