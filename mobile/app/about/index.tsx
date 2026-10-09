// =============================================================================
// PujaHop Kolkata Mobile: About & Creator Manifesto Screen
// Sections 66 & 67: Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, ShieldCheck, MapPin, Cpu, Heart, ExternalLink, Calendar } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useHaptics } from '../../src/hooks/useHaptics';

export default function AboutScreen() {
  const router = useRouter();
  const haptics = useHaptics();

  const pillars = [
    {
      title: 'Zero-Fabrication Truth',
      desc: 'No fake 24/7 metro schedules, no simulated crowds, and no AI hallucinations. If a pandal or transit status is unverified, we declare it honestly.',
      icon: ShieldCheck,
      color: colors.antiqueGold,
    },
    {
      title: 'Ground Reality Routing',
      desc: 'Real OSRM footpaths, Kolkata Police road barricade awareness, and Metro interchange calculations instead of straight-line flight distances.',
      icon: MapPin,
      color: colors.festiveOrange,
    },
    {
      title: '2026 Calendar Accuracy',
      desc: 'Accurate Bengali Panjika alignment: Mahalaya on 10 Oct, Pre-Puja 13–14 Oct, and Maha Saptami on 18 Oct. Never ambiguous or compressed dates.',
      icon: Calendar,
      color: colors.durgaRed,
    },
    {
      title: 'Unified Native Experience',
      desc: 'Shared data contracts, Supabase models, and routing algorithms with the Next.js web platform, executed natively at 60 FPS in React Native + Expo.',
      icon: Cpu,
      color: colors.metroBlue,
    },
    {
      title: 'Cultural Reverence',
      desc: 'Honoring Kolkata’s UNESCO Intangible Cultural Heritage. Pandal themes, craft artisans, traditional bonedi bari rituals, and neighborhood pride.',
      icon: Heart,
      color: colors.softGold,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            haptics.light();
            router.back();
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About PujaHop Kolkata</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Brand Banner */}
        <View style={styles.heroBox}>
          <Text style={styles.bengaliHero}>একদিনে সারা কলকাতার সেরা পুজো</Text>
          <Text style={styles.brandTitle}>PUJAHOP KOLKATA</Text>
          <Text style={styles.tagline}>One Day. One City. Maximum Puja.</Text>

          <View style={styles.goldDivider} />

          <Text style={styles.storyText}>
            “PujaHop Kolkata is built to make exploring Kolkata's Durga Puja easier, smarter and more memorable.”
          </Text>
        </View>

        {/* Official Creator Credit Card */}
        <View style={styles.creatorCard}>
          <View style={styles.creatorBadge}>
            <Sparkles size={14} color={colors.antiqueGold} />
            <Text style={styles.creatorBadgeText}>CONCEPT &amp; CREATION</Text>
          </View>
          <Text style={styles.creatorRole}>Created &amp; Conceptualized by</Text>
          <Text style={styles.creatorName}>Saswata Dey (Riik)</Text>
          <Text style={styles.creatorBio}>
            Designed and engineered as a tribute to Kolkata, combining modern spatial routing, verified festival telemetry, and native mobile craft.
          </Text>
        </View>

        {/* 5 Core Principles */}
        <Text style={styles.sectionHeader}>The 5 Product Principles</Text>
        <View style={styles.pillarsList}>
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <View key={idx} style={styles.pillarItem}>
                <View style={[styles.pillarIconBox, { backgroundColor: `${item.color}15` }]}>
                  <Icon size={20} color={item.color} />
                </View>
                <View style={styles.pillarText}>
                  <Text style={styles.pillarTitle}>{item.title}</Text>
                  <Text style={styles.pillarDesc}>{item.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Technical Architecture */}
        <View style={styles.techCard}>
          <Text style={styles.techTitle}>Technical Architecture</Text>
          <Text style={styles.techDesc}>
            • Frontend: React Native, Expo SDK 51, Expo Router, Reanimated{"\n"}
            • Web Core: Next.js 14 App Router, TypeScript, TailwindCSS{"\n"}
            • Shared Core: Supabase, OSRM Kolkata Routing Engine{"\n"}
            • Maps: CARTO Voyager / Dark Matter Tiles &amp; Native Maps{"\n"}
            • AI Intelligence: Multi-layer verified router with Amazon Bedrock
          </Text>
        </View>

        {/* Official Credit Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>PUJAHOP KOLKATA • 2026</Text>
          <Text style={styles.footerCredit}>Created &amp; Conceptualized by Saswata Dey (Riik)</Text>
          <Text style={styles.footerRights}>All rights reserved. Kolkata, West Bengal, India.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.cardDark,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 18,
  },
  heroBox: {
    backgroundColor: colors.cardDark,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: `${colors.antiqueGold}40`,
    alignItems: 'center',
    textAlign: 'center',
  },
  bengaliHero: {
    color: colors.festiveOrange,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
  },
  tagline: {
    color: colors.antiqueGold,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  goldDivider: {
    width: 60,
    height: 2,
    backgroundColor: colors.antiqueGold,
    marginVertical: 16,
    borderRadius: 1,
  },
  storyText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  creatorCard: {
    backgroundColor: `${colors.antiqueGold}10`,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: `${colors.antiqueGold}40`,
    alignItems: 'center',
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.antiqueGold}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  creatorBadgeText: {
    color: colors.antiqueGold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  creatorRole: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  creatorName: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 8,
  },
  creatorBio: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  sectionHeader: {
    color: colors.antiqueGold,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
  pillarsList: {
    gap: 12,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 14,
  },
  pillarIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarText: {
    flex: 1,
  },
  pillarTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  pillarDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  techCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  techTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  techDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  footerBrand: {
    color: colors.antiqueGold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footerCredit: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  footerRights: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
