// =============================================================================
// RIIQX Mobile — Primary Tab Navigator
// One Goal. An AI That Gets It Done.
// =============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.cardBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="creator"
        options={{
          title: 'Creator',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'videocam' : 'videocam-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="autopilot"
        options={{
          title: 'Autopilot',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'sync' : 'sync-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'checkbox' : 'checkbox-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
