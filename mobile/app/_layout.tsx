// =============================================================================
// PujaHop Kolkata Mobile: Root Application Layout
// Section 4 & 10: Stack navigator, SafeAreaProvider, and PujaHop Context
// =============================================================================

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PujaHopProvider } from '../src/hooks/usePujaHop';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PujaHopProvider>
        <StatusBar style="light" backgroundColor={colors.deepCharcoal} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.deepCharcoal },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="pandal/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="route/[id]"
            options={{
              presentation: 'card',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="copilot/index"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="emergency/index"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </PujaHopProvider>
    </SafeAreaProvider>
  );
}
