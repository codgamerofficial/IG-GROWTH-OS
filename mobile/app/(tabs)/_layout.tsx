// =============================================================================
// RIIQX Mobile 2.0 — Primary 5-Tab Navigator
// Home • AI Chat • Create (+) • Studio • Apps
// Matching Reference Image 2 Screen 2 & Screen 13
// =============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
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
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.violet,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      {/* Tab 1: Home */}
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

      {/* Tab 2: AI Chat */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3: Create (Prominent Elevated Central Action Button) */}
      <Tabs.Screen
        name="creator"
        options={{
          title: '',
          tabBarIcon: () => (
            <View style={styles.createButtonContainer}>
              <View style={styles.createButton}>
                <Ionicons name="add" size={26} color="#FFFFFF" />
              </View>
            </View>
          ),
        }}
      />

      {/* Tab 4: Studio */}
      <Tabs.Screen
        name="studio"
        options={{
          title: 'Studio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'film' : 'film-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 5: Apps / Tools */}
      <Tabs.Screen
        name="apps"
        options={{
          title: 'Apps',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden Auxiliary Screens in Tab Router */}
      <Tabs.Screen
        name="autopilot"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createButtonContainer: {
    top: -12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
});
