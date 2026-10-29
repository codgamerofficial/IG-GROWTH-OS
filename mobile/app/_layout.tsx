// =============================================================================
// RIIQX Mobile — Root Application Layout
// Stack navigator, SafeAreaProvider, and RIIQX Master Context
// =============================================================================

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RiiqxProvider, useRiiqx } from '../src/context/RiiqxContext';
import { lightColors, darkColors } from '../src/theme/colors';

function RootContent() {
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={theme.canvas} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.canvas },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="splash" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/interests" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/connect" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/permission" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/success" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/biometric" options={{ headerShown: false }} />
        <Stack.Screen name="learn" options={{ headerShown: false }} />
        <Stack.Screen name="support" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RiiqxProvider>
        <RootContent />
      </RiiqxProvider>
    </SafeAreaProvider>
  );
}
