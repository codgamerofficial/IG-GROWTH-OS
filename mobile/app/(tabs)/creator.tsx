// =============================================================================
// RIIQX Mobile 2.0 — Creator Studio (Upload & AI Presets)
// Matching Reference Image 2 Screen 4 & Screen 14
// Multi-File Selection • 10 Creation Presets • Aspect Ratio Selector • 1-Tap CTA
// =============================================================================

import React, { useState } from 'react';
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

export default function MobileCreatorScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Create' | 'Templates' | 'Trending'>('Create');
  const [selectedStyle, setSelectedStyle] = useState('Trending');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [selectedFilesCount, setSelectedFilesCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const stylePresets = [
    { id: 'Trending', label: 'Trending', sub: 'Viral Hooks', icon: 'flame', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
    { id: 'Cinematic', label: 'Cinematic', sub: 'Film Look', icon: 'film', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop&q=80' },
    { id: 'Travel', label: 'Travel', sub: 'Vlogs', icon: 'airplane', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80' },
    { id: 'Product', label: 'Product', sub: 'Showcase', icon: 'cart', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80' },
    { id: 'Educational', label: 'Educational', sub: 'Explain', icon: 'bulb', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80' },
    { id: 'Storytelling', label: 'Storytelling', sub: 'Emotional', icon: 'heart', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80' },
  ];

  const handleCreateReel = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      router.push('/(tabs)/studio' as any);
    }, 800);
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
                backgroundColor: colors.violet,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="videocam" size={16} color="#FFFFFF" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '900', color: colors.textPrimary }}>
              Creator Studio
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/settings' as any)}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </TouchableOpacity>
        </View>

        {/* Subtabs: Create, Templates, Trending (Matching Image 2 Screen 4) */}
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
                backgroundColor: activeTab === tab ? colors.violet : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: activeTab === tab ? '#FFFFFF' : colors.textMuted,
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upload Photos or Videos Box (Matching Image 2 Screen 4) */}
        <TouchableOpacity
          onPress={() => setSelectedFilesCount((prev) => (prev >= 6 ? 3 : prev + 1))}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: colors.pinkLight,
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
              backgroundColor: colors.pinkSubtle,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons name="cloud-upload" size={26} color={colors.pink} />
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

        {/* AI Magic Style Presets (Matching Image 2 Screen 4) */}
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
                    borderColor: isSelected ? colors.violet : colors.cardBorder,
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
                          backgroundColor: colors.violet,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
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

        {/* Aspect Ratio Selector (Matching Image 2 Screen 4) */}
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
                    backgroundColor: isSelected ? colors.violetSubtle : colors.surface,
                    borderWidth: 1.5,
                    borderColor: isSelected ? colors.violet : colors.cardBorder,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '800',
                      color: isSelected ? colors.violet : colors.textPrimary,
                    }}
                  >
                    {ratio.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: '600',
                      color: isSelected ? colors.violet : colors.textMuted,
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

        {/* Big Prominent Gradient Button (Matching Image 2 Screen 4: "Create My Reel >") */}
        <TouchableOpacity
          onPress={handleCreateReel}
          disabled={isGenerating}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.violet,
            borderRadius: 24,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.violet,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 }}>
            {isGenerating ? 'Analyzing & Synthesizing...' : 'Create My Reel >'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
