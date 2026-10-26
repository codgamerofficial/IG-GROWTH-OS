// =============================================================================
// RIIQX Mobile 2.0 — AI Video Editor Screen (Matching Image 2 Screen 5)
// Mobile Multitrack Timeline • Real Preview Scrubber • Bottom Toolbar • Export
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function MobileVideoEditorScreen() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState('Explore More');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      Alert.alert('Export Successful!', 'Your 30 FPS MP4 video has been rendered and saved to your device gallery.');
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top Header (Matching Image 2 Screen 5) */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.cardBorder,
          backgroundColor: colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.textPrimary }}>
            AI Video Editor
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleExport}
          disabled={isExporting}
          style={{
            backgroundColor: colors.violet,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 16,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
            {isExporting ? 'Exporting...' : '+ Export'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Video Preview Card (Matching Image 2 Screen 5) */}
        <View
          style={{
            width: '100%',
            height: 280,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: '#000',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.cardBorder,
          }}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
            }}
            style={{ width: '100%', height: '100%' }}
          />

          {/* Kinetic Caption Overlay */}
          <View style={{ position: 'absolute', top: 70, alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: '900',
                color: '#FFFFFF',
                fontStyle: 'italic',
                textShadowColor: 'rgba(0,0,0,0.8)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
              }}
            >
              {subtitle}
            </Text>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                marginTop: 4,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 2 }}>
                TRAVEL SERIES
              </Text>
            </View>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'rgba(255,255,255,0.85)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="#0F172A"
              style={{ marginLeft: isPlaying ? 0 : 2 }}
            />
          </TouchableOpacity>

          {/* Timecode Scrubber Bar */}
          <View
            style={{
              position: 'absolute',
              bottom: 12,
              left: 16,
              right: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>00:08 / 00:28</Text>
            <Ionicons name="expand-outline" size={16} color="#FFFFFF" />
          </View>
        </View>

        {/* Timeline Tracks Section (Matching Image 2 Screen 5) */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 12,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            gap: 10,
            marginBottom: 20,
          }}
        >
          {/* Track 1: Video Thumbnails */}
          <View style={{ flexDirection: 'row', height: 44, borderRadius: 10, overflow: 'hidden', gap: 2 }}>
            {[
              'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80',
            ].map((img, i) => (
              <Image key={i} source={{ uri: img }} style={{ flex: 1, height: '100%' }} />
            ))}
          </View>

          {/* Track 2: Subtitle Pill (Purple) */}
          <View
            style={{
              backgroundColor: colors.violet,
              borderRadius: 10,
              paddingVertical: 8,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              width: '65%',
            }}
          >
            <Ionicons name="text" size={14} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
              T Explore More
            </Text>
          </View>

          {/* Track 3: Audio Waveform Pill (Green) */}
          <View
            style={{
              backgroundColor: colors.emerald,
              borderRadius: 10,
              paddingVertical: 8,
              paddingHorizontal: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              width: '80%',
            }}
          >
            <Ionicons name="mic" size={14} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Voiceover</Text>
          </View>
        </View>

        {/* Bottom Toolbar Icons (Matching Image 2 Screen 5: Media, Text, Audio, Subtitles, Effects, AI Tools) */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: 20,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            justifyContent: 'space-around',
          }}
        >
          {[
            { label: 'Media', icon: 'images-outline' },
            { label: 'Text', icon: 'text-outline' },
            { label: 'Audio', icon: 'musical-notes-outline' },
            { label: 'Subtitles', icon: 'chatbox-ellipses-outline' },
            { label: 'Effects', icon: 'color-wand-outline' },
            { label: 'AI Tools', icon: 'sparkles' },
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={{ alignItems: 'center', gap: 4 }}>
              <Ionicons name={item.icon as any} size={18} color={colors.textSecondary} />
              <Text style={{ fontSize: 9, fontWeight: '600', color: colors.textMuted }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
