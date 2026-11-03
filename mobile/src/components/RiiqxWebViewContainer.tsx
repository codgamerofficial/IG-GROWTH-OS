// =============================================================================
// RIIQX Mobile — Authoritative Web Application Container
// Cross-Platform: Native Android (react-native-webview) & Web (iframe)
// ZERO PERPETUAL SPINNERS • ZERO DUPLICATE HEADERS • FULL SCREEN INTEGRATION
// =============================================================================

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as RN from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

// Cast WebView to ComponentType to prevent React 19 / TS 5.8+ type intersection quirks
const RNCWebView = WebView as unknown as React.ComponentType<any>;

// Safe Android BackHandler resolution
const BackHandler = (RN as any).BackHandler;

/**
 * Resolves the primary URL to load.
 * 1. Checks EXPO_PUBLIC_WEB_APP_URL
 * 2. Dynamically detects Metro host IP from Constants.expoConfig?.hostUri
 * 3. Fallback to verified local LAN IP: http://10.224.192.200:3001
 */
function getDefaultUrl(): string {
  // If running in desktop browser on the host PC, localhost:3001 is direct & fastest
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
  }

  const envUrl = process.env.EXPO_PUBLIC_WEB_APP_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  // Auto-detect IP from Metro bundler host
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    '';

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:3001`;
    }
  }

  // Verified development LAN IP
  return 'http://10.224.192.200:3001';
}

export function RiiqxWebViewContainer() {
  const webViewRef = useRef<any>(null);
  const [currentUrl] = useState<string>(getDefaultUrl);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePageSettled = useCallback(() => {
    setHasLoadedOnce(true);
    setIsInitialLoading(false);
    setHasError(false);
  }, []);

  // Safety Timeout: Never let the loading overlay trap the user for more than 1500ms
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      handlePageSettled();
    }, 1500);

    return () => clearTimeout(safetyTimer);
  }, [handlePageSettled]);

  // Handle Android Hardware Back Button
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // handled
      }
      return false; // let system handle (exit or background app)
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backSubscription.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    if (navState.loading && hasError) {
      setHasError(false);
    }
  }, [hasError]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsInitialLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
    // Re-arm safety timeout on retry
    setTimeout(() => {
      handlePageSettled();
    }, 2000);
  }, [handlePageSettled]);

  // JavaScript injected on page load to configure mobile bridge
  const injectedJs = `
    (function() {
      window.IS_RIIQX_MOBILE = true;
      window.RIIQX_PLATFORM = 'expo-android';
      window.RIIQX_VERSION = '2.0.0';
      document.documentElement.classList.add('dark');
      true;
    })();
  `;

  // WEB BROWSER FALLBACK: react-native-webview is not supported on web
  // Render an iframe directly so opening in Chrome/Edge displays RIIQX cleanly
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <iframe
          src={currentUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#0C0C0E',
          }}
          title="RIIQX Web Shell"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" backgroundColor="#0C0C0E" />

      {/* Thin non-intrusive top progress indicator during page transitions */}
      {loadProgress > 0 && loadProgress < 1 && !hasLoadedOnce && (
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.round(loadProgress * 100)}%` },
            ]}
          />
        </View>
      )}

      {/* Primary Native Fullscreen WebView Container */}
      <View style={styles.webViewWrapper}>
        <RNCWebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webView}
          containerStyle={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="always"
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          cacheEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          pullToRefreshEnabled={true}
          scalesPageToFit={true}
          originWhitelist={['*']}
          injectedJavaScript={injectedJs}
          userAgent="Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36 RIIQXMobile/2.0"
          onLoadStart={() => {
            if (!hasLoadedOnce) {
              setIsInitialLoading(true);
            }
            setHasError(false);
          }}
          onLoadProgress={({ nativeEvent }: { nativeEvent: { progress: number } }) => {
            setLoadProgress(nativeEvent.progress);
            if (nativeEvent.progress >= 0.4) {
              handlePageSettled();
            }
          }}
          onLoad={handlePageSettled}
          onLoadEnd={handlePageSettled}
          onNavigationStateChange={handleNavigationStateChange}
          onError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            if (!hasLoadedOnce) {
              setHasError(true);
              setErrorMessage(nativeEvent?.description || 'Failed to connect to RIIQX server');
              setIsInitialLoading(false);
            }
          }}
          onHttpError={(syntheticEvent: any) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent?.statusCode);
            if (!hasLoadedOnce && nativeEvent && nativeEvent.statusCode >= 500) {
              setHasError(true);
              setErrorMessage(`Server responded with status ${nativeEvent.statusCode}`);
              setIsInitialLoading(false);
            }
          }}
        />

        {/* Branded Loading Overlay — Guaranteed auto-dismiss within 1500ms */}
        {isInitialLoading && !hasLoadedOnce && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingBrandContainer}>
              <View style={styles.loadingEmblem}>
                <Text style={styles.loadingEmblemText}>R</Text>
              </View>
              <Text style={styles.loadingBrandName}>RIIQX</Text>
              <Text style={styles.loadingTagline}>
                ONE GOAL. AN AI THAT GETS IT DONE.
              </Text>
              <ActivityIndicator
                size="large"
                color="#FFD43B"
                style={styles.spinner}
              />
              <Text style={styles.loadingStatusText}>
                Connecting to RIIQX Engine...
              </Text>
            </View>
          </View>
        )}

        {/* Offline / Genuine Connection Error Fallback Card */}
        {hasError && !hasLoadedOnce && (
          <View style={styles.errorOverlay}>
            <View style={styles.errorCard}>
              <View style={styles.errorIconContainer}>
                <Ionicons name="cloud-offline" size={44} color="#FF6B5E" />
              </View>

              <Text style={styles.errorTitle}>Connection Failed</Text>
              <Text style={styles.errorMessage}>
                Unable to reach the authoritative RIIQX application.
              </Text>

              <View style={styles.urlBadge}>
                <Text style={styles.urlBadgeLabel}>Target Server:</Text>
                <Text style={styles.urlBadgeValue} numberOfLines={1}>
                  {currentUrl}
                </Text>
              </View>

              <Text style={styles.errorDetails}>{errorMessage}</Text>

              <View style={styles.troubleshootBox}>
                <Text style={styles.troubleshootTitle}>Troubleshooting:</Text>
                <Text style={styles.troubleshootItem}>
                  1. Verify Next.js is running on your PC (`npm run dev`).
                </Text>
                <Text style={styles.troubleshootItem}>
                  2. Ensure your phone and PC are connected to the same Wi-Fi.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#0C0C0E" style={{ marginRight: 6 }} />
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0C0C0E',
  },
  progressBarContainer: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressBarFill: {
    height: 2,
    backgroundColor: '#FFD43B',
  },
  webViewWrapper: {
    flex: 1,
    backgroundColor: '#0C0C0E',
    position: 'relative',
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0C0C0E',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 999,
  },
  loadingBrandContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingEmblem: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFD43B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FFD43B',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  loadingEmblemText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0C0C0E',
  },
  loadingBrandName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  loadingTagline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A3A3A3',
    letterSpacing: 1.5,
    marginTop: 4,
    marginBottom: 28,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingStatusText: {
    fontSize: 12,
    color: '#737373',
    textAlign: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0C0C0E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 1000,
    elevation: 1000,
  },
  errorCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#141416',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  errorIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 107, 94, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: '#A3A3A3',
    textAlign: 'center',
    marginBottom: 16,
  },
  urlBadge: {
    width: '100%',
    backgroundColor: '#1E1E22',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  urlBadgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#737373',
  },
  urlBadgeValue: {
    flex: 1,
    fontSize: 12,
    color: '#FFD43B',
    fontWeight: '600',
  },
  errorDetails: {
    fontSize: 11,
    color: '#FF6B5E',
    textAlign: 'center',
    marginBottom: 16,
  },
  troubleshootBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  troubleshootTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  troubleshootItem: {
    fontSize: 10.5,
    color: '#8E8E93',
    lineHeight: 16,
  },
  retryButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFD43B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: '#0C0C0E',
    fontWeight: '800',
    fontSize: 14,
  },
});
