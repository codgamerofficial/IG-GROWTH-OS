// =============================================================================
// PujaHop Kolkata Mobile: Native Haptic Feedback Hook
// Section 47: Subtle physical feedback for button presses, stamps & route events
// =============================================================================

import * as Haptics from 'expo-haptics';

export function useHaptics() {
  const selection = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
  };

  const light = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const medium = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  };

  const heavy = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
  };

  const success = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  };

  const error = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  };

  return { selection, light, medium, heavy, success, error };
}
