// =============================================================================
// PujaHop Kolkata Mobile: More Navigation & Hub Screen
// Provides access to Metro, Food Trail, Emergency SOS, Settings & Creator Manifesto
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Train, Utensils, CloudSun, ShieldAlert, Sparkles, Settings, Info, ChevronRight, Award } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useHaptics } from '../../src/hooks/useHaptics';

export function MoreScreen() {
  const router = useRouter();
  const haptics = useHaptics();

  const menuItems = [
    {
      title: 'Kolkata Metro Schedule',
      subtitle: 'Official Blue & Green Line timetables and stations',
      icon: Train,
      color: colors.metroBlue,
      route: '/metro',
    },
    {
      title: 'Kolkata Food Trail',
      subtitle: 'Verified kathi rolls, mishti & street food pitstops',
      icon: Utensils,
      color: colors.festiveOrange,
      route: '/food',
    },
    {
      title: 'Live Weather & Forecast',
      subtitle: 'Time & location-aware atmospheric advisories',
      icon: CloudSun,
      color: colors.warning,
      route: '/weather',
    },
    {
      title: 'Puja Copilot AI',
      subtitle: 'Verified pandal assistant with zero-hallucination tools',
      icon: Sparkles,
      color: colors.antiqueGold,
      route: '/copilot',
    },
    {
      title: 'Emergency SOS & Helpline',
      subtitle: 'Kolkata Police, Lalbazar Traffic & medical directory',
      icon: ShieldAlert,
      color: colors.danger,
      route: '/emergency',
    },
    {
      title: 'Settings & Cache',
      subtitle: 'Offline storage, location permissions & preferences',
      icon: Settings,
      color: colors.textSecondary,
      route: '/settings',
    },
    {
      title: 'About & Creator',
      subtitle: 'Story, 5 pillars & Created by Saswata Dey (Riik)',
      icon: Info,
      color: colors.softGold,
      route: '/about',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Explore More</Text>
          <Text style={styles.subtitle}>Transit, food, safety, and cultural intelligence</Text>
        </View>

        <View style={styles.menuList}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  haptics.selection();
                  router.push(item.route as any);
                }}
                style={styles.menuItem}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <View style={styles.textBox}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={18} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footerCredit}>
          <Text style={styles.brandTitle}>PUJAHOP KOLKATA • 2026</Text>
          <Text style={styles.creditText}>Created &amp; Conceptualized by Saswata Dey (Riik)</Text>
          <Text style={styles.tagline}>One Day. One City. Maximum Puja.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MoreScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 14,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  footerCredit: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  brandTitle: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  creditText: {
    color: colors.antiqueGold,
    fontSize: 12,
    fontWeight: '600',
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
  },
});
