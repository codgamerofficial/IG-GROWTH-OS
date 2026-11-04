// =============================================================================
// RIIQX Mobile — Integrations & Connected Social Gateways Screen
// YouTube Data API v3 • Meta Graph API v26.0 • Real Token Probes
// PURE NATIVE REACT NATIVE COMPONENT • ZERO MOCK DATA
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api, SocialAccountItem } from '../../src/services/api';

const SUPPORTED_GATEWAYS = [
  { id: 'youtube', name: 'YouTube Data API v3', icon: 'logo-youtube', color: '#FF0000', desc: 'Shorts auto-publishing & video analytics' },
  { id: 'instagram', name: 'Meta Instagram Graph API v26.0', icon: 'logo-instagram', color: '#E1306C', desc: 'Reels container dispatch & hook tracking' },
  { id: 'facebook', name: 'Meta Facebook Pages API v26.0', icon: 'logo-facebook', color: '#1877F2', desc: 'Page video dispatch & audience telemetry' },
  { id: 'google_drive', name: 'Google Drive Asset Storage', icon: 'cloud-upload', color: '#4285F4', desc: 'Raw footage & b-roll cloud sync' },
  { id: 'github', name: 'GitHub Integration', icon: 'logo-github', color: '#F0F6FC', desc: 'Code repository push & sync' },
];

export default function IntegrationsScreen() {
  const [accounts, setAccounts] = useState<SocialAccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await api.getSocialAccounts();
      setAccounts(data);
    } catch {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleTestAccount = async (id: string) => {
    setTestingId(id);
    try {
      const res = await api.testSocialAccount(id);
      Alert.alert('Connection Probe', res.message || 'Gateway connection verified successfully.');
    } catch (err: any) {
      Alert.alert('Probe Result', err.message || 'Unable to reach provider API.');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.iconBadge}>
              <Ionicons name="git-network" size={18} color="#FFD43B" />
            </View>
            <View>
              <Text style={styles.title}>Tools &amp; Integrations</Text>
              <Text style={styles.subtitle}>
                OAuth 2.0 Gateways • Verified Token Handshake
              </Text>
            </View>
          </View>
        </View>

        {/* Connected Accounts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONNECTED CHANNELS</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#FFD43B" style={{ marginVertical: 20 }} />
          ) : accounts.length > 0 ? (
            accounts.map((acc) => {
              const isYt = acc.provider.includes('youtube');
              const isFb = acc.provider.includes('facebook');
              const iconName = isYt ? 'logo-youtube' : isFb ? 'logo-facebook' : 'logo-instagram';
              const iconColor = isYt ? '#FF4D4F' : isFb ? '#1877F2' : '#FF6B5E';
              const isExpired = acc.status === 'expired';

              return (
                <View key={acc.id} style={styles.accountCard}>
                  <View style={styles.accountHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Ionicons
                        name={iconName as any}
                        size={22}
                        color={iconColor}
                      />
                      <View>
                        <Text style={styles.accountName}>{acc.accountName}</Text>
                        <Text style={styles.accountHandle}>
                          {acc.accountHandle || `@${acc.provider}`} • {acc.provider.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, isExpired && { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                      <Text style={[styles.statusText, isExpired && { color: '#F59E0B' }]}>
                        {isExpired ? 'REAUTH' : acc.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.testButton}
                    onPress={() => handleTestAccount(acc.id)}
                    disabled={testingId === acc.id}
                  >
                    {testingId === acc.id ? (
                      <ActivityIndicator size="small" color="#A3A3A3" />
                    ) : (
                      <>
                        <Ionicons name="flash-outline" size={14} color="#A3A3A3" style={{ marginRight: 4 }} />
                        <Text style={styles.testButtonText}>Probe Connection</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="link-outline" size={32} color="#737373" />
              <Text style={styles.emptyTitle}>No Channels Connected Yet</Text>
              <Text style={styles.emptySubtitle}>
                Connect YouTube or Instagram in server settings to enable autonomous 9:16 dispatch.
              </Text>
            </View>
          )}
        </View>

        {/* Available Gateway Connectors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORTED PLATFORM CONNECTORS</Text>
          {SUPPORTED_GATEWAYS.map((gw) => (
            <View key={gw.id} style={styles.gatewayCard}>
              <View style={styles.gatewayRow}>
                <View style={[styles.gwIconBadge, { backgroundColor: `${gw.color}15` }]}>
                  <Ionicons name={gw.icon as any} size={20} color={gw.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gwName}>{gw.name}</Text>
                  <Text style={styles.gwDesc}>{gw.desc}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 212, 59, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 11,
    color: '#A3A3A3',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#737373',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  accountCard: {
    backgroundColor: '#141416',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  accountName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  accountHandle: {
    color: '#737373',
    fontSize: 11,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
  },
  testButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  testButtonText: {
    color: '#A3A3A3',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#141416',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#737373',
    fontSize: 11,
    textAlign: 'center',
  },
  gatewayCard: {
    backgroundColor: '#141416',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 8,
  },
  gatewayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gwIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gwName: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  gwDesc: {
    color: '#737373',
    fontSize: 10.5,
    marginTop: 2,
  },
});

