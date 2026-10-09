// =============================================================================
// PujaHop Kolkata Mobile: Route Navigation & Turn-by-Turn Screen
// Section 26, 27 & 28: Itinerary timeline, zero count mismatches, and native navigation
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Navigation, Clock, Footprints, Train, MapPin, CheckCircle2, Share2, Sparkles } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import { colors } from '../../src/theme/colors';
import { usePujaHop } from '../../src/hooks/usePujaHop';
import { useHaptics } from '../../src/hooks/useHaptics';

export function RouteDetailScreen() {
  const router = useRouter();
  const { currentTrip } = usePujaHop();
  const haptics = useHaptics();

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Active Route Planned</Text>
          <TouchableOpacity onPress={() => router.push('/plan')} style={styles.planButton}>
            <Text style={styles.planButtonText}>GO TO ROUTE PLANNER</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const pandalStops = currentTrip.stops.filter((s) => s.stop_type === 'PANDAL');
  const walkingKm = (currentTrip.total_walking_distance_meters / 1000).toFixed(1);
  const travelHours = Math.floor(currentTrip.total_travel_time_minutes / 60);
  const travelMins = currentTrip.total_travel_time_minutes % 60;

  const handleShare = async () => {
    haptics.selection();
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(
          `https://pujahop.kolkata/route/${currentTrip.id}`,
          { dialogTitle: `My PujaHop Route: ${pandalStops.length} Pandals in Kolkata` }
        );
      }
    } catch {}
  };

  const openNavigation = (lat: number, lng: number, name: string) => {
    haptics.heavy();
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
      android: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    });
    Linking.openURL(url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
  };

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
          <View style={styles.headerTitleArea}>
            <Text style={styles.routeHeaderTitle}>{currentTrip.title}</Text>
            <Text style={styles.routeHeaderSub}>{currentTrip.date} • {currentTrip.route_type}</Text>
          </View>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Share2 size={18} color={colors.antiqueGold} />
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{pandalStops.length}</Text>
            <Text style={styles.summaryLabel}>PANDALS</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{walkingKm} km</Text>
            <Text style={styles.summaryLabel}>WALKING</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{travelHours}h {travelMins}m</Text>
            <Text style={styles.summaryLabel}>EST. DURATION</Text>
          </View>
        </View>

        {/* Timeline Itinerary */}
        <ScrollView style={styles.timelineList} contentContainerStyle={styles.timelineContent}>
          {currentTrip.stops.map((stop, index) => {
            const isLast = index === currentTrip.stops.length - 1;
            const isPandal = stop.stop_type === 'PANDAL';

            return (
              <View key={stop.id} style={styles.timelineStep}>
                {/* Left Timeline Indicator */}
                <View style={styles.indicatorCol}>
                  <View style={[styles.dot, isPandal ? styles.dotPandal : styles.dotTransit]}>
                    <Text style={styles.dotText}>{index + 1}</Text>
                  </View>
                  {!isLast && <View style={styles.line} />}
                </View>

                {/* Right Stop Details */}
                <View style={styles.stopCard}>
                  <View style={styles.stopHeader}>
                    <Text style={styles.stopTime}>{stop.arrival_time}</Text>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{stop.stop_type}</Text>
                    </View>
                  </View>

                  <Text style={styles.stopTitle}>
                    {stop.pandal?.name || stop.custom_name}
                  </Text>
                  {stop.pandal?.name_bn && (
                    <Text style={styles.stopBengali}>{stop.pandal.name_bn}</Text>
                  )}

                  <View style={styles.stopMetaRow}>
                    <View style={styles.metaPill}>
                      <Clock size={12} color={colors.textSecondary} />
                      <Text style={styles.metaPillText}>{stop.duration_minutes} min visit</Text>
                    </View>
                    {stop.distance_from_prev_meters > 0 && (
                      <View style={styles.metaPill}>
                        <Footprints size={12} color={colors.softGold} />
                        <Text style={styles.metaPillText}>{stop.distance_from_prev_meters}m walk</Text>
                      </View>
                    )}
                  </View>

                  {/* Navigation Deep Link */}
                  <TouchableOpacity
                    onPress={() => openNavigation(stop.lat, stop.lng, stop.pandal?.name || stop.custom_name)}
                    style={styles.navigateButton}
                  >
                    <Navigation size={14} color="#FFFFFF" />
                    <Text style={styles.navigateText}>NAVIGATE TO STOP</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default RouteDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  planButton: {
    backgroundColor: colors.durgaRed,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  planButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
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
  headerTitleArea: {
    flex: 1,
  },
  routeHeaderTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  routeHeaderSub: {
    color: colors.antiqueGold,
    fontSize: 11,
    marginTop: 1,
  },
  shareButton: {
    padding: 8,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardDark,
    margin: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.cardBorder,
  },
  timelineList: {
    flex: 1,
  },
  timelineContent: {
    padding: 16,
    paddingBottom: 40,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPandal: {
    backgroundColor: colors.durgaRed,
  },
  dotTransit: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 4,
  },
  stopCard: {
    flex: 1,
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 6,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopTime: {
    color: colors.softGold,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  stopTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  stopBengali: {
    color: colors.softGold,
    fontSize: 13,
  },
  stopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaPillText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(214, 168, 79, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 79, 0.3)',
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
  },
  navigateText: {
    color: colors.softGold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
