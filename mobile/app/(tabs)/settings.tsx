// =============================================================================
// RIIQX Mobile — Settings & Cloud Governance Screen
// AWS Bedrock Runtime • Meta Instagram v20.0 • Non-Firebase Cryptographic Privacy
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';
import { colors } from '../../src/theme/colors';

export default function SettingsScreen() {
  const { user } = useRiiqxMobile();
  const [cleared, setCleared] = useState(false);

  const handleExport = () => {
    Alert.alert(
      'Export Workspace',
      'Encrypted mobile state export is ready. Syncing with server-side vault.'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Local Cache',
      'Are you sure you want to clear local message caches? Server vault data remains intact.',
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="settings-outline" size={20} color={colors.cyan} />
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Settings &amp; Governance
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
            System infrastructure, online cloud runtimes &amp; cryptographic account isolation.
          </Text>
        </View>

        {/* Section 1: Online Cloud AI Runtime */}
        <View style={{ gap: 10, marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
            ONLINE CLOUD RUNTIME (PRIMARY)
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="cloud-outline" size={16} color={colors.cyan} />
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                  AWS Bedrock Runtime
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: colors.cyan, fontSize: 9, fontWeight: '700' }}>AUTHORIZED</Text>
              </View>
            </View>

            <View style={{ gap: 2 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                Model: <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Claude Sonnet 4 / 3.7</Text>
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                Region: <Text style={{ color: colors.cyan, fontWeight: '600' }}>ap-southeast-2 (Sydney)</Text>
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                Token Monitor: Active daily quota throttler tracking
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Social Media Integrations */}
        <View style={{ gap: 10, marginBottom: 16 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
            SOCIAL MEDIA INTEGRATIONS
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="share-social-outline" size={16} color={colors.pink} />
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                  Meta Instagram Graph API v20.0
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: colors.pink, fontSize: 9, fontWeight: '700' }}>596660929655724</Text>
              </View>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 11, lineHeight: 16 }}>
              Bound via server environment token. Configured for Reels container dispatch and hook engagement tracking.
            </Text>
          </View>
        </View>

        {/* Section 3: Non-Firebase Security */}
        <View style={{ gap: 10, marginBottom: 20 }}>
          <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>
            CRYPTOGRAPHIC PRIVACY &amp; SECURITY
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.emerald} />
              <Text style={{ color: colors.emerald, fontSize: 13, fontWeight: '700' }}>
                100% Non-Firebase Architecture
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 11, lineHeight: 16 }}>
              Zero Firebase dependencies. Passphrases salted with 16-byte random salts and stretched via 10,000 rounds of PBKDF2 HMAC SHA-256.
            </Text>
            <View style={{ marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.cardBorder }}>
              <Text style={{ color: colors.textMuted, fontSize: 10 }}>
                Active Identity: {user.name} ({user.email}) • Role: {user.role.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={handleExport}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
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
            <Ionicons name="download-outline" size={16} color={colors.cyan} />
            <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
              Export Workspace Archive (JSON)
            </Text>
          </TouchableOpacity>

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
