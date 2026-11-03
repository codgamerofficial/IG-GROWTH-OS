// =============================================================================
// RIIQX Mobile 2.0 — Creator Studio (Upload, AI Presets, Templates & Trends)
// Matching Reference Image 2 Screen 4 & Screen 14
// Multi-File Selection • 6 Creation Presets • Aspect Ratio Selector • 1-Tap CTA
// Shared Backend Integration with Next.js • Obsidian Dark + #FFD43B Theme
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/services/api';
import { colors } from '../../src/theme/colors';

export default function MobileCreatorScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Create' | 'Templates' | 'Trending'>('Create');
  const [selectedStyle, setSelectedStyle] = useState('viral_social');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [selectedFilesCount, setSelectedFilesCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const stylePresets = [
    { id: 'viral_social', label: 'Viral Social', sub: 'Kinetic Hooks', icon: 'flame', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
    { id: 'cinematic_storytelling', label: 'Cinematic', sub: 'Film Look', icon: 'film', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop&q=80' },
    { id: 'hypermotion', label: 'Hypermotion', sub: 'Speed Ramps', icon: 'flash', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&auto=format&fit=crop&q=80' },
    { id: 'premium_commercial', label: 'Commercial', sub: 'Luxe Grade', icon: 'sparkles', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80' },
    { id: 'motion_graphics', label: 'Motion FX', sub: 'Kinetic UI', icon: 'color-wand', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop&q=80' },
    { id: 'documentary', label: 'Documentary', sub: 'Fact Focus', icon: 'book', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80' },
  ];

  const templatesList = [
    {
      id: 'tmpl_trending_reels',
      name: 'Trending Reels',
      category: 'Reels',
      desc: 'High-energy kinetic cuts, bold captions & viral audio hook.',
      duration: '30s',
      cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'tmpl_motivation',
      name: 'Motivation & Mindset',
      category: 'Motivation',
      desc: 'Atmospheric slow-motion, deep reflective pacing & breakthrough hook.',
      duration: '30s',
      cover: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'tmpl_travel_vlog',
      name: 'Travel & Aesthetic Vlog',
      category: 'Travel',
      desc: 'Speed-ramped transitions, aesthetic vistas & wanderlust typography.',
      duration: '30s',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'tmpl_finance_tips',
      name: 'Finance Tips & Wealth',
      category: 'Business',
      desc: 'Clean financial frameworks, compounding charts & authority pacing.',
      duration: '30s',
      cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'tmpl_tech_breakdown',
      name: 'Tech & AI Breakdown',
      category: 'Developer',
      desc: 'Developer tools, command line demo clips & sharp technical insights.',
      duration: '45s',
      cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'tmpl_product_showcase',
      name: 'Product Showcase Luxe',
      category: 'Commercial',
      desc: 'Studio lighting, focal feature callouts & frictionless conversion CTA.',
      duration: '20s',
      cover: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const trendingTopics = [
    {
      id: 'trend_01',
      title: 'Online-First Cloud Intelligence vs Local Model Bottlenecks',
      niche: 'Tech & AI',
      score: 96,
      hook: 'Stop trying to run 70B models locally when cloud APIs are 10x faster and cheaper.',
    },
    {
      id: 'trend_02',
      title: '3 Prompt Hacks That 10x Claude Sonnet Output',
      niche: 'Productivity',
      score: 92,
      hook: 'Most people prompt AI like Google search. Here are 3 structural rules that actually work.',
    },
    {
      id: 'trend_03',
      title: 'Why Bedrock Cloud + Local Edge AI is the Winning Hybrid in 2026',
      niche: 'AI Engineering',
      score: 89,
      hook: 'Edge handles latency, cloud handles reasoning. Here is the architecture winning this year.',
    },
    {
      id: 'trend_04',
      title: 'DeepSeek R1 vs Claude 3.7 Sonnet: The Ultimate Reasoning Benchmark',
      niche: 'Developer Tools',
      score: 95,
      hook: 'We ran 100 complex coding benchmarks on both reasoning models. The winner shocked us.',
    },
  ];

  const handleCreateReel = async () => {
    setIsGenerating(true);
    try {
      await api.generateStoryboard({
        topic: `${selectedStyle.replace('_', ' ').toUpperCase()} Content Reel`,
        niche: selectedStyle,
        platform: aspectRatio === '9:16' ? 'instagram_reels' : 'youtube_shorts',
        durationSeconds: 30,
      });
      router.push('/(tabs)/studio' as any);
    } catch {
      router.push('/(tabs)/studio' as any);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = async (templateName: string, category: string) => {
    setIsGenerating(true);
    try {
      await api.generateStoryboard({
        topic: `${templateName} Content Reel`,
        niche: category,
        platform: 'both',
        durationSeconds: 30,
      });
      router.push('/(tabs)/studio' as any);
    } catch {
      router.push('/(tabs)/studio' as any);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTrend = async (trendTopic: string, niche: string) => {
    setIsGenerating(true);
    try {
      await api.generateStoryboard({
        topic: trendTopic,
        niche,
        platform: 'both',
        durationSeconds: 30,
      });
      router.push('/(tabs)/studio' as any);
    } catch {
      router.push('/(tabs)/studio' as any);
    } finally {
      setIsGenerating(false);
    }
  };

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
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="videocam" size={16} color="#0C0C0E" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '900', color: colors.textPrimary }}>
              Creator Studio
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/(tabs)/settings' as any)}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </TouchableOpacity>
        </View>

        {/* Subtabs: Create, Templates, Trending */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 4,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}
        >
          {(['Create', 'Templates', 'Trending'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: activeTab === tab ? colors.primary : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: activeTab === tab ? '#0C0C0E' : colors.textMuted,
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: CREATE VIEW */}
        {activeTab === 'Create' && (
          <>
            {/* Upload Photos or Videos Box */}
            <TouchableOpacity
              onPress={() => setSelectedFilesCount((prev) => (prev >= 6 ? 3 : prev + 1))}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 24,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: colors.primary,
                paddingVertical: 28,
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: colors.primarySubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons name="cloud-upload" size={26} color={colors.primary} />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '800', color: colors.textPrimary }}>
                Upload Photos or Videos
              </Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
                Tap to select or take new photos
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                Supports MP4, MOV, JPG, PNG, WebP
              </Text>

              <View
                style={{
                  marginTop: 14,
                  backgroundColor: colors.textPrimary,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: colors.bg, fontSize: 11, fontWeight: '800' }}>
                  {selectedFilesCount} Files Selected
                </Text>
              </View>
            </TouchableOpacity>

            {/* AI Magic Style Presets */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 }}>
                AI Magic Style
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {stylePresets.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <TouchableOpacity
                      key={style.id}
                      onPress={() => setSelectedStyle(style.id)}
                      activeOpacity={0.85}
                      style={{
                        width: '31%',
                        backgroundColor: colors.surface,
                        borderRadius: 18,
                        overflow: 'hidden',
                        borderWidth: 2,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                      }}
                    >
                      <View style={{ width: '100%', height: 75, backgroundColor: '#000' }}>
                        <Image source={{ uri: style.img }} style={{ width: '100%', height: '100%' }} />
                        {isSelected && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 6,
                              width: 18,
                              height: 18,
                              borderRadius: 9,
                              backgroundColor: colors.primary,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Ionicons name="checkmark" size={12} color="#0C0C0E" />
                          </View>
                        )}
                      </View>
                      <View style={{ padding: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: colors.textPrimary }}>
                          {style.label}
                        </Text>
                        <Text style={{ fontSize: 9, color: colors.textMuted }}>{style.sub}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Aspect Ratio Selector */}
            <View style={{ marginBottom: 28 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 }}>
                Aspect Ratio
              </Text>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { id: '9:16' as const, label: '9:16', sub: 'Reels/Shorts' },
                  { id: '1:1' as const, label: '1:1', sub: 'Square' },
                  { id: '16:9' as const, label: '16:9', sub: 'Landscape' },
                ].map((ratio) => {
                  const isSelected = aspectRatio === ratio.id;
                  return (
                    <TouchableOpacity
                      key={ratio.id}
                      onPress={() => setAspectRatio(ratio.id)}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 16,
                        backgroundColor: isSelected ? colors.primarySubtle : colors.surface,
                        borderWidth: 1.5,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '800',
                          color: isSelected ? colors.primary : colors.textPrimary,
                        }}
                      >
                        {ratio.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: '600',
                          color: isSelected ? colors.primary : colors.textMuted,
                          marginTop: 2,
                        }}
                      >
                        {ratio.sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Big Prominent Button: Create My Reel > */}
            <TouchableOpacity
              onPress={handleCreateReel}
              disabled={isGenerating}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 24,
                paddingVertical: 16,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              {isGenerating ? (
                <ActivityIndicator color="#0C0C0E" size="small" />
              ) : (
                <Text style={{ color: '#0C0C0E', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 }}>
                  Create My Reel &gt;
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* TAB 2: TEMPLATES VIEW */}
        {activeTab === 'Templates' && (
          <View style={{ gap: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>
              Creator Template Vault
            </Text>
            {templatesList.map((tmpl) => (
              <View
                key={tmpl.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  overflow: 'hidden',
                  flexDirection: 'row',
                }}
              >
                <Image
                  source={{ uri: tmpl.cover }}
                  style={{ width: 100, height: '100%', minHeight: 110 }}
                />
                <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary }}>
                        {tmpl.name}
                      </Text>
                      <View
                        style={{
                          backgroundColor: colors.primarySubtle,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: '800', color: colors.primary }}>
                          {tmpl.duration}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }} numberOfLines={2}>
                      {tmpl.desc}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleApplyTemplate(tmpl.name, tmpl.category)}
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: colors.primary,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      marginTop: 8,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#0C0C0E' }}>
                      Use Template &gt;
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: TRENDING VIEW */}
        {activeTab === 'Trending' && (
          <View style={{ gap: 14 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>
              Viral Trends &amp; Research Radar
            </Text>
            {trendingTopics.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                  padding: 14,
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '800', color: '#38BDF8' }}>
                      {item.niche}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="flame" size={14} color={colors.primary} />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: colors.primary }}>
                      {item.score} Score
                    </Text>
                  </View>
                </View>

                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary }}>
                  {item.title}
                </Text>

                <View
                  style={{
                    backgroundColor: colors.bg,
                    borderRadius: 12,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <Text style={{ fontSize: 11, fontStyle: 'italic', color: colors.textMuted }}>
                    &ldquo;{item.hook}&rdquo;
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleUseTrend(item.title, item.niche)}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: colors.primary,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 12,
                    marginTop: 4,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#0C0C0E' }}>
                    Turn into Reel &gt;
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
