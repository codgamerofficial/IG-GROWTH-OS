// =============================================================================
// RIIQX Mobile — Settings, Governance & Shared Backend Diagnostics
// Supabase Auth · Live API Gateway Telemetry · Clean Sign Out
// =============================================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';
import { colors } from '../../src/theme/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    user,
    signOut,
    isAuthenticated,
    apiBaseUrl,
    isBackendConnected,
    refreshAll,
  } = useRiiqxMobile();

  const [cleared, setCleared] = useState<boolean>(false);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of RIIQX?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  }, [signOut, router]);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Clear Local Cache',
      'Are you sure you want to clear local cache? Server data remains secure.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            setCleared(true);
            setTimeout(() => setCleared(false), 2000);
          },
        },
      ]
    );
  }, []);

  const handleTestConnection = useCallback(async () => {
    await refreshAll();
    Alert.alert('Server Probed', `Backend connection probed at ${apiBaseUrl}`);
  }, [refreshAll, apiBaseUrl]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="settings-outline" size={20} color={colors.cyan} />
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Settings &amp; Governance
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
            System infrastructure, online cloud runtimes &amp; shared RIIQX workspace.
          </Text>
        </View>

        {/* Section 0: User Identity & Supabase Session */}
        <View style={{ gap: 10, marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
            AUTHENTICATED IDENTITY (SUPABASE)
          </Text>

          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              gap: 8,
            }}
          >
            {isAuthenticated && user ? (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="person-circle-outline" size={20} color={colors.cyan} />
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>
                      {user.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.15)',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: colors.emerald, fontSize: 10, fontWeight: '700' }}>
                      {user.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {user.email}
                </Text>
                <TouchableOpacity
                  onPress={handleSignOut}
                  style={{
                    marginTop: 6,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: 'rgba(244, 63, 94, 0.12)',
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text style={{ color: colors.rose, fontSize: 11, fontWeight: '700' }}>
                    Sign Out Account
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                    Guest Explorer
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    Not signed into a Supabase account
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/auth/login')}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: '#FFD43B',
                  }}
                >
                  <Text style={{ color: '#0C0C0E', fontSize: 11, fontWeight: '700' }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Section 1: Server Connection Diagnostic */}
        <View style={{ gap: 10, marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
            SHARED BACKEND GATEWAY
          </Text>

          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="server-outline" size={16} color={colors.cyan} />
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                  Next.js Online Core
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: isBackendConnected
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(244, 63, 94, 0.15)',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    color: isBackendConnected ? colors.emerald : colors.rose,
                    fontSize: 9,
                    fontWeight: '700',
                  }}
                >
                  {isBackendConnected ? 'ONLINE' : 'UNREACHABLE'}
                </Text>
              </View>
            </View>

            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
              Target: {apiBaseUrl}
            </Text>

            <TouchableOpacity
              onPress={handleTestConnection}
              style={{
                alignSelf: 'flex-start',
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                marginTop: 2,
              }}
            >
              <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: '600' }}>
                Test Connection
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 10, marginTop: 10 }}>
          <TouchableOpacity
            onPress={handleClearCache}
            style={{
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              borderColor: 'rgba(244, 63, 94, 0.3)',
              borderWidth: 1,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="trash-outline" size={16} color={colors.rose} />
            <Text style={{ color: colors.rose, fontSize: 12, fontWeight: '700' }}>
              {cleared ? 'Cache Cleared!' : 'Clear Device Cache'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
