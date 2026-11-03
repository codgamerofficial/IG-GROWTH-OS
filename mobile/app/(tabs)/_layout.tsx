// =============================================================================
// RIIQX Mobile 2.0 — Master Agentic Tab Navigator
// 100% PURE NATIVE REACT NATIVE COMPONENT • ZERO WEBVIEW • ZERO IFRAME
// Home • AI Agent • Creator Studio • Autopilot • Modules Hub
// Deep Obsidian Aesthetic • Obsidian #0C0C0E • Primary Yellow #FFD43B
// =============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0C0C0E',
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FFD43B',
        tabBarInactiveTintColor: '#737373',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      {/* Tab 1: Home (Agentic OS Command Center) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 2: AI Agent & Multimodal Chat */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Agent',
          tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3: Creator Studio (9:16 Video Canvas & Subtitles) */}
      <Tabs.Screen
        name="creator"
        options={{
          title: 'Creator',
          tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
            <Ionicons
              name={focused ? 'videocam' : 'videocam-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 4: Social Autopilot & Emergency STOP */}
      <Tabs.Screen
        name="autopilot"
        options={{
          title: 'Autopilot',
          tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
            <Ionicons
              name={focused ? 'sync' : 'sync-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 5: All 11 Modules Hub */}
      <Tabs.Screen
        name="apps"
        options={{
          title: 'Modules',
          tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size - 2}
              color={color}
            />
          ),
        }}
      />

      {/* Registered Sub-Screens (Accessible via Navigation / Hub) */}
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen name="research" options={{ href: null }} />
      <Tabs.Screen name="code" options={{ href: null }} />
      <Tabs.Screen name="integrations" options={{ href: null }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
      <Tabs.Screen name="library" options={{ href: null }} />
      <Tabs.Screen name="studio" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
