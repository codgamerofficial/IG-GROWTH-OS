// =============================================================================
// RIIQX Mobile 2.0 — Apps & Modules Hub
// Direct 1-Tap Access to all 11 Original RIIQX Native Modules
// Deep Obsidian Aesthetic • Obsidian #0C0C0E • Yellow #FFD43B
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MobileAppsScreen() {
  const router = useRouter();

  const allModules = [
    {
      title: 'Task Planner DAG',
      desc: 'Goal decomposition into automated sequential steps',
      icon: 'checkbox',
      color: '#FFD43B',
      route: '/(tabs)/tasks',
    },
    {
      title: 'Deep Research',
      desc: 'Fact-verified source citations & web intelligence',
      icon: 'search',
      color: '#38BDF8',
      route: '/(tabs)/research',
    },
    {
      title: 'Code Studio',
      desc: 'Multi-file editor, AST analysis & AI synthesis',
      icon: 'code-slash',
      color: '#A855F7',
      route: '/(tabs)/code',
    },
    {
      title: 'Tools & Integrations',
      desc: 'YouTube v3, Meta Instagram v26.0 & GitHub',
      icon: 'git-network',
      color: '#EC4899',
      route: '/(tabs)/integrations',
    },
    {
      title: 'Analytics & Growth',
      desc: 'Social intelligence OS, reach & retention metrics',
      icon: 'bar-chart',
      color: '#10B981',
      route: '/(tabs)/analytics',
    },
    {
      title: 'Asset Library',
      desc: 'Raw footage, rendered 9:16 reels & scripts',
      icon: 'folder-open',
      color: '#F59E0B',
      route: '/(tabs)/library',
    },
    {
      title: 'AI Video Editor',
      desc: 'Multi-track canvas & kinetic text generator',
      icon: 'color-wand',
      color: '#FF6B5E',
      route: '/(tabs)/studio',
    },
    {
      title: 'Settings & Governance',
      desc: 'Supabase session, gateway health & cloud runtimes',
      icon: 'settings',
      color: '#A3A3A3',
      route: '/(tabs)/settings',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.badgeText}>RIIQX ECOSYSTEM</Text>
          <Text style={styles.titleText}>Modules &amp; Workflows</Text>
          <Text style={styles.subtitleText}>
            Direct access to all 11 native production modules.
          </Text>
        </View>

        {/* Module Cards List */}
        <View style={styles.cardsList}>
          {allModules.map((mod, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => router.push(mod.route as any)}
              activeOpacity={0.8}
              style={styles.moduleCard}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${mod.color}15` }]}>
                  <Ionicons name={mod.icon as any} size={22} color={mod.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.moduleTitle}>{mod.title}</Text>
                  <Text style={styles.moduleDesc}>{mod.desc}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#737373" />
            </TouchableOpacity>
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
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD43B',
    letterSpacing: 1,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: 11.5,
    color: '#A3A3A3',
    marginTop: 3,
  },
  cardsList: {
    gap: 10,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#141416',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  moduleDesc: {
    fontSize: 11,
    color: '#737373',
    marginTop: 2,
  },
});
