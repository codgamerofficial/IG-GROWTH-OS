// =============================================================================
// RIIQX Mobile — Screen 8: Select Interests Screen
// Matches Reference Board Screen 8
// "What are you interested in?" • Multi-Asset Grid Selection
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { lightColors, darkColors } from '../../src/theme/colors';

const INTERESTS = [
  { id: 'stocks', label: 'Stocks', icon: 'trending-up', bg: '#EDE9FE', color: '#6750D8' },
  { id: 'mf', label: 'Mutual Funds', icon: 'pie-chart', bg: '#D1FAE5', color: '#16865D' },
  { id: 'us_stocks', label: 'US Stocks', icon: 'globe-outline', bg: '#DBEAFE', color: '#2563EB' },
  { id: 'etfs', label: 'ETFs', icon: 'layers-outline', bg: '#CCFBF1', color: '#0D9488' },
  { id: 'bonds', label: 'Bonds', icon: 'document-text-outline', bg: '#DCFCE7', color: '#15803D' },
  { id: 'reits', label: 'REITs', icon: 'business-outline', bg: '#FEF3C7', color: '#D97706' },
  { id: 'gold_silver', label: 'Gold & Silver', icon: 'sparkles', bg: '#FEF08A', color: '#CA8A04' },
  { id: 'fd', label: 'FD', icon: 'shield-checkmark-outline', bg: '#E0E7FF', color: '#4F46E5' },
  { id: 'crypto', label: 'Crypto', icon: 'logo-bitcoin', bg: '#FFEDD5', color: '#EA580C' },
  { id: 'real_estate', label: 'Real Estate', icon: 'home-outline', bg: '#F1F5F9', color: '#475569' },
  { id: 'commodities', label: 'Commodities', icon: 'cube-outline', bg: '#FEE2E2', color: '#DC2626' },
];

export default function SelectInterestsScreen() {
  const router = useRouter();
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [selectedIds, setSelectedIds] = useState<string[]>([
    'stocks',
    'mf',
    'us_stocks',
    'bonds',
    'gold_silver',
    'fd',
  ]);

  const toggleInterest = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      <View style={styles.header}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 1 OF 3</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          What are you interested in?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select asset classes to personalize your dashboard and screener filters
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {INTERESTS.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => toggleInterest(item.id)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text style={[styles.cardLabel, { color: theme.textPrimary }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.cardBorder }]}>
        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/onboarding/connect')}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#EDE9FE',
    marginBottom: 8,
  },
  stepBadgeText: {
    color: '#6750D8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  gridContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '30.5%',
    aspectRatio: 0.95,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    position: 'relative',
  },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  continueBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
