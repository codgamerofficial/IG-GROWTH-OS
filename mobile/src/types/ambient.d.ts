// =============================================================================
// PujaHop Kolkata Mobile: Ambient Type Declarations
// Ensures seamless TypeScript language server resolution in Expo & React Native
// =============================================================================

declare module 'react-native' {
  import React from 'react';

  export type TextStyle = any;
  export type ViewStyle = any;
  export type ImageStyle = any;

  export const View: React.FC<any>;
  export const Text: React.FC<any>;
  export const ScrollView: React.FC<any>;
  export const FlatList: React.FC<any>;
  export const TouchableOpacity: React.FC<any>;
  export const Image: React.FC<any>;
  export const ImageBackground: React.FC<any>;
  export const Switch: React.FC<any>;
  export const TextInput: React.FC<any>;
  export const ActivityIndicator: React.FC<any>;
  export const SafeAreaView: React.FC<any>;
  export const KeyboardAvoidingView: React.FC<any>;
  export const RefreshControl: React.FC<any>;

  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
    absoluteFillObject: Record<string, any>;
    absoluteFill: Record<string, any>;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'web';
    select: <T>(specifics: { ios?: T; android?: T; web?: T; default?: T }) => T;
  };

  export const Alert: {
    alert: (
      title: string,
      message?: string,
      buttons?: Array<{ text?: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }>,
      options?: any
    ) => void;
  };

  export const Linking: {
    openURL: (url: string) => Promise<any>;
    canOpenURL: (url: string) => Promise<boolean>;
  };

  export const Share: {
    share: (content: { message: string; title?: string; url?: string }, options?: any) => Promise<any>;
  };
}

declare module 'expo-router' {
  import React from 'react';

  export interface Router {
    push: (href: string | { pathname: string; params?: Record<string, any> }) => void;
    replace: (href: string | { pathname: string; params?: Record<string, any> }) => void;
    back: () => void;
    canGoBack: () => boolean;
  }

  export function useRouter(): Router;
  export function useLocalSearchParams<T = Record<string, string>>(): T;

  export const Tabs: {
    (props: any): React.ReactElement;
    Screen: (props: any) => React.ReactElement;
  };

  export const Stack: {
    (props: any): React.ReactElement;
    Screen: (props: any) => React.ReactElement;
  };

  export const Link: (props: any) => React.ReactElement;
}

declare module 'lucide-react-native' {
  import React from 'react';
  export interface IconProps {
    color?: string;
    size?: number;
    strokeWidth?: number;
    style?: any;
  }
  export const Home: React.FC<IconProps>;
  export const Compass: React.FC<IconProps>;
  export const Route: React.FC<IconProps>;
  export const Award: React.FC<IconProps>;
  export const Menu: React.FC<IconProps>;
  export const Sparkles: React.FC<IconProps>;
  export const ShieldAlert: React.FC<IconProps>;
  export const Train: React.FC<IconProps>;
  export const Utensils: React.FC<IconProps>;
  export const CloudSun: React.FC<IconProps>;
  export const CloudRain: React.FC<IconProps>;
  export const Wind: React.FC<IconProps>;
  export const Droplets: React.FC<IconProps>;
  export const Sun: React.FC<IconProps>;
  export const AlertTriangle: React.FC<IconProps>;
  export const AlertCircle: React.FC<IconProps>;
  export const CheckCircle2: React.FC<IconProps>;
  export const ArrowLeft: React.FC<IconProps>;
  export const ArrowRight: React.FC<IconProps>;
  export const MapPin: React.FC<IconProps>;
  export const Clock: React.FC<IconProps>;
  export const ShieldCheck: React.FC<IconProps>;
  export const Share2: React.FC<IconProps>;
  export const Navigation: React.FC<IconProps>;
  export const X: React.FC<IconProps>;
  export const Settings: React.FC<IconProps>;
  export const Info: React.FC<IconProps>;
  export const ChevronRight: React.FC<IconProps>;
  export const RefreshCw: React.FC<IconProps>;
  export const PhoneCall: React.FC<IconProps>;
  export const PhoneForwarded: React.FC<IconProps>;
  export const Radio: React.FC<IconProps>;
  export const HeartPulse: React.FC<IconProps>;
  export const Flame: React.FC<IconProps>;
  export const ExternalLink: React.FC<IconProps>;
  export const Calendar: React.FC<IconProps>;
  export const Cpu: React.FC<IconProps>;
  export const Heart: React.FC<IconProps>;
  export const Database: React.FC<IconProps>;
  export const Bell: React.FC<IconProps>;
  export const Camera: React.FC<IconProps>;
  export const Trash2: React.FC<IconProps>;
  export const Moon: React.FC<IconProps>;
  export const Globe: React.FC<IconProps>;
  export const Shield: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Layers: React.FC<IconProps>;
  export const Crosshair: React.FC<IconProps>;
  export const Search: React.FC<IconProps>;
  export const Send: React.FC<IconProps>;
  export const Bot: React.FC<IconProps>;
  export const Navigation2: React.FC<IconProps>;
  export const Footprints: React.FC<IconProps>;
  export const Check: React.FC<IconProps>;
  export const Star: React.FC<IconProps>;
}

declare module 'expo-status-bar' {
  import React from 'react';
  export function StatusBar(props: {
    style?: 'auto' | 'inverted' | 'light' | 'dark';
    backgroundColor?: string;
    translucent?: boolean;
    hidden?: boolean;
  }): React.ReactElement;
}

declare module 'react-native-safe-area-context' {
  import React from 'react';
  export const SafeAreaProvider: React.FC<{ children: React.ReactNode }>;
  export const SafeAreaView: React.FC<any>;
  export function useSafeAreaInsets(): { top: number; bottom: number; left: number; right: number };
}

declare module 'expo-haptics' {
  export enum ImpactFeedbackStyle {
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
  }
  export enum NotificationFeedbackType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
  }
  export function selectionAsync(): Promise<void>;
  export function impactAsync(style?: ImpactFeedbackStyle): Promise<void>;
  export function notificationAsync(type?: NotificationFeedbackType): Promise<void>;
}

declare module 'expo-sharing' {
  export function isAvailableAsync(): Promise<boolean>;
  export function shareAsync(url: string, options?: { dialogTitle?: string; mimeType?: string; UTI?: string }): Promise<void>;
}

declare module 'expo-location' {
  export enum Accuracy {
    Balanced = 3,
    High = 4,
    Highest = 5,
  }
  export interface LocationObject {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy: number | null;
      heading: number | null;
      speed: number | null;
    };
    timestamp: number;
  }
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function getForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function getCurrentPositionAsync(options?: any): Promise<LocationObject>;
}

declare module 'expo-secure-store' {
  export function setItemAsync(key: string, value: string, options?: any): Promise<void>;
  export function getItemAsync(key: string, options?: any): Promise<string | null>;
  export function deleteItemAsync(key: string, options?: any): Promise<void>;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
  };
  export default AsyncStorage;
}
