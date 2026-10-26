// =============================================================================
// RIIQX Mobile 2.0 — Apps & Tools Hub
// One-Tap Access to Autopilot, Research, Code, Files, Analytics & Settings
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function MobileAppsScreen() {
  const router = useRouter();

  const apps = [
    {
      title: 'Autopilot Center',
      desc: 'Content calendar, auto-posting, and schedule',
      icon: 'sync',
      color: colors.emerald,
      bg: colors.emeraldSubtle,
      route: '/(tabs)/autopilot',
    },
    {
      title: 'Task Planner',
      desc: 'Decompose goals into automated steps',
      icon: 'checkbox',
      color: colors.violet,
      bg: colors.violetSubtle,
      route: '/(tabs)/tasks',
    },
    {
      title: 'Tools & Integrations',
      desc: 'Google Drive, YouTube, Instagram, GitHub',
      icon: 'cube',
      color: colors.pink,
      bg: colors.pinkSubtle,
      route: '/(tabs)/settings',
    },
    {
      title: 'Deep Research',
      desc: 'Verified citations & market intelligence',
      icon: 'search',
      color: colors.blue,
      bg: '#E0F2FE',
      route: '/(tabs)/chat',
    },
    {
      title: 'Code Studio',
      desc: 'Lint, debug, and explain codebases',
      icon: 'code-slash',
      color: '#6366F1',
      bg: '#EEF2FF',
      route: '/(tabs)/chat',
    },
    {
      title: 'Settings & Cloud',
      desc: 'Account, AI models, and subscriptions',
      icon: 'settings',
      color: colors.textSecondary,
      bg: colors.bgSubtle,
      route: '/(tabs)/settings',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 100 }}
      >
        <Text style={{ fontSize: 20, fontWeight: '900', color: colors.textPrimary, marginBottom: 4 }}>
          Apps &amp; Tools
        </Text>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 20 }}>
          Access all autonomous tools and platform integrations.
        </Text>

        <View style={{ gap: 12 }}>
          {apps.map((app, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => router.push(app.route as any)}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderRadius: 20,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: app.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={app.icon as any} size={22} color={app.color} />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary }}>
                    {app.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                    {app.desc}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
