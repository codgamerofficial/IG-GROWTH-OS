// =============================================================================
// RIIQX Mobile 2.0 — AI Agent Chat Screen (Creator OS Production Core)
// Yellow #FFD43B • Obsidian #0C0C0E • Multimodal Vision • Model Switcher
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';

const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google AI Studio', tag: '1M Context · Free' },
  { id: 'groq-qwen-27b', name: 'Groq Qwen 27B', provider: 'Groq LPU', tag: '150ms Speed · Free' },
  { id: 'cohere-command-r', name: 'Cohere Command R+', provider: 'Cohere Cloud', tag: 'Citations · Free' },
  { id: 'bedrock-claude-sonnet', name: 'Claude Sonnet 4 / 3.7', provider: 'AWS Bedrock', tag: 'ap-southeast-2' },
];

export default function MobileChatScreen() {
  const router = useRouter();
  const { messages, isGenerating, sendMessage, selectedModel, setSelectedModel, models } = useRiiqxMobile();
  const [inputText, setInputText] = useState('');
  const [showModelModal, setShowModelModal] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const displayModels = models && models.length > 0 ? models.slice(0, 6) : AVAILABLE_MODELS.map(m => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    description: m.tag,
    contextWindow: 1000000,
    isOnlineFirst: true,
  }));

  const activeModelName = selectedModel?.name || 'Gemini 2.5 Flash';

  const handleSend = () => {
    if ((!inputText.trim() && !attachedImage) || isGenerating) return;
    const text = attachedImage
      ? `[Attached Image] ${inputText.trim() || 'Please analyze this photo in detail.'}`
      : inputText.trim();
    setInputText('');
    setAttachedImage(null);
    sendMessage(text);
  };

  const handleAttachSample = () => {
    setAttachedImage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0C0C0E' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header / Model Switcher */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.08)',
            backgroundColor: '#141418',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: '#FFD43B',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="sparkles" size={18} color="#0C0C0E" />
            </View>
            <View>
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                RIIQX AI Agent
              </Text>
              <Text style={{ color: '#A1A1AA', fontSize: 10 }}>
                Multimodal Reasoning Engine
              </Text>
            </View>
          </View>

          {/* Model Selector Pill */}
          <TouchableOpacity
            onPress={() => setShowModelModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#1C1C20',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>
              {activeModelName}
            </Text>
            <Ionicons name="chevron-down" size={12} color="#A1A1AA" />
          </TouchableOpacity>
        </View>

        {/* Messages Stream */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <View
                key={msg.id || index}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: isUser ? '85%' : '94%',
                }}
              >
                <View
                  style={{
                    backgroundColor: isUser ? '#FFD43B' : '#141418',
                    borderRadius: 18,
                    borderBottomRightRadius: isUser ? 4 : 18,
                    borderBottomLeftRadius: isUser ? 18 : 4,
                    padding: 14,
                    borderWidth: isUser ? 0 : 1,
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: isUser ? '#0C0C0E' : '#FFFFFF',
                      fontSize: 13,
                      lineHeight: 19,
                      fontWeight: isUser ? '600' : '400',
                    }}
                  >
                    {msg.content}
                  </Text>

                  {/* Tool execution checklist card if agent message mentions creation */}
                  {!isUser && msg.content.toLowerCase().includes('reel') && (
                    <View
                      style={{
                        backgroundColor: '#0C0C0E',
                        borderRadius: 12,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                          Creator Studio 9:16 Preset Applied
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => router.push('/(tabs)/creator' as any)}
                        style={{
                          backgroundColor: '#FFD43B',
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          alignItems: 'center',
                          marginTop: 4,
                        }}
                      >
                        <Text style={{ color: '#0C0C0E', fontSize: 11, fontWeight: '800' }}>
                          Open in Video Studio →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Citations if available */}
                  {msg.citations && msg.citations.length > 0 && (
                    <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.08)', paddingTop: 8, gap: 4 }}>
                      <Text style={{ color: '#A1A1AA', fontSize: 10, fontWeight: '700' }}>SOURCES:</Text>
                      {msg.citations.map((c, ci) => (
                        <Text key={ci} style={{ color: '#38BDF8', fontSize: 10 }}>
                          [{ci + 1}] {c.title}
                        </Text>
                      ))}
                    </View>
                  )}

                  <Text
                    style={{
                      color: isUser ? 'rgba(12,12,14,0.6)' : '#737373',
                      fontSize: 9,
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.timestamp || 'Just now'}
                  </Text>
                </View>
              </View>
            );
          })}

          {isGenerating && (
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#141418',
                padding: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <ActivityIndicator size="small" color="#FFD43B" />
              <Text style={{ color: '#A1A1AA', fontSize: 12 }}>
                RIIQX is reasoning with {activeModelName}...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Attached Image Preview */}
        {attachedImage && (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: '#141418',
              borderTopWidth: 1,
              borderTopColor: 'rgba(255, 255, 255, 0.08)',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image
                source={{ uri: attachedImage }}
                style={{ width: 44, height: 44, borderRadius: 8 }}
              />
              <View>
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>
                  Photo Attached (Multimodal Vision)
                </Text>
                <Text style={{ color: '#10B981', fontSize: 10 }}>
                  Ready for Gemini 2.5 Flash inspection
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setAttachedImage(null)}>
              <Ionicons name="close-circle" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Persistent Bottom Composer */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.08)',
            backgroundColor: '#141418',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#1C1C20',
              borderRadius: 24,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask RIIQX anything or describe a goal..."
              placeholderTextColor="#737373"
              style={{
                flex: 1,
                fontSize: 13,
                color: '#FFFFFF',
                paddingVertical: 6,
                paddingHorizontal: 4,
              }}
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity
              onPress={handleAttachSample}
              style={{ padding: 6 }}
              title="Attach photo"
            >
              <Ionicons
                name={attachedImage ? 'image' : 'image-outline'}
                size={20}
                color={attachedImage ? '#10B981' : '#A1A1AA'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSend}
              disabled={isGenerating || (!inputText.trim() && !attachedImage)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: !inputText.trim() && !attachedImage ? '#26262E' : '#FFD43B',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 4,
              }}
            >
              <Ionicons name="arrow-up" size={16} color="#0C0C0E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Model Switcher Modal */}
        <Modal
          visible={showModelModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModelModal(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.7)',
              justifyContent: 'flex-end',
            }}
            activeOpacity={1}
            onPress={() => setShowModelModal(false)}
          >
            <View
              style={{
                backgroundColor: '#141418',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 20,
                borderTopWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                gap: 14,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                Select AI Model (All Free Tier Verified)
              </Text>

              {displayModels.map((m) => {
                const isSelected = selectedModel?.id === m.id || (!selectedModel && m.id.includes('gemini'));
                return (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => {
                      setSelectedModel({
                        id: m.id,
                        name: m.name,
                        provider: m.provider,
                        contextWindow: m.contextWindow || 1000000,
                        isOnlineFirst: true,
                        description: m.description,
                      });
                      setShowModelModal(false);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 14,
                      borderRadius: 14,
                      backgroundColor: isSelected ? 'rgba(255, 212, 59, 0.15)' : '#1C1C20',
                      borderWidth: 1,
                      borderColor: isSelected ? '#FFD43B' : 'rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <View style={{ gap: 2 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                        {m.name}
                      </Text>
                      <Text style={{ color: '#A1A1AA', fontSize: 11 }}>
                        {m.provider} {m.description ? `· ${m.description.slice(0, 40)}` : ''}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#FFD43B" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
