// =============================================================================
// RIIQX Mobile 2.0 — Home Dashboard (Matching Reference Image 2 Screen 2)
// Clean Contemporary Light Aesthetic • Quick Actions Grid • Recent Projects
// =============================================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function MobileHomeScreen() {
  const router = useRouter();

  const recentProjects = [
    {
      id: 'p1',
      title: 'Travel Reel',
      time: '2h ago',
      thumb: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      title: 'Product Promo',
      time: '5h ago',
      thumb: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'p3',
      title: 'Fitness Reel',
      time: 'Yesterday',
      thumb: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: colors.violet,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="flash" size={18} color="#FFFFFF" />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '900',
                letterSpacing: 0.5,
                color: colors.textPrimary,
              }}
            >
              RIIQX
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="search" size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/settings' as any)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: colors.violetSubtle,
              }}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Greeting (Matching Image 2 Screen 2) */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 14, color: colors.textMuted, fontWeight: '600', marginBottom: 4 }}>
            Good Morning 👋
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: '900',
              color: colors.textPrimary,
              lineHeight: 32,
            }}
          >
            What will RIIQX{'\n'}do for you today?
          </Text>
        </View>

        {/* 4 Primary Action Cards Grid (Matching Image 2 Screen 2) */}
        <View style={{ gap: 12, marginBottom: 28 }}>
          {/* Card 1: AI Chat (Dark Obsidian Card with Arrow) */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/chat' as any)}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#0F172A',
              borderRadius: 24,
              padding: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="chatbubbles" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>AI Chat</Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Think. Plan. Do.</Text>
              </View>
            </View>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Row of 3 Cards: Create Reel, Autopilot, Deep Research */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Create Reel (Pink) */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/creator' as any)}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: colors.pinkSubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="videocam" size={20} color={colors.pink} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>
                Create Reel
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                Viral video
              </Text>
            </TouchableOpacity>

            {/* Autopilot (Emerald) */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/autopilot' as any)}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: colors.emeraldSubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="sync" size={20} color={colors.emerald} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>
                Autopilot
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                Hands-free
              </Text>
            </TouchableOpacity>

            {/* Deep Research (Indigo/Violet) */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/apps' as any)}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: colors.violetSubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="search" size={20} color={colors.violet} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: colors.textPrimary }}>
                Research
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                Real sources
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Projects Horizontal Strip (Matching Image 2 Screen 2) */}
        <View style={{ marginBottom: 28 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.textPrimary }}>
              Recent Projects
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/creator' as any)}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.violet }}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {recentProjects.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => router.push('/(tabs)/studio' as any)}
                  activeOpacity={0.85}
                  style={{
                    width: 120,
                    backgroundColor: colors.surface,
                    borderRadius: 18,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <View style={{ width: '100%', height: 150, backgroundColor: '#000', position: 'relative' }}>
                    <Image source={{ uri: p.thumb }} style={{ width: '100%', height: '100%' }} />
                    <View
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>9:16</Text>
                    </View>
                  </View>
                  <View style={{ padding: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }} numberOfLines={1}>
                      {p.title}
                    </Text>
                    <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>{p.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Today's Tasks Section */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 14 }}>
            Today's Tasks
          </Text>

          <View style={{ backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 14 }}>
            {[
              { title: 'Create 3 viral reels', status: '80%', done: false },
              { title: 'Research trending topics', status: 'Done', done: true },
              { title: 'Edit product video', status: '60%', done: false },
            ].map((task, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Ionicons
                    name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={task.done ? colors.emerald : colors.violet}
                  />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }}>
                    {task.title}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: task.done ? colors.emeraldSubtle : colors.violetSubtle,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '800',
                      color: task.done ? colors.emerald : colors.violet,
                    }}
                  >
                    {task.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
