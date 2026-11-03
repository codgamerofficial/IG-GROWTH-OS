// =============================================================================
// RIIQX Mobile — Authentication Screen (Real Supabase Auth Integration)
// ONE AUTHENTICATION SYSTEM · ZERO FAKE PREFILLED CREDENTIALS
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { useRiiqxMobile } from '../../src/context/RiiqxMobileContext';
import { supabase } from '../../src/services/supabase';
import { lightColors, darkColors } from '../../src/theme/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { isDarkMode } = useRiiqx();
  const { refreshSession } = useRiiqxMobile();
  const theme = isDarkMode ? darkColors : lightColors;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        Alert.alert('Authentication Failed', error.message);
        return;
      }

      if (data.session) {
        await refreshSession();
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please enter an email and password to create an account.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        Alert.alert('Sign Up Failed', error.message);
        return;
      }

      if (data.session) {
        await refreshSession();
        Alert.alert('Account Created', 'Welcome to RIIQX!');
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Verification Required',
          'A confirmation email has been sent. Please confirm your email to sign in.'
        );
      }
    } catch (err: any) {
      Alert.alert('Sign Up Error', err.message || 'Unable to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo Badge */}
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>R</Text>
            </View>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>RIIQX</Text>
          </View>

          {/* Title & Subhead */}
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Welcome to RIIQX</Text>
          <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
            Sign in to access your Creator OS & Autopilot
          </Text>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Ionicons name="mail-outline" size={18} color={theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>PASSWORD</Text>
                <TouchableOpacity
                  onPress={() => {
                    if (!email.trim()) {
                      Alert.alert('Enter Email', 'Please enter your email above to receive a password reset link.');
                      return;
                    }
                    supabase.auth.resetPasswordForEmail(email.trim()).then(({ error }) => {
                      if (error) {
                        Alert.alert('Error', error.message);
                      } else {
                        Alert.alert('Reset Email Sent', 'Check your inbox for password reset instructions.');
                      }
                    });
                  }}
                >
                  <Text style={[styles.forgotLink, { color: theme.primary }]}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: '#FFD43B' }]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#0C0C0E" />
              ) : (
                <Text style={[styles.submitButtonText, { color: '#0C0C0E' }]}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Alternative */}
            <TouchableOpacity
              style={[styles.signUpButton, { borderColor: theme.cardBorder }]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={[styles.signUpButtonText, { color: theme.textPrimary }]}>Create New Account</Text>
            </TouchableOpacity>

            {/* Guest / Direct Explorer Mode */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestAccess}
              activeOpacity={0.7}
            >
              <Text style={[styles.guestButtonText, { color: theme.textMuted }]}>
                Continue as Guest Explorer →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFD43B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    color: '#0C0C0E',
    fontWeight: '900',
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
  },
  form: {
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputBox: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  signUpButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
