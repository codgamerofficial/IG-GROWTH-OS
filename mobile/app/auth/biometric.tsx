// =============================================================================
// RIIQX Mobile — Screen 7: Biometric Login Screen
// Matches Reference Board Screen 7
// "Use Face ID" • Glowing Biometric Sensor Graphic • PIN Fallback
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BiometricScreen() {
  const router = useRouter();
  const [authenticating, setAuthenticating] = useState(false);

  const handleBiometricAuth = () => {
    setAuthenticating(true);
    setTimeout(() => {
      setAuthenticating(false);
      router.replace('/(tabs)');
    }, 700);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>R</Text>
          </View>
          <Text style={styles.brandText}>RIIQX</Text>
        </View>

        {/* Center Biometric Graphic */}
        <View style={styles.centerGraphic}>
          <View style={styles.scanRingOuter}>
            <View style={styles.scanRingInner}>
              <View style={styles.iconCircle}>
                <Ionicons name="scan" size={54} color="#8B5CF6" />
              </View>
            </View>
          </View>

          <Text style={styles.title}>Use Face ID</Text>
          <Text style={styles.subtitle}>Authenticate to access your portfolio securely.</Text>
        </View>

        {/* Action Controls */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleBiometricAuth}
            disabled={authenticating}
            activeOpacity={0.85}
          >
            {authenticating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="finger-print" size={20} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Use Face ID</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.replace('/(tabs)')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryBtnText}>Use PIN instead</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F121C',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  centerGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  scanRingOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  scanRingInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(103, 80, 216, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomActions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#6750D8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
});
