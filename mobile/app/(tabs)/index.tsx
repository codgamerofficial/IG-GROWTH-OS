// =============================================================================
// PujaHop Kolkata Mobile: Native Home Screen
// Section 6: Mobile-first editorial composition (Header -> Hero -> Status -> Pandals -> Route -> Metro -> CTA)
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Calendar, Train, CloudSun, Utensils, Award, ArrowRight } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { Header } from '../../src/components/common/Header';
import { MobileHero } from '../../src/components/home/MobileHero';
import { FeaturedPandalCarousel } from '../../src/components/home/FeaturedPandalCarousel';
import { usePujaHop } from '../../src/hooks/usePujaHop';
import { useHaptics } from '../../src/hooks/useHaptics';

export function HomeScreen() {
  const router = useRouter();
  const { pandals, selectedDate, weather, trafficAlerts, loading, refreshData, currentTrip } = usePujaHop();
  const haptics = useHaptics();

  const isPrePuja = selectedDate === '2026-10-13' || selectedDate === '2026-10-14';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshData} tintColor={colors.softGold} />}
      >
        {/* Cultural Welcome Greeting */}
        <View style={styles.greetingBox}>
          <Text style={styles.greetingBn}>চলো, আজ কলকাতাকে একটু অন্যভাবে দেখি।</Text>
          <Text style={styles.greetingEn}>Explore Kolkata’s grandest festival with verified intelligence.</Text>
        </View>

        {/* Cinematic Mobile Hero */}
        <MobileHero />

        {/* Puja Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusDot} />
            <Text style={styles.statusTitle}>TODAY IN KOLKATA • {isPrePuja ? 'PRE-PUJA' : 'MAIN PUJA'}</Text>
          </View>
          <Text style={styles.statusDescription}>
            {isPrePuja
              ? 'Selected early pandal openings & lighting rehearsals in progress. Major police traffic barricades active from 16:00.'
              : 'Full festival mode active across North, Central, and South Kolkata. Heavy crowds expected near major metro hubs.'}
          </Text>
        </View>

        {/* Quick Route Planner Teaser */}
        <View style={styles.plannerTeaser}>
          <View style={styles.plannerText}>
            <Text style={styles.plannerTitle}>Plan Your One-Day Hop</Text>
            <Text style={styles.plannerSubtitle}>3 to 10+ pandals with real walking routes and Metro connections.</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              haptics.heavy();
              router.push('/plan');
            }}
            style={styles.plannerButton}
          >
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Featured Pandals Carousel */}
        <FeaturedPandalCarousel pandals={pandals} />

        {/* Metro Intelligence Quick Card */}
        <TouchableOpacity
          onPress={() => {
            haptics.selection();
            router.push('/metro');
          }}
          style={styles.featureCard}
        >
          <View style={styles.featureIconBox}>
            <Train size={20} color={colors.metroBlue} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Kolkata Metro Reality</Text>
            <Text style={styles.featureSubtitle}>Regular timetable active (06:50 - 23:45). Night circulars unverified.</Text>
          </View>
          <ArrowRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Weather Snapshot Quick Card */}
        {weather && (
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              router.push('/weather');
            }}
            style={styles.featureCard}
          >
            <View style={styles.featureIconBox}>
              <CloudSun size={20} color={colors.warning} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{weather.temperature_c}°C • {weather.condition_text}</Text>
              <Text style={styles.featureSubtitle}>Feels like {weather.apparent_temp_c}°C • Rain prob: {weather.precipitation_probability}%</Text>
            </View>
            <ArrowRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Food Trail Quick Card */}
        <TouchableOpacity
          onPress={() => {
            haptics.selection();
            router.push('/food');
          }}
          style={styles.featureCard}
        >
          <View style={styles.featureIconBox}>
            <Utensils size={20} color={colors.festiveOrange} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Kolkata Food Trail</Text>
            <Text style={styles.featureSubtitle}>Iconic kathi rolls, biryani, and mishti near your pandal hops.</Text>
          </View>
          <ArrowRight size={16} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Closing Emotional CTA */}
        <View style={styles.closingBox}>
          <Text style={styles.closingBn}>কলকাতা অপেক্ষা করছে।{'\n'}তুমি প্রস্তুত তো?</Text>
          <Text style={styles.closingEn}>One Day. One City. Maximum Puja.</Text>
          <TouchableOpacity
            onPress={() => {
              haptics.heavy();
              router.push('/plan');
            }}
            style={styles.closingButton}
          >
            <Text style={styles.closingButtonText}>PLAN MY PUJA DAY</Text>
          </TouchableOpacity>
        </View>

        {/* Creator Attribution */}
        <View style={styles.footerCredit}>
          <Text style={styles.footerBrand}>PUJAHOP KOLKATA 2026</Text>
          <Text style={styles.footerCreator}>Created &amp; Conceptualized by Saswata Dey (Riik)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  greetingBox: {
    marginBottom: 16,
  },
  greetingBn: {
    color: colors.softGold,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  greetingEn: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statusCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.antiqueGold,
  },
  statusTitle: {
    color: colors.antiqueGold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statusDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  plannerTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(198, 40, 40, 0.12)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(198, 40, 40, 0.3)',
    marginBottom: 20,
  },
  plannerText: {
    flex: 1,
    paddingRight: 12,
  },
  plannerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  plannerSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  plannerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.durgaRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10,
    gap: 12,
  },
  featureIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  featureSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  closingBox: {
    backgroundColor: 'rgba(214, 168, 79, 0.08)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.25)',
    alignItems: 'center',
    marginVertical: 16,
  },
  closingBn: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 6,
  },
  closingEn: {
    color: colors.antiqueGold,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
  },
  closingButton: {
    backgroundColor: colors.durgaRed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closingButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  footerCredit: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  footerBrand: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerCreator: {
    color: colors.antiqueGold,
    fontSize: 11,
    fontWeight: '600',
  },
});
