// =============================================================================
// RIIQX Mobile — AI Chat Screen
// Online-First AWS Bedrock & Claude Sonnet • Real Citations
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';
import { colors } from '../../src/theme/colors';

export default function ChatScreen() {
  const { messages, isGenerating, sendMessage, selectedModel } = useRiiqxMobile();
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    const text = inputText;
    setInputText('');
    sendMessage(text);
  };

  const quickPrompts = [
    'Synthesize an Instagram Reel hook for AI productivity',
    'Explain RIIQX Level 3 Autopilot architecture',
    'Write a TypeScript function for PBKDF2 hashing',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header */}
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
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 }}>
                RIIQX
              </Text>
              <View
                style={{
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  borderColor: 'rgba(6, 182, 212, 0.4)',
                  borderWidth: 1,
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: colors.cyan, fontSize: 10, fontWeight: '700' }}>ONLINE</Text>
              </View>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 2 }}>
              {selectedModel?.name || 'AWS Bedrock Claude Sonnet 4 / 3.7'}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.cardBorder,
              gap: 4,
            }}
          >
            <Ionicons name="hardware-chip-outline" size={12} color={colors.cyan} />
            <Text style={{ color: colors.textSecondary, fontSize: 10 }}>ap-southeast-2</Text>
          </View>
        </View>

        {/* Messages List */}
        <ScrollView
          style={{ flex: 1, padding: 16 }}
          contentContainerStyle={{ paddingBottom: 24, gap: 14 }}
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <View
                key={msg.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  backgroundColor: isUser ? colors.cyan : colors.surface,
                  borderRadius: 16,
                  borderBottomRightRadius: isUser ? 4 : 16,
                  borderBottomLeftRadius: isUser ? 16 : 4,
                  padding: 12,
                  borderWidth: isUser ? 0 : 1,
                  borderColor: colors.cardBorder,
                }}
              >
                <Text
                  style={{
                    color: isUser ? '#030712' : colors.textPrimary,
                    fontSize: 14,
                    lineHeight: 20,
                    fontWeight: isUser ? '500' : '400',
                  }}
                >
                  {msg.content}
                </Text>

                {msg.citations && msg.citations.length > 0 && (
                  <View
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: colors.cardBorder,
                      gap: 4,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="globe-outline" size={11} color={colors.cyan} />
                      <Text style={{ color: colors.cyan, fontSize: 10, fontWeight: '700' }}>
                        VERIFIED SOURCES
                      </Text>
                    </View>
                    {msg.citations.map((c, idx) => (
                      <Text key={idx} style={{ color: colors.textSecondary, fontSize: 10 }} numberOfLines={1}>
                        [{idx + 1}] {c.title}
                      </Text>
                    ))}
                  </View>
                )}

                <Text
                  style={{
                    color: isUser ? '#072730' : colors.textMuted,
                    fontSize: 10,
                    alignSelf: 'flex-end',
                    marginTop: 4,
                  }}
                >
                  {msg.timestamp}
                </Text>
              </View>
            );
          })}

          {isGenerating && (
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: colors.cardBorder,
              }}
            >
              <ActivityIndicator size="small" color={colors.cyan} />
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                RIIQX engine thinking...
              </Text>
            </View>
          )}

          {/* Quick Prompts when only 1 message exists */}
          {messages.length === 1 && (
            <View style={{ marginTop: 12, gap: 8 }}>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700' }}>
                SUGGESTED STARTERS
              </Text>
              {quickPrompts.map((prompt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => sendMessage(prompt)}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Ionicons name="sparkles" size={14} color={colors.cyan} />
                  <Text style={{ color: colors.textPrimary, fontSize: 12, flex: 1 }}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View
          style={{
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: colors.cardBorder,
            backgroundColor: colors.surface,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask RIIQX or execute a task..."
            placeholderTextColor={colors.textMuted}
            multiline
            style={{
              flex: 1,
              backgroundColor: colors.bg,
              color: colors.textPrimary,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 14,
              maxHeight: 100,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            }}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim() || isGenerating}
            style={{
              backgroundColor: inputText.trim() && !isGenerating ? colors.cyan : colors.card,
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() && !isGenerating ? '#030712' : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
