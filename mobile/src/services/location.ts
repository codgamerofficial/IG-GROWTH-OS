// =============================================================================
// PujaHop Kolkata Mobile: Native Geolocation Service
// Section 15 & 16: Fine/Coarse permission handling, live GPS & geodesic distance
// =============================================================================

import * as Location from 'expo-location';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

export const locationService = {
  // Request permission honestly
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  },

  // Check current permission status
  async hasPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  },

  // Get current device coordinates
  async getCurrentLocation(): Promise<UserCoordinates | null> {
    try {
      const granted = await this.hasPermission();
      if (!granted) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    } catch (e) {
      console.warn('Location retrieval error', e);
      return null;
    }
  },

  // Geodesic distance in meters (Haversine formula)
  calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  },
};
