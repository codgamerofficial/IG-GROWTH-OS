// =============================================================================
// PujaHop Kolkata Mobile: Kolkata Metro Transit Screen
// Section 22 & 29: Honest timetable disclosure, Blue/Green lines & station directory
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Train, Clock, ShieldCheck, AlertCircle, MapPin } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { VERIFIED_METRO_STATIONS, METRO_LINES } from '../../../../src/lib/data/kolkata-metro';
import { useHaptics } from '../../src/hooks/useHaptics';

export function MetroScreen() {
  const router = useRouter();
  const [selectedLine, setSelectedLine] = useState<'blue' | 'green'>('blue');
  const haptics = useHaptics();

  const stations = VERIFIED_METRO_STATIONS.filter((s) => s.line_id === selectedLine);
  const activeLineInfo = METRO_LINES.find((l) => l.id === selectedLine);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              router.back();
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Kolkata Metro Railway</Text>
            <Text style={styles.subtitle}>Verified festival transit timetables</Text>
          </View>
        </View>

        {/* Timetable Transparency Notice */}
        <View style={styles.transparencyBox}>
          <View style={styles.transparencyHeader}>
            <AlertCircle size={14} color={colors.warning} />
            <Text style={styles.transparencyTitle}>SPECIAL PUJA SERVICE NOT YET ANNOUNCED</Text>
          </View>
          <Text style={styles.transparencyText}>
            Regular schedule active (06:50 - 23:45). Kolkata Metro special midnight circulars will be published closer to Saptami. Zero fabricated 24/7 claims.
          </Text>
        </View>

        {/* Line Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              setSelectedLine('blue');
            }}
            style={[styles.tabButton, selectedLine === 'blue' && styles.tabButtonActiveBlue]}
          >
            <Train size={16} color={selectedLine === 'blue' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.tabText, selectedLine === 'blue' && styles.tabTextActive]}>
              Blue Line (North-South)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              setSelectedLine('green');
            }}
            style={[styles.tabButton, selectedLine === 'green' && styles.tabButtonActiveGreen]}
          >
            <Train size={16} color={selectedLine === 'green' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.tabText, selectedLine === 'green' && styles.tabTextActive]}>
              Green Line (East-West)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stations List */}
        <ScrollView style={styles.stationList} contentContainerStyle={styles.stationListContent}>
          {stations.map((st, index) => (
            <View key={st.id} style={styles.stationCard}>
              <View style={styles.stationHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <View style={styles.nameCol}>
                  <Text style={styles.stationName}>{st.name}</Text>
                  <Text style={styles.stationBengali}>{st.name_bn}</Text>
                </View>
                {st.is_interchange && (
                  <View style={styles.interchangePill}>
                    <Text style={styles.interchangeText}>INTERCHANGE</Text>
                  </View>
                )}
              </View>

              {st.nearest_pandals.length > 0 && (
                <View style={styles.pandalsRow}>
                  <MapPin size={12} color={colors.antiqueGold} />
                  <Text style={styles.pandalsText} numberOfLines={1}>
                    Serves: {st.nearest_pandals.join(', ')}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default MetroScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: 12,
  },
  backButton: {
    padding: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  transparencyBox: {
    margin: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(244, 185, 66, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244, 185, 66, 0.25)',
    gap: 4,
  },
  transparencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transparencyTitle: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  transparencyText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabButtonActiveBlue: {
    backgroundColor: colors.metroBlue,
    borderColor: colors.metroBlue,
  },
  tabButtonActiveGreen: {
    backgroundColor: colors.metroGreen,
    borderColor: colors.metroGreen,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  stationList: {
    flex: 1,
  },
  stationListContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 10,
  },
  stationCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: colors.softGold,
    fontSize: 10,
    fontWeight: '700',
  },
  nameCol: {
    flex: 1,
  },
  stationName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  stationBengali: {
    color: colors.softGold,
    fontSize: 12,
  },
  interchangePill: {
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  interchangeText: {
    color: colors.softGold,
    fontSize: 9,
    fontWeight: '800',
  },
  pandalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  pandalsText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});
