import {StyleSheet, View, StatusBar, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store';
import { User, ArrowRight } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { t } from '../../localization';

export default function WelcomeScreen() {
  const router = useRouter();
  const { setLanguage, language } = useAuthStore();

  const handleSelect = (role: string) => {
    router.push('/(auth)/phone');
  };

  const handleLanguage = (code: string) => {
    setLanguage(code as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <StatusBar />
      <View style={styles.header}>
        <View style={styles.logo}>
          <View style={styles.logoBg}>
            <Text style={styles.logoText}>M</Text>
          </View>
        </View>
        <Text style={styles.title}>{t('welcome', language)}</Text>
        <Text style={styles.subtitle}>{t('welcome_sub', language)}</Text>
      </View>

      <View style={styles.languageSection}>
        <Text style={styles.sectionLabel}>{t('select_language', language)}</Text>
        <View style={styles.languageRow}>
          {['en', 'ta', 'hi', 'te'].map((code) => (
            <TouchableOpacity
              key={code}
              style={[styles.languageChip, language === code && styles.languageChipActive]}
              onPress={() => handleLanguage(code)}
            >
              <Text style={[styles.languageLabel, language === code && styles.languageLabelActive]}>
                {code === 'en' ? 'English' : code === 'ta' ? 'தமிழ்' : code === 'hi' ? 'हिन्दी' : 'తెలుగు'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.roleSection}>
        <Text style={styles.sectionLabel}>{t('select_role', language)}</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity style={[styles.roleCard, styles.roleCardActive]} onPress={() => handleSelect('farmer')}>
            <User size={32} color={colors.white} />
            <Text style={styles.roleLabel}>{t('role_farmer', language)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.roleCard} onPress={() => handleSelect('buyer')}>
            <User size={32} color={colors.primaryText} />
            <Text style={styles.roleLabel}>{t('role_buyer', language)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/phone')}>
          <Text style={styles.buttonText}>{t('continue', language)}</Text>
          <ArrowRight size={18} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/(auth)/phone')}>
          <Text style={styles.skipText}>{t('skip', language)}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, marginBottom: spacing.xl, alignItems: 'center' },
  logo: { width: 56, height: 56 },
  logoBg: {
    width: 56,
    height: 56,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.white,
    fontFamily: typography.fontBold,
    fontSize: typography.fontSize.xxl,
  },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxxl,
    fontFamily: typography.fontBold,
    marginBottom: spacing.sm,
    textAlign: 'center' as const,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.md,
    textAlign: 'center' as const,
    lineHeight: typography.lineHeight.lg,
    paddingHorizontal: spacing.xl,
  },
  languageSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  roleSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
    marginBottom: spacing.md,
  },
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  languageChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.round,
  },
  languageChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontMedium,
  },
  languageLabelActive: { color: colors.white },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleCard: {
    flex: 1,
    height: 110,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    ...{ shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  },
  roleCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  bottom: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.md,
  },
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
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  skipButton: {
    alignItems: 'center',
  },
  skipText: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
});
