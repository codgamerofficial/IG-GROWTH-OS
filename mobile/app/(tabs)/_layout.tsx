// =============================================================================
// RIIQX Mobile — Primary 5-Tab Navigator
// Home • Portfolio • Explore • AI Analyst • Profile
// Modern Editorial Fintech Layout • Subtle Accents • Dynamic Dark/Light Theme
// =============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { lightColors, darkColors } from '../../src/theme/colors';

export default function TabLayout() {
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.cardBorder,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      {/* Tab 1: Home (Wealth Dashboard) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 2: Portfolio & Ledger */}
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'pie-chart' : 'pie-chart-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3: Explore & Screener */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 4: AI Analyst */}
      <Tabs.Screen
        name="analyst"
        options={{
          title: 'AI Analyst',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 5: Profile & Legal */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden legacy tab entries */}
      <Tabs.Screen name="apps" options={{ href: null }} />
      <Tabs.Screen name="autopilot" options={{ href: null }} />
      <Tabs.Screen name="chat" options={{ href: null }} />
      <Tabs.Screen name="creator" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="studio" options={{ href: null }} />
      <Tabs.Screen name="tasks" options={{ href: null }} />
    </Tabs>
  );
}
