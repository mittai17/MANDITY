import {StyleSheet, View, StatusBar, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store';
import { User, MapPin, ArrowRight } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { t } from '../../localization';

export default function AuthProfileScreen() {
  const router = useRouter();
  const { language, setUser, login } = useAuthStore();
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (!name) return;
    const user = {
      id: 'demo-user-1',
      full_name: name,
      phone: '+91 98765 43210',
      role: 'farmer' as const,
      preferred_language: language,
      district: 'Chengalpattu',
      village: 'Demo Village',
      created_at: new Date().toISOString(),
    };
    setUser(user);
    login(user);
    router.replace('/(auth)/location');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <StatusBar />
        <View style={styles.header}>
          <Text style={styles.title}>{t('create_profile', language)}</Text>
          <Text style={styles.subtitle}>Tell us about yourself</Text>
        </View>

        <View style={styles.inputRow}>
          <User size={20} color={colors.secondaryText} />
          <TextInput
            style={styles.input}
            placeholder={t('name_placeholder', language)}
            placeholderTextColor={colors.secondaryText}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity style={[styles.button, !name && styles.buttonDisabled]} onPress={handleContinue}>
            <Text style={[styles.buttonText, !name && styles.buttonTextDisabled]}>
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
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
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
