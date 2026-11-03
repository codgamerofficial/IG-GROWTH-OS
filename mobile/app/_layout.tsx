// =============================================================================
// RIIQX Mobile — Root Application Layout
// Host Shell for RIIQX Web Application Container & Native Screens
// =============================================================================

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RiiqxProvider } from '../src/context/RiiqxContext';
import { RiiqxMobileProvider } from '../src/context/RiiqxMobileContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RiiqxProvider>
        <RiiqxMobileProvider>
          <StatusBar style="light" backgroundColor="#0C0C0E" />
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0C0C0E' },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
            <Stack.Screen name="learn" options={{ headerShown: false }} />
            <Stack.Screen name="support" options={{ headerShown: false }} />
          </Stack>
        </RiiqxMobileProvider>
      </RiiqxProvider>
    </SafeAreaProvider>
  );
}
