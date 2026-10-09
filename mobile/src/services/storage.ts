// =============================================================================
// PujaHop Kolkata Mobile: Persistent Offline Storage & Secure Store
// Section 32 & 38: Offline trips, cached pandal stamps, and secure session tokens
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { TripPlan, PandalVisitRecord } from '../../../../src/lib/types/pujahop';

const KEYS = {
  OFFLINE_TRIP: '@pujahop:offline_trip',
  PASSPORT_VISITS: '@pujahop:passport_visits',
  SAVED_PANDALS: '@pujahop:saved_pandals',
  SELECTED_DATE: '@pujahop:selected_date',
  LAST_SYNC: '@pujahop:last_sync',
  AUTH_TOKEN: 'pujahop_auth_token',
};

export const storage = {
  // Offline Trip Itinerary
  async saveOfflineTrip(trip: TripPlan): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.OFFLINE_TRIP, JSON.stringify(trip));
      await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn('Failed to save offline trip', e);
    }
  },

  async getOfflineTrip(): Promise<TripPlan | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.OFFLINE_TRIP);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async getLastSync(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.LAST_SYNC);
  },

  // Puja Passport Stamp Records
  async saveVisits(visits: PandalVisitRecord[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.PASSPORT_VISITS, JSON.stringify(visits));
  },

  async getVisits(): Promise<PandalVisitRecord[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PASSPORT_VISITS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Secure Auth Token (Biometric / Hardware-backed)
  async setSecureToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.AUTH_TOKEN, token);
    } catch (e) {
      console.warn('SecureStore unavailable, using fallback', e);
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
      await AsyncStorage.removeItem(KEYS.OFFLINE_TRIP);
      await AsyncStorage.removeItem(KEYS.SAVED_PANDALS);
    } catch (e) {
      console.warn('Failed to clear cache', e);
    }
  },
};

export const mobileStorage = storage;
