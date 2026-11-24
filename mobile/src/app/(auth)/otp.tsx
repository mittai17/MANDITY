import { StyleSheet, View, StatusBar, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { t } from '../../localization';

export default function OTPScreen() {
  const router = useRouter();
  const { language, login } = useAuthStore();
  const [code, setCode] = useState('');
  const [resendEnabled, setResendEnabled] = useState(false);

  const handleVerify = () => {
    if (code.length < 6) return;
    login({
      id: 'demo-user-1',
      full_name: 'Demo Farmer',
      phone: '+91 98765 43210',
      role: 'farmer',
      preferred_language: language,
      district: 'Chengalpattu',
      village: 'Demo Village',
      created_at: new Date().toISOString(),
    });
    router.replace('/(tabs)');
  };

  const handleResend = () => {
    setResendEnabled(false);
    setTimeout(() => setResendEnabled(true), 30000);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <StatusBar />
        <View style={styles.header}>
          <Text style={styles.title}>{t('otp_verification', language)}</Text>
          <Text style={styles.subtitle}>{t('otp_sub', language)} +91 98765 43210</Text>
        </View>

        <View style={styles.otpContainer}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.otpBox}>
              <TextInput
                style={styles.otpInput}
                maxLength={1}
                value={code[i] || ''}
                onChangeText={(t) => {
                  const next = code.slice(0, i) + t + code.slice(i + 1);
                  setCode(next);
                  if (t && i < 5) {
                    // move focus handled by auto
                  }
                }}
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
          ))}
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>{t('continue', language)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={!resendEnabled}>
            <Text style={[styles.resendLink, !resendEnabled && styles.resendLinkDisabled]}>
              {resendEnabled ? t('resend_otp', language) : 'Resend in 30s'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, marginBottom: spacing.xl },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontBold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  otpBox: { width: 50, height: 60 },
  otpInput: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
    color: colors.primaryText,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  bottom: { paddingHorizontal: spacing.lg },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  resendText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  resendLink: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  resendLinkDisabled: {
    color: colors.muted,
  },
});
