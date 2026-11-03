// =============================================================================
// RIIQX Mobile — Authoritative Mobile Application Entry Screen
// Directly boots the Native React Native Master Agentic Tab Navigator
// PURE NATIVE MOBILE APPLICATION • ZERO IFRAME • ZERO WEBVIEW OVERLAY
// =============================================================================

import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)');
  }, [router]);

  return null;
}
