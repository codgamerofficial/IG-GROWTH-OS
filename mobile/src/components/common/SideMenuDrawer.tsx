// =============================================================================
// RIIQX Mobile — Screen 26: Side Menu / Navigation Drawer
// Matches Master Design Board Screen 26 with profile, quick routes & logout
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../context/RiiqxContext';
import { lightColors, darkColors } from '../../theme/colors';

interface SideMenuDrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline', route: '/(tabs)' },
  { id: 'markets', label: 'Markets', icon: 'trending-up-outline', route: '/(tabs)/explore' },
  { id: 'portfolio', label: 'Portfolio', icon: 'pie-chart-outline', route: '/(tabs)/portfolio' },
  { id: 'ai_advisor', label: 'AI Advisor', icon: 'sparkles-outline', route: '/(tabs)/analyst' },
  { id: 'watchlist', label: 'Watchlist', icon: 'bookmark-outline', route: '/(tabs)/explore' },
  { id: 'screener', label: 'Screener', icon: 'filter-outline', route: '/(tabs)/explore' },
  { id: 'learn', label: 'Learn & Grow', icon: 'school-outline', route: '/learn' },
  { id: 'tools', label: 'Calculators & Tools', icon: 'calculator-outline', route: '/(tabs)/profile' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', route: '/(tabs)/profile' },
  { id: 'support', label: 'Help & Support', icon: 'help-circle-outline', route: '/support' },
];

export function SideMenuDrawer({ visible, onClose }: SideMenuDrawerProps) {
  const router = useRouter();
  const { isDarkMode, profile } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const navigateTo = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 150);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      router.replace('/auth/login' as any);
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop touch area */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer Panel */}
        <SafeAreaView style={[styles.drawer, { backgroundColor: isDarkMode ? '#141821' : '#FFFFFF' }]}>
          {/* Header / Brand */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandLogo}>
                <Text style={styles.brandLogoText}>R</Text>
              </View>
              <Text style={[styles.brandText, { color: theme.textPrimary }]}>
                RIIQX
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: isDarkMode ? '#1C2230' : '#F5F5F0' }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.fullName.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>
                {profile.fullName}
              </Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                {profile.email}
              </Text>
              <View style={styles.tierBadge}>
                <Ionicons name="shield-checkmark" size={10} color="#6750D8" />
                <Text style={styles.tierBadgeText}>PREMIUM USER</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={styles.menuContent}
            showsVerticalScrollIndicator={false}
          >
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => navigateTo(item.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.itemIconBox, { backgroundColor: isDarkMode ? '#1C2230' : '#EDE9FE' }]}>
                  <Ionicons name={item.icon} size={18} color={theme.primary} />
                </View>
                <Text style={[styles.itemLabel, { color: theme.textPrimary }]}>
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Logout Footer */}
          <View style={[styles.footer, { borderTopColor: theme.cardBorder }]}>
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={20} color="#D64B55" />
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
            <Text style={[styles.versionText, { color: theme.textTertiary }]}>
              RIIQX Intelligence v1.0.0
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  drawer: {
    width: '82%',
    maxWidth: 340,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 11,
    marginTop: 1,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  tierBadgeText: {
    color: '#6750D8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    gap: 12,
  },
  itemIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  logoutBtnText: {
    color: '#D64B55',
    fontSize: 14,
    fontWeight: '700',
  },
  versionText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
