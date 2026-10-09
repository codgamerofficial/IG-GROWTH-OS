// =============================================================================
// PujaHop Kolkata Mobile: App Settings & Offline Cache Manager
// Section 68: Settings, storage, permissions, language, creator credit
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Database, Bell, MapPin, Camera, Trash2, RefreshCw, Moon, Globe, Shield, User, Heart } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useHaptics } from '../../src/hooks/useHaptics';
import { usePujaHop } from '../../src/hooks/usePujaHop';
import { mobileStorage } from '../../src/services/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const { pandals, visitedPandals, userLocation, refreshData } = usePujaHop();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);
  const [bengaliPreferred, setBengaliPreferred] = useState(false);

  const handleClearCache = async () => {
    haptics.heavy();
    Alert.alert(
      'Clear Offline Data?',
      'This will remove cached pandals and saved offline trips. Your earned digital stamps will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            await mobileStorage.clearCache();
            await refreshData();
            haptics.success();
            Alert.alert('Success', 'Offline cache successfully refreshed.');
          },
        },
      ]
    );
  };

  const handleSyncNow = async () => {
    haptics.medium();
    await refreshData();
    haptics.success();
    Alert.alert('Synchronized', 'Latest verified pandals, metro lines, and traffic advisories updated.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            haptics.light();
            router.back();
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings &amp; Cache</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Offline Cache Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OFFLINE STORAGE &amp; SYNC</Text>
          <View style={styles.card}>
            <View style={styles.cacheMetricRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Cached Pandals</Text>
                <Text style={styles.metricVal}>{pandals.length}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Earned Stamps</Text>
                <Text style={styles.metricVal}>{visitedPandals.length}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Storage Size</Text>
                <Text style={styles.metricVal}>~1.8 MB</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              onPress={handleSyncNow}
              style={styles.actionRow}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <RefreshCw size={18} color={colors.antiqueGold} />
                <Text style={styles.actionText}>Re-sync Verified Telemetry</Text>
              </View>
              <Text style={styles.actionSub}>Sync Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClearCache}
              style={[styles.actionRow, { borderTopWidth: 1, borderTopColor: colors.cardBorder }]}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <Trash2 size={18} color={colors.danger} />
                <Text style={[styles.actionText, { color: colors.danger }]}>Clear Offline Cache</Text>
              </View>
              <Text style={styles.actionSub}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Device Permissions Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEVICE PERMISSIONS</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <MapPin size={18} color={colors.antiqueGold} />
                <View>
                  <Text style={styles.switchTitle}>GPS Location</Text>
                  <Text style={styles.switchDesc}>
                    {userLocation ? 'Precise coordinates enabled' : 'Location denied (using city center)'}
                  </Text>
                </View>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{userLocation ? 'ACTIVE' : 'DEFAULT'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Bell size={18} color={colors.festiveOrange} />
                <View>
                  <Text style={styles.switchTitle}>Festival Notifications</Text>
                  <Text style={styles.switchDesc}>Trip reminders &amp; route advisories</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={(val) => {
                  haptics.selection();
                  setNotificationsEnabled(val);
                }}
                trackColor={{ false: colors.cardBorder, true: colors.antiqueGold }}
                thumbColor={colors.ivory}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Camera size={18} color={colors.metroBlue} />
                <View>
                  <Text style={styles.switchTitle}>Camera Verification</Text>
                  <Text style={styles.switchDesc}>For Passport photo check-in stamps</Text>
                </View>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>ON-DEMAND</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.card}>
            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Globe size={18} color={colors.antiqueGold} />
                <View>
                  <Text style={styles.switchTitle}>Prefer Bengali Script</Text>
                  <Text style={styles.switchDesc}>বাংলা ভাষায় পুজো ও মেট্রো তথ্য</Text>
                </View>
              </View>
              <Switch
                value={bengaliPreferred}
                onValueChange={(val) => {
                  haptics.selection();
                  setBengaliPreferred(val);
                }}
                trackColor={{ false: colors.cardBorder, true: colors.antiqueGold }}
                thumbColor={colors.ivory}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.switchRow}>
              <View style={styles.switchLeft}>
                <Moon size={18} color={colors.softGold} />
                <View>
                  <Text style={styles.switchTitle}>Appearance</Text>
                  <Text style={styles.switchDesc}>Midnight Charcoal &amp; Festive Gold</Text>
                </View>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>DARK (OLED)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Info & Creator */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT THIS BUILD</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>App Version</Text>
              <Text style={styles.infoVal}>1.0.0 (Production Release)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Package ID</Text>
              <Text style={styles.infoVal}>com.pujahop.kolkata</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Platform</Text>
              <Text style={styles.infoVal}>React Native • Expo SDK 51</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Created By</Text>
              <Text style={[styles.infoVal, { color: colors.antiqueGold, fontWeight: '700' }]}>
                Saswata Dey (Riik)
              </Text>
            </View>
          </View>
        </View>

        {/* Creator Footnote */}
        <View style={styles.creatorFooter}>
          <Heart size={14} color={colors.durgaRed} />
          <Text style={styles.creatorFooterText}>
            Crafted for Kolkata by <Text style={{ color: colors.antiqueGold }}>Saswata Dey (Riik)</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.cardDark,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.cardDark,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cacheMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  metricVal: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  actionSub: {
    color: colors.textMuted,
    fontSize: 11,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  switchDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: `${colors.antiqueGold}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillText: {
    color: colors.antiqueGold,
    fontSize: 10,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoKey: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  infoVal: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  creatorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  creatorFooterText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
