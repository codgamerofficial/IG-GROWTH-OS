// =============================================================================
// RIIQX Mobile — Autopilot Center Screen
// Level 3 Autonomous Social Publishing • Emergency STOP Circuit Breaker
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';
import { colors } from '../../src/theme/colors';

export default function AutopilotScreen() {
  const { autopilotQueue, emergencyStop, toggleEmergencyStop, refreshAll } = useRiiqxMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="sync" size={20} color={colors.cyan} />
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
                Autopilot Center
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>
              Level 3 Autonomous Social Content Engine
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleRefresh}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={colors.cyan} />
            ) : (
              <Ionicons name="refresh" size={14} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Emergency Circuit Breaker Card */}
        <View
          style={{
            backgroundColor: emergencyStop ? 'rgba(244, 63, 94, 0.12)' : colors.surface,
            borderColor: emergencyStop ? colors.rose : colors.cardBorder,
            borderWidth: 1.5,
            borderRadius: 16,
            padding: 16,
            gap: 12,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={emergencyStop ? colors.rose : colors.cyan}
              />
              <Text
                style={{
                  color: emergencyStop ? colors.rose : '#FFFFFF',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {emergencyStop ? 'CIRCUIT BREAKER: HALTED' : 'AUTOPILOT: ACTIVE'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={toggleEmergencyStop}
              style={{
                backgroundColor: emergencyStop ? colors.emerald : colors.rose,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                {emergencyStop ? 'RESUME' : 'EMERGENCY STOP'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: colors.textSecondary, fontSize: 11, lineHeight: 16 }}>
            {emergencyStop
              ? 'All autonomous posting and pipeline rendering are immediately paused. No posts will publish until resumed.'
              : 'Autonomous Level 3 posting is active within configured spending limits and safety gates.'}
          </Text>
        </View>

        {/* Connected Channels */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 8 }}>
            CONNECTED CHANNELS
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Instagram */}
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                gap: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Ionicons name="logo-instagram" size={16} color={colors.pink} />
                <View
                  style={{
                    backgroundColor: 'rgba(236, 72, 153, 0.15)',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: colors.pink, fontSize: 9, fontWeight: '700' }}>LINKED</Text>
                </View>
              </View>
              <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600', marginTop: 4 }}>
                Instagram Reels
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 10 }}>ID: 596660929655724</Text>
            </View>

            {/* YouTube */}
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
                borderWidth: 1,
                borderRadius: 12,
                padding: 12,
                gap: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Ionicons name="logo-youtube" size={16} color={colors.rose} />
                <View
                  style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.15)',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: colors.rose, fontSize: 9, fontWeight: '700' }}>SHORTS</Text>
                </View>
              </View>
              <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600', marginTop: 4 }}>
                YouTube Shorts
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 10 }}>Quota Verified</Text>
            </View>
          </View>
        </View>

        {/* Scheduled Queue */}
        <View>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 8 }}>
            AUTONOMOUS PIPELINE QUEUE
          </Text>

          {autopilotQueue.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
                borderWidth: 1,
                borderRadius: 12,
                padding: 24,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                Queue is empty. New content generates automatically based on schedule.
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {autopilotQueue.map((item) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                    borderWidth: 1,
                    borderRadius: 14,
                    padding: 14,
                    gap: 6,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text
                      style={{
                        color: colors.cyan,
                        fontSize: 10,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.platform} • {item.niche}
                    </Text>
                    <View
                      style={{
                        backgroundColor:
                          item.status === 'published'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : item.status === 'rendering'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(6, 182, 212, 0.15)',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            item.status === 'published'
                              ? colors.emerald
                              : item.status === 'rendering'
                              ? colors.amber
                              : colors.cyan,
                          fontSize: 9,
                          fontWeight: '700',
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '600' }}>
                    {item.title}
                  </Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="time-outline" size={11} color={colors.textMuted} />
                      <Text style={{ color: colors.textMuted, fontSize: 10 }}>
                        {item.scheduledTime}
                      </Text>
                    </View>
                    {item.hookScore && (
                      <Text style={{ color: colors.emerald, fontSize: 10, fontWeight: '700' }}>
                        Hook Score: {item.hookScore}/100
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
