// =============================================================================
// PujaHop Kolkata Mobile: Native AI Puja Copilot Screen
// Section 37: Bengali greetings, prompt chips, and tool-backed real-time assistance
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles, User, Bot } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { usePujaHop } from '../../src/hooks/usePujaHop';
import { useHaptics } from '../../src/hooks/useHaptics';
import { api } from '../../src/services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function CopilotScreen() {
  const router = useRouter();
  const { selectedDate } = usePujaHop();
  const haptics = useHaptics();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'নমস্কার! আজ কলকাতায় তোমার পুজোটা কেমন হবে? আমি তোমার পুজোর সব প্রশ্ন, রুট, মেট্রো এবং খাবারের সঠিক তথ্য দিয়ে সাহায্য করব।',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'আজকের সেরা পুজো',
    'আমার Route বানাও',
    'কম ভিড়ের পুজো',
    'Metro দিয়ে কোথায় যাব?',
    'খাবার কোথায় পাব?',
    'বৃষ্টি হলে কী করব?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    haptics.selection();
    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.askCopilot(newMessages, selectedDate);
      setMessages([...newMessages, { role: 'assistant', content: response.message }]);
      haptics.light();
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'কলকাতার পুজো ডেটাবেস থেকে তথ্য লোড করতে সমস্যা হয়েছে। দয়া করে ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করুন।',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              router.back();
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <View style={styles.headerTitleRow}>
              <Sparkles size={16} color={colors.softGold} />
              <Text style={styles.headerTitle}>Puja Copilot AI</Text>
            </View>
            <Text style={styles.headerSubtitle}>DeepSeek-V4 Flash • Zero-Hallucination Tools</Text>
          </View>
        </View>

        {/* Messages Stream */}
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <View key={idx} style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
                <View style={[styles.avatar, isUser ? styles.userAvatar : styles.botAvatar]}>
                  {isUser ? <User size={14} color="#FFFFFF" /> : <Bot size={14} color={colors.softGold} />}
                </View>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.messageText, isUser && styles.userText]}>{m.content}</Text>
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={[styles.bubbleWrapper, styles.botWrapper]}>
              <View style={[styles.avatar, styles.botAvatar]}>
                <Bot size={14} color={colors.softGold} />
              </View>
              <View style={[styles.bubble, styles.botBubble]}>
                <ActivityIndicator size="small" color={colors.antiqueGold} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Action Chips */}
        <View style={styles.chipsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {quickPrompts.map((q, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSend(q)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="পুজো বা মেট্রো নিয়ে প্রশ্ন করুন..."
            placeholderTextColor={colors.textSecondary}
            style={styles.inputField}
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity onPress={() => handleSend()} style={styles.sendButton} activeOpacity={0.8}>
            <Send size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CopilotScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  container: {
    flex: 1,
    backgroundColor: colors.deepCharcoal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: 12,
  },
  backButton: {
    padding: 6,
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: colors.softGold,
    fontSize: 10,
    marginTop: 1,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    gap: 10,
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botWrapper: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    backgroundColor: colors.durgaRed,
  },
  botAvatar: {
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.antiqueGold,
  },
  bubble: {
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: colors.durgaRed,
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.cardDark,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: 13,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  chipsContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: colors.cardDark,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipText: {
    color: colors.softGold,
    fontSize: 11,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.cardDark,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    gap: 10,
  },
  inputField: {
    flex: 1,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.durgaRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
