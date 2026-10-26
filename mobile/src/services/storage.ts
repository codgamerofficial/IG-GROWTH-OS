// =============================================================================
// RIIQX Mobile — Persistent Offline Storage & Hardware Secure Store
// Encrypted session tokens, offline conversations, and storyboard drafts
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  OFFLINE_CONVERSATIONS: '@riiqx:offline_conversations',
  CREATOR_DRAFTS: '@riiqx:creator_drafts',
  AUTOPILOT_CONFIG: '@riiqx:autopilot_config',
  LAST_SYNC: '@riiqx:last_sync',
  AUTH_TOKEN: 'riiqx_auth_token',
};

export const storage = {
  // Offline Conversations
  async saveConversations(convos: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.OFFLINE_CONVERSATIONS, JSON.stringify(convos));
      await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn('Failed to save offline conversations', e);
    }
  },

  async getConversations(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.OFFLINE_CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Creator Drafts
  async saveDrafts(drafts: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CREATOR_DRAFTS, JSON.stringify(drafts));
    } catch (e) {
      console.warn('Failed to save creator drafts', e);
    }
  },

  async getDrafts(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CREATOR_DRAFTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Hardware-Backed Secure Store for Auth Tokens
  async setSecureToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
    } catch (e) {
      console.warn('SecureStore fallback to AsyncStorage', e);
      await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
    }
  },

  async getSecureToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(KEYS.AUTH_TOKEN);
    } catch {
      return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    }
  },

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.OFFLINE_CONVERSATIONS);
      await AsyncStorage.removeItem(KEYS.CREATOR_DRAFTS);
    } catch (e) {
      console.warn('Failed to clear cache', e);
    }
  },
};

export const mobileStorage = storage;
