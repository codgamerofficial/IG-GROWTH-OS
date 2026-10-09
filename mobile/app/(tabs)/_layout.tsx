// =============================================================================
// PujaHop Kolkata Mobile: Native Bottom Tab Navigator
// Section 5: HOME, EXPLORE, PLAN, PASSPORT, MORE with gold/red active glow
// =============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Compass, Route, Award, Menu } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardDark,
          borderTopColor: colors.cardBorder,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.softGold,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Home size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'EXPLORE',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Compass size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'PLAN',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Route size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: 'PASSPORT',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Award size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'MORE',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Menu size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}
