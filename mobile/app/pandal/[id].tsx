// =============================================================================
// PujaHop Kolkata Mobile: Editorial Pandal Detail Screen
// Section 20: Full-bleed image, verified provenance, and native navigation actions
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, Navigation, CheckCircle2, Train, MapPin, Sparkles, ShieldCheck } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import { colors } from '../../src/theme/colors';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { usePujaHop } from '../../src/hooks/usePujaHop';
import { useHaptics } from '../../src/hooks/useHaptics';

export function PandalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { pandals, markVisited, visits } = usePujaHop();
  const haptics = useHaptics();

  const pandal = pandals.find((p) => p.id === id) || pandals[0];
  const isVisited = visits.some((v) => v.pandal_id === pandal.id);

  const handleStartWalking = () => {
    haptics.heavy();
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${pandal.lat},${pandal.lng}`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${pandal.lat},${pandal.lng}`,
    });
    Linking.openURL(url || `https://www.google.com/maps/search/?api=1&query=${pandal.lat},${pandal.lng}`);
  };

  const handleShare = async () => {
    haptics.selection();
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(
          `https://pujahop.kolkata/pandal/${pandal.id}`,
          { dialogTitle: `Explore ${pandal.name} on PujaHop Kolkata` }
        );
      }
    } catch {}
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Full-Bleed Image Header */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1570700005880-4ecdb8595d4a?auto=format&fit=crop&w=1080&q=80' }}
            style={styles.image}
          />
          <SafeAreaView style={styles.navOverlay}>
            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                router.back();
              }}
              style={styles.circleButton}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.circleButton}>
              <Share2 size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Editorial Body */}
        <View style={styles.body}>
          <View style={styles.topRow}>
            <StatusBadge status={pandal.status} />
            {pandal.score_breakdown && (
              <View style={styles.scorePill}>
                <Sparkles size={12} color={colors.antiqueGold} />
                <Text style={styles.scoreText}>
                  {pandal.score_breakdown.editorial_score.toFixed(1)} / 10 PujaHop Score
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{pandal.name}</Text>
          <Text style={styles.bengaliTitle}>{pandal.name_bn}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <MapPin size={16} color={colors.antiqueGold} />
              <View>
                <Text style={styles.infoLabel}>LOCATION &amp; AREA</Text>
                <Text style={styles.infoValue}>{pandal.area}</Text>
                <Text style={styles.infoSub}>{pandal.neighborhood}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Train size={16} color={colors.metroBlue} />
              <View>
                <Text style={styles.infoLabel}>NEAREST METRO</Text>
                <Text style={styles.infoValue}>{pandal.nearest_metro}</Text>
                <Text style={styles.infoSub}>{pandal.walking_distance}m walking distance</Text>
              </View>
            </View>
          </View>

          {/* Theme Section */}
          {pandal.theme ? (
            <View style={styles.themeSection}>
              <Text style={styles.sectionHeader}>Artistic Theme</Text>
              <Text style={styles.themeDescription}>{pandal.theme}</Text>
              {pandal.theme_source && (
                <Text style={styles.sourceSub}>Verified Source: {pandal.theme_source}</Text>
              )}
            </View>
          ) : null}

          {/* Provenance Disclosure Box */}
          <View style={styles.provenanceBox}>
            <View style={styles.provenanceHeader}>
              <ShieldCheck size={16} color={colors.success} />
              <Text style={styles.provenanceTitle}>Authoritative Verification</Text>
            </View>
            <Text style={styles.provenanceText}>
              Source: {pandal.source}
            </Text>
            <Text style={styles.provenanceSub}>
              Physical coordinates calibrated via West Bengal Police and OpenStreetMap.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={handleStartWalking}
          style={styles.startWalkingButton}
          activeOpacity={0.88}
        >
          <Navigation size={18} color="#FFFFFF" />
          <Text style={styles.startWalkingText}>START WALKING</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            haptics.success();
            markVisited(pandal);
          }}
          style={[styles.stampButton, isVisited && styles.stampButtonDone]}
        >
          <CheckCircle2 size={18} color={isVisited ? colors.success : colors.softGold} />
          <Text style={[styles.stampText, isVisited && styles.stampTextDone]}>
            {isVisited ? 'VISITED' : 'STAMP'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PandalDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1b1830',
  },
  navOverlay: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(9, 9, 11, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  body: {
    padding: 20,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    color: colors.softGold,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  bengaliTitle: {
    color: colors.antiqueGold,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoGrid: {
    gap: 10,
    marginVertical: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.cardDark,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 12,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  infoSub: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  themeSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginVertical: 4,
  },
  sectionHeader: {
    color: colors.softGold,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  themeDescription: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 20,
  },
  sourceSub: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 8,
  },
  provenanceBox: {
    backgroundColor: 'rgba(53, 201, 138, 0.06)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(53, 201, 138, 0.2)',
    gap: 4,
    marginTop: 8,
  },
  provenanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  provenanceTitle: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  provenanceText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  provenanceSub: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    gap: 12,
  },
  startWalkingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.durgaRed,
    paddingVertical: 14,
    borderRadius: 14,
  },
  startWalkingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stampButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.3)',
  },
  stampButtonDone: {
    backgroundColor: 'rgba(53, 201, 138, 0.15)',
    borderColor: 'rgba(53, 201, 138, 0.3)',
  },
  stampText: {
    color: colors.softGold,
    fontSize: 12,
    fontWeight: '800',
  },
  stampTextDone: {
    color: colors.success,
  },
});
