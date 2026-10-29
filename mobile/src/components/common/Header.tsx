// =============================================================================
// RIIQX Master Header Component
// Brand Identity • Currency Toggle (INR/USD) • Theme Mode • Data Freshness
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../context/RiiqxContext';
import { lightColors, darkColors } from '../../theme/colors';
import { SideMenuDrawer } from './SideMenuDrawer';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showCurrencyToggle?: boolean;
}

export function Header({ title, subtitle, showCurrencyToggle = true }: HeaderProps) {
  const { baseCurrency, setBaseCurrency, isDarkMode, toggleDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: theme.canvas }]}>
      <SideMenuDrawer visible={showDrawer} onClose={() => setShowDrawer(false)} />

      <View style={styles.topRow}>
        {/* Brand / Logo + Drawer Toggle */}
        <View style={styles.brandContainer}>
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setShowDrawer(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>R</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={[styles.brandText, { color: theme.textPrimary }]}>RIIQX</Text>
              <View style={styles.betaTag}>
                <Text style={styles.betaTagText}>INTELLIGENCE</Text>
              </View>
            </View>
            <Text style={[styles.tagline, { color: theme.textSecondary }]}>
              {subtitle || 'Invest smarter. Understand deeper.'}
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionsRow}>
          {showCurrencyToggle && (
            <TouchableOpacity
              style={[
                styles.currencyPill,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
              onPress={() => setBaseCurrency(baseCurrency === 'INR' ? 'USD' : 'INR')}
              activeOpacity={0.7}
            >
              <Text style={[styles.currencyPillText, { color: theme.primary }]}>
                {baseCurrency === 'INR' ? '₹ INR' : '$ USD'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.iconBtn,
              { backgroundColor: theme.surface, borderColor: theme.cardBorder },
            ]}
            onPress={toggleDarkMode}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {title && (
        <View style={styles.titleSection}>
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>{title}</Text>
        </View>
      )}

      {/* Freshness Bar */}
      <View style={[styles.freshnessBar, { backgroundColor: isDarkMode ? '#1E2430' : '#EAECE6' }]}>
        <View style={styles.pulseDot} />
        <Text style={[styles.freshnessText, { color: theme.textSecondary }]}>
          Verified Data Feeds · MFAPI Live · Tapetide EOD · RBI Retail Direct
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    paddingRight: 2,
    paddingVertical: 4,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 20,
    fontFamily: 'System',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  betaTag: {
    backgroundColor: 'rgba(103, 80, 216, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  betaTagText: {
    color: '#6750D8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  currencyPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    marginTop: 6,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  freshnessBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16865D',
  },
  freshnessText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
