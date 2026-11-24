import { StyleSheet, View, StatusBar, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store';
import { Phone, ArrowRight } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { t } from '../../localization';

export default function PhoneScreen() {
  const router = useRouter();
  const { language } = useAuthStore();
  const [phone, setPhone] = useState('');

  const handleContinue = () => {
    if (!phone) return;
    router.push('/(auth)/otp');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <StatusBar />
        <View style={styles.header}>
          <View style={styles.back} />
          <Text style={styles.title}>{t('enter_phone', language)}</Text>
          <Text style={styles.subtitle}>{t('phone_placeholder', language)}</Text>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder={t('phone_placeholder', language).replace('+91 ', '')}
            placeholderTextColor={colors.secondaryText}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={[styles.button, !phone && styles.buttonDisabled]} onPress={handleContinue}>
            <Text style={[styles.buttonText, !phone && styles.buttonTextDisabled]}>
              {t('continue', language)}
              <ArrowRight size={18} color={colors.white} />
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
  back: { width: 40, height: 40 },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontBold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...{ shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  },
  countryCode: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
  },
  bottom: { paddingHorizontal: spacing.lg },
  button: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.muted,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  buttonTextDisabled: {
    color: 'rgba(255,255,255,0.6)',
  },
});
