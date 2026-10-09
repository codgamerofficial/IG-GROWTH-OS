// =============================================================================
// PujaHop Kolkata Mobile: Step-by-Step Route Planner Wizard
// Section 24 & 25: 7-Step mobile flow with progress indicator & real route generation
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Clock, Train, Sparkles, Footprints, Check, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { usePujaHop } from '../../src/hooks/usePujaHop';
import { useHaptics } from '../../src/hooks/useHaptics';
import { api } from '../../src/services/api';

export function PlanScreen() {
  const router = useRouter();
  const { selectedDate, setSelectedDate, setCurrentTrip } = usePujaHop();
  const haptics = useHaptics();

  const [step, setStep] = useState(1);
  const [startLocation, setStartLocation] = useState('Shyambazar Metro (North Kolkata)');
  const [timeWindow, setTimeWindow] = useState('14:00 - 22:00 (Evening Puja)');
  const [transport, setTransport] = useState('METRO_AND_WALK');
  const [interest, setInterest] = useState('TRADITIONAL');
  const [pandalCount, setPandalCount] = useState(6);
  const [walkingTolerance, setWalkingTolerance] = useState('MEDIUM');
  const [isGenerating, setIsGenerating] = useState(false);

  const startLocations = [
    'Shyambazar Metro (North Kolkata)',
    'Sovabazar Sutanuti (North Kolkata)',
    'Esplanade Metro (Central Kolkata)',
    'Kalighat Metro (South Kolkata)',
    'Gariahat Crossing (South Kolkata)',
    'Salt Lake Karunamoyee (East Kolkata)',
  ];

  const handleGenerate = async () => {
    haptics.heavy();
    setIsGenerating(true);
    try {
      const trip = await api.planRoute({
        date: selectedDate,
        start_location_name: startLocation,
        target_pandals: pandalCount,
        walking_tolerance: walkingTolerance,
        transport_preference: transport,
        interest: interest,
      });

      setCurrentTrip(trip);
      haptics.success();
      router.push(`/route/${trip.id}`);
    } catch {
      haptics.error();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressIndicator, { width: `${(step / 7) * 100}%` }]} />
        </View>

        {/* Step Header */}
        <View style={styles.header}>
          <Text style={styles.stepCounter}>STEP {step} OF 7</Text>
          <Text style={styles.stepTitle}>
            {step === 1 && 'Select Puja Date'}
            {step === 2 && 'Choose Starting Point'}
            {step === 3 && 'Preferred Time Window'}
            {step === 4 && 'Transit Mode'}
            {step === 5 && 'Puja Interest Style'}
            {step === 6 && 'Target Pandals'}
            {step === 7 && 'Walking Tolerance'}
          </Text>
        </View>

        {/* Step Contents */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {step === 1 && (
            <View style={styles.optionsList}>
              {[
                { date: '2026-10-14', label: '14 OCT • PRE-PUJA', sub: 'Early opening & lighting previews' },
                { date: '2026-10-15', label: '15 OCT • MAHA CHATURTHI', sub: 'Official festive inaugurations' },
                { date: '2026-10-16', label: '16 OCT • MAHA PANCHAMI', sub: 'Darshan queues start open' },
                { date: '2026-10-17', label: '17 OCT • MAHA SHASHTHI', sub: 'Bodhon & classical rituals' },
                { date: '2026-10-18', label: '18 OCT • MAHA SAPTAMI', sub: 'Nabapatrika & prime evening crowd' },
                { date: '2026-10-19', label: '19 OCT • MAHA ASHTAMI', sub: 'Anjali & Sandhi Puja night' },
                { date: '2026-10-20', label: '20 OCT • MAHA NAVAMI', sub: 'Grand midnight hopping' },
                { date: '2026-10-21', label: '21 OCT • VIJAYA DASHAMI', sub: 'Sindoor khela & immersion' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.date}
                  onPress={() => {
                    haptics.selection();
                    setSelectedDate(item.date);
                  }}
                  style={[styles.optionCard, selectedDate === item.date && styles.optionCardActive]}
                >
                  <Calendar size={18} color={selectedDate === item.date ? colors.softGold : colors.textSecondary} />
                  <View style={styles.optionTextGroup}>
                    <Text style={[styles.optionLabel, selectedDate === item.date && styles.optionLabelActive]}>
                      {item.label}
                    </Text>
                    <Text style={styles.optionSub}>{item.sub}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 2 && (
            <View style={styles.optionsList}>
              {startLocations.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  onPress={() => {
                    haptics.selection();
                    setStartLocation(loc);
                  }}
                  style={[styles.optionCard, startLocation === loc && styles.optionCardActive]}
                >
                  <MapPin size={18} color={startLocation === loc ? colors.softGold : colors.textSecondary} />
                  <Text style={[styles.optionLabel, startLocation === loc && styles.optionLabelActive]}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 3 && (
            <View style={styles.optionsList}>
              {[
                '10:00 - 15:00 (Morning Darshan • Low Crowd)',
                '14:00 - 22:00 (Evening Puja • Prime Lighting)',
                '19:00 - 03:00 (All-Night Hopping • Night Vibe)',
              ].map((time) => (
                <TouchableOpacity
                  key={time}
                  onPress={() => {
                    haptics.selection();
                    setTimeWindow(time);
                  }}
                  style={[styles.optionCard, timeWindow === time && styles.optionCardActive]}
                >
                  <Clock size={18} color={timeWindow === time ? colors.softGold : colors.textSecondary} />
                  <Text style={[styles.optionLabel, timeWindow === time && styles.optionLabelActive]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 4 && (
            <View style={styles.optionsList}>
              {[
                { id: 'METRO_AND_WALK', label: 'Metro + Walking (Recommended)' },
                { id: 'WALK_ONLY', label: 'Walking Only (Compact Cluster)' },
                { id: 'CAB_PREFERRED', label: 'Taxi / Mixed (Traffic Sensitive)' },
              ].map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => {
                    haptics.selection();
                    setTransport(t.id);
                  }}
                  style={[styles.optionCard, transport === t.id && styles.optionCardActive]}
                >
                  <Train size={18} color={transport === t.id ? colors.softGold : colors.textSecondary} />
                  <Text style={[styles.optionLabel, transport === t.id && styles.optionLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 5 && (
            <View style={styles.optionsList}>
              {[
                { id: 'TRADITIONAL', label: 'Traditional & Heritage (Shobhabazar, Bagbazar)' },
                { id: 'ARTISTIC', label: 'Contemporary Artistic Themes (South Kolkata)' },
                { id: 'PHOTOGRAPHY', label: 'Photography & Grand Architecture' },
                { id: 'LOW_CROWD', label: 'Family & Crowd Avoidance' },
              ].map((int) => (
                <TouchableOpacity
                  key={int.id}
                  onPress={() => {
                    haptics.selection();
                    setInterest(int.id);
                  }}
                  style={[styles.optionCard, interest === int.id && styles.optionCardActive]}
                >
                  <Sparkles size={18} color={interest === int.id ? colors.softGold : colors.textSecondary} />
                  <Text style={[styles.optionLabel, interest === int.id && styles.optionLabelActive]}>{int.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 6 && (
            <View style={styles.optionsList}>
              {[
                { count: 3, label: '3 Pandals • Relaxed Pace' },
                { count: 5, label: '5 Pandals • Classic Trail' },
                { count: 6, label: '6 Pandals • Best of Kolkata (Optimal)' },
                { count: 8, label: '8 Pandals • Passionate Hopper' },
                { count: 10, label: '10+ Pandals • Maximum Challenge' },
              ].map((c) => (
                <TouchableOpacity
                  key={c.count}
                  onPress={() => {
                    haptics.selection();
                    setPandalCount(c.count);
                  }}
                  style={[styles.optionCard, pandalCount === c.count && styles.optionCardActive]}
                >
                  <Text style={styles.countBadge}>{c.count}</Text>
                  <Text style={[styles.optionLabel, pandalCount === c.count && styles.optionLabelActive]}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 7 && (
            <View style={styles.optionsList}>
              {[
                { id: 'LOW', label: 'Low Walking (Under 3 km total)' },
                { id: 'MEDIUM', label: 'Moderate Walking (3 to 6 km total)' },
                { id: 'HIGH', label: 'High Walking (6+ km • Authentic Kolkata Foot Experience)' },
              ].map((w) => (
                <TouchableOpacity
                  key={w.id}
                  onPress={() => {
                    haptics.selection();
                    setWalkingTolerance(w.id);
                  }}
                  style={[styles.optionCard, walkingTolerance === w.id && styles.optionCardActive]}
                >
                  <Footprints size={18} color={walkingTolerance === w.id ? colors.softGold : colors.textSecondary} />
                  <Text style={[styles.optionLabel, walkingTolerance === w.id && styles.optionLabelActive]}>
                    {w.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer Navigation Buttons */}
        <View style={styles.footer}>
          {step > 1 ? (
            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                setStep(step - 1);
              }}
              style={styles.backButton}
            >
              <ArrowLeft size={16} color={colors.textPrimary} />
              <Text style={styles.backButtonText}>BACK</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {step < 7 ? (
            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                setStep(step + 1);
              }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>CONTINUE</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleGenerate}
              disabled={isGenerating}
              style={styles.generateButton}
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Sparkles size={16} color="#FFFFFF" />
                  <Text style={styles.generateButtonText}>GENERATE ROUTE</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default PlanScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressIndicator: {
    height: 4,
    backgroundColor: colors.antiqueGold,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  stepCounter: {
    color: colors.softGold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionCardActive: {
    borderColor: colors.antiqueGold,
    backgroundColor: 'rgba(214, 168, 79, 0.12)',
  },
  optionTextGroup: {
    flex: 1,
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  optionLabelActive: {
    color: colors.softGold,
    fontWeight: '700',
  },
  optionSub: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  countBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: colors.antiqueGold,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '800',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.cardDark,
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.cardBorder,
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  generateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.durgaRed,
    paddingVertical: 14,
    borderRadius: 14,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
