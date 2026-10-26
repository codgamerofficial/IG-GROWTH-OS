// =============================================================================
// RIIQX Mobile — Root Application Layout
// Stack navigator, SafeAreaProvider, and RIIQX Mobile Context
// =============================================================================

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RiiqxMobileProvider } from '../src/context/RiiqxMobileContext';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RiiqxMobileProvider>
        <StatusBar style="light" backgroundColor={colors.bg} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RiiqxMobileProvider>
    </SafeAreaProvider>
  );
}
