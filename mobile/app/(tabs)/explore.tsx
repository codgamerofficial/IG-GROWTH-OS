// =============================================================================
// PujaHop Kolkata Mobile: Native Explore Screen
// Section 17 & 18: Full-screen interactive map with search, filter layers & bottom sheet
// =============================================================================

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Search } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { NativeMapView } from '../../src/components/map/NativeMapView';
import { usePujaHop } from '../../src/hooks/usePujaHop';

export function ExploreScreen() {
  const { pandals, userLocation, requestLocation } = usePujaHop();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPandals = pandals.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_bn.includes(searchQuery) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nearest_metro.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Search Overlay */}
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
            <Search size={18} color={colors.textSecondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search pandals, areas, or Metro stations..."
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Real Native Map */}
        <NativeMapView
          pandals={filteredPandals}
          userLocation={userLocation}
          onRequestLocation={requestLocation}
        />
      </View>
    </SafeAreaView>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  searchBarWrapper: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    zIndex: 50,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 18, 36, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
  },
});
