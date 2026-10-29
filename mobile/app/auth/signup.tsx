// =============================================================================
// RIIQX Mobile — Screen 5: Sign Up Screen
// Matches Reference Board Screen 5
// "Create Your Account" • Full Name • Email • Password • Social Login • Legal Checkbox
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRiiqx } from '../../src/context/RiiqxContext';
import { lightColors, darkColors } from '../../src/theme/colors';

export default function SignUpScreen() {
  const router = useRouter();
  const { isDarkMode } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const handleSignUp = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in your name, email and password.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms Agreement', 'Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    // Advance to Interest Selection Screen (Screen 8)
    router.push('/onboarding/interests');
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
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>Create Your Account</Text>
          <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
            Start your AI-powered multi-asset wealth journey
          </Text>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>FULL NAME</Text>
              <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Ionicons name="person-outline" size={18} color={theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="Arif Hossain"
                  placeholderTextColor={theme.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>EMAIL ADDRESS</Text>
              <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Ionicons name="mail-outline" size={18} color={theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="arif@gmail.com"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>PASSWORD</Text>
              <View style={[styles.inputBox, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
                <Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="••••••••••••"
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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

            {/* Terms Agreement Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, agreed && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                {agreed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={[styles.checkboxLabel, { color: theme.textSecondary }]}>
                I agree to the <Text style={{ color: theme.primary, fontWeight: '700' }}>Terms</Text> & <Text style={{ color: theme.primary, fontWeight: '700' }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Primary Sign Up Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.primary }]}
              onPress={handleSignUp}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Social Auth Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
              <Text style={[styles.dividerText, { color: theme.textMuted }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={[styles.socialBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
                onPress={() => router.push('/onboarding/interests')}
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={[styles.socialBtnText, { color: theme.textPrimary }]}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialBtn, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}
                onPress={() => router.push('/onboarding/interests')}
              >
                <Ionicons name="logo-apple" size={20} color={theme.textPrimary} />
                <Text style={[styles.socialBtnText, { color: theme.textPrimary }]}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Footer Navigation */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={[styles.footerLink, { color: theme.primary }]}>Login</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#6750D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadgeText: {
    color: '#FFFFFF',
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 12,
  },
  submitButton: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#6750D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    marginHorizontal: 10,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
  },
});
