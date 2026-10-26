// =============================================================================
// RIIQX Mobile 2.0 — AI Agent Chat Screen (Matching Image 2 Screen 3)
// Model Switcher • Step-by-Step Tool Execution Checklist • Video Result Card
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';
import { colors } from '../../src/theme/colors';

export default function MobileChatScreen() {
  const router = useRouter();
  const { messages, isGenerating, sendMessage, selectedModel } = useRiiqxMobile();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    const text = inputText;
    setInputText('');
    sendMessage(text);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header / Model Switcher (Matching Image 2 Screen 3) */}
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
              <Ionicons name="flash" size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '800' }}>
                RIIQX AI Agent
              </Text>
            </View>
          </View>

          {/* Model Selector Pill */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: colors.bgSubtle,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.emerald }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary }}>
              Llama 3.3 70B
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.textMuted} />
          </View>
        </View>

        {/* Messages Stream */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* User Message (Matching Image 2 Screen 3) */}
          <View style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
            <View
              style={{
                backgroundColor: colors.violetSubtle,
                borderRadius: 20,
                borderBottomRightRadius: 4,
                padding: 14,
              }}
            >
              <Text style={{ color: colors.violet, fontSize: 14, fontWeight: '600' }}>
                Create a trending Instagram reel from my travel photos with cinematic style.
              </Text>
            </View>
          </View>

          {/* AI Agent Response with Tool Checklist (Matching Image 2 Screen 3) */}
          <View style={{ alignSelf: 'flex-start', maxWidth: '92%', gap: 12 }}>
            {/* Analyzing text */}
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '600' }}>
              Analyzing your media...
            </Text>

            {/* Media thumbnail strip with checkmark badges */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[
                'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80',
              ].map((img, i) => (
                <View key={i} style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                  <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
                  <View
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: colors.emerald,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                </View>
              ))}
            </View>

            {/* Step-by-Step Tool Execution Checklist */}
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                gap: 8,
              }}
            >
              {[
                'Detected 12 photos',
                'Generating storyline',
                'Creating captions',
                'Preparing video...',
              ].map((step, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.emerald} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textPrimary }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            {/* Reel Ready Output Card (Matching Image 2 Screen 3) */}
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 22,
                padding: 14,
                borderWidth: 1,
                borderColor: colors.cardBorder,
                gap: 12,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary }}>
                Your reel is ready! 🎉
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                A cinematic travel reel with trending music, captions, and seamless transitions.
              </Text>

              {/* Video Preview Card */}
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/studio' as any)}
                activeOpacity={0.85}
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 16,
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="play" size={20} color="#0F172A" style={{ marginLeft: 2 }} />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>00:28</Text>
                </View>
              </TouchableOpacity>

              {/* Suggested Caption */}
              <View
                style={{
                  backgroundColor: colors.bgSubtle,
                  padding: 10,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textPrimary }}>
                  Suggested caption:
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                  Lost in beautiful places 🌄 #travel #explore #adventure #india #mountains #wanderlust
                </Text>
              </View>

              {/* Action Buttons: Edit in Studio & Export Video */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/studio' as any)}
                  style={{
                    flex: 1,
                    backgroundColor: colors.violetSubtle,
                    paddingVertical: 10,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 6,
                  }}
                >
                  <Ionicons name="create-outline" size={16} color={colors.violet} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: colors.violet }}>
                    Edit in Studio
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/studio' as any)}
                  style={{
                    flex: 1,
                    backgroundColor: colors.violet,
                    paddingVertical: 10,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: 6,
                  }}
                >
                  <Ionicons name="download-outline" size={16} color="#FFFFFF" />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#FFFFFF' }}>
                    Export Video
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Persistent Bottom Composer (Matching Image 2 Screen 3) */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
            backgroundColor: colors.surface,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.bgSubtle,
              borderRadius: 24,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask RIIQX anything..."
              placeholderTextColor={colors.textMuted}
              style={{
                flex: 1,
                fontSize: 13,
                color: colors.textPrimary,
                paddingVertical: 6,
                paddingHorizontal: 4,
              }}
            />
            <TouchableOpacity style={{ padding: 6 }}>
              <Ionicons name="mic-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 6 }}>
              <Ionicons name="attach-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSend}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.textPrimary,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 4,
              }}
            >
              <Ionicons name="arrow-up" size={16} color={colors.bg} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
