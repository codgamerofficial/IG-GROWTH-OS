// =============================================================================
// RIIQX Mobile — Creator Studio Screen
// 9:16 Vertical Storyboards • Viral Hooks • Multi-Language (EN, BN, HI)
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../src/services/api';
import { colors } from '../../src/theme/colors';

export default function CreatorScreen() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'english' | 'bengali' | 'hindi'>('english');
  const [duration, setDuration] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [storyboard, setStoryboard] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const result = await api.generateStoryboard({
        topic: topic.trim(),
        language,
        targetDuration: duration,
      });
      setStoryboard(result.project || result);
    } catch {
      // Handled in api fallback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="videocam-outline" size={20} color={colors.cyan} />
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>
              Creator Studio
            </Text>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
            Generate viral 9:16 vertical storyboards, hooks &amp; voiceover scripts.
          </Text>
        </View>

        {/* Input Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            gap: 12,
          }}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '700' }}>
            CONTENT TOPIC OR BRIEF
          </Text>
          <TextInput
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g. 3 AI tools that will save you 20 hours a week"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.bg,
              color: colors.textPrimary,
              borderRadius: 12,
              padding: 12,
              fontSize: 13,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          />

          {/* Language Selection */}
          <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: '700', marginTop: 4 }}>
            SCRIPT LANGUAGE
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['english', 'bengali', 'hindi'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: language === lang ? colors.cyan : colors.cardBorder,
                  backgroundColor: language === lang ? 'rgba(6, 182, 212, 0.15)' : colors.bg,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: language === lang ? colors.cyan : colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Duration Selection */}
          <Text style={{ color: colors.textPrimary, fontSize: 11, fontWeight: '700', marginTop: 4 }}>
            TARGET DURATION
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[15, 30, 60].map((dur) => (
              <TouchableOpacity
                key={dur}
                onPress={() => setDuration(dur)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: duration === dur ? colors.violet : colors.cardBorder,
                  backgroundColor: duration === dur ? 'rgba(139, 92, 246, 0.15)' : colors.bg,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: duration === dur ? colors.violet : colors.textSecondary,
                    fontSize: 11,
                    fontWeight: '600',
                  }}
                >
                  {dur}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={!topic.trim() || isLoading}
            style={{
              backgroundColor: topic.trim() && !isLoading ? colors.cyan : colors.card,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              marginTop: 6,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#030712" />
            ) : (
              <>
                <Ionicons
                  name="sparkles"
                  size={16}
                  color={topic.trim() ? '#030712' : colors.textMuted}
                />
                <Text
                  style={{
                    color: topic.trim() ? '#030712' : colors.textMuted,
                    fontSize: 13,
                    fontWeight: '700',
                  }}
                >
                  Synthesize Storyboard
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Storyboard Output */}
        {storyboard && (
          <View style={{ marginTop: 20, gap: 12 }}>
            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
                borderWidth: 1,
                borderRadius: 16,
                padding: 16,
              }}
            >
              <Text style={{ color: colors.cyan, fontSize: 11, fontWeight: '700' }}>
                PRIMARY RETENTION HOOK
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontWeight: '600',
                  marginTop: 6,
                  lineHeight: 20,
                }}
              >
                &ldquo;{storyboard.hook || 'Most creators make this fatal mistake in their first 3 seconds...'}&rdquo;
              </Text>
            </View>

            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginTop: 6 }}>
              SCENE-BY-SCENE STORYBOARD (9:16)
            </Text>

            {storyboard.scenes &&
              storyboard.scenes.map((scene: any, idx: number) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                    borderWidth: 1,
                    borderRadius: 14,
                    padding: 14,
                    gap: 6,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: colors.violet, fontSize: 11, fontWeight: '700' }}>
                      SCENE {scene.sceneNumber || idx + 1}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="time-outline" size={11} color={colors.textMuted} />
                      <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                        {scene.durationSeconds || 3}s
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '500' }}>
                    {scene.narration}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontSize: 11, fontStyle: 'italic' }}>
                    Visual: {scene.visualPrompt}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
