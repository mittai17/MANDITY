import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Menu, Edit, Bell, LogOut, ArrowRight, Check } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, LANGUAGES } from '../../constants/theme';
import { getAvatarSource } from '../../constants/images';
import { t } from '../../localization';
import { useAuthStore } from '../../store';
import { Card, Button, Text, Caption } from '../../components/ui';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const { user, language, setLanguage, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image source={getAvatarSource(user?.full_name)} style={styles.avatarImg} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.full_name || 'Ravi Kumar'}</Text>
          <Caption style={styles.profileRole}>{user?.role === 'farmer' ? 'Farmer' : 'Buyer'} • {user?.phone || '+91 98765 43210'}</Caption>
        </View>
        <Button variant="outline" size="sm" onPress={() => router.push('/edit-profile')} style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs, minWidth: 90 }}>
          <Edit size={16} color={colors.primary} /> Edit
        </Button>
      </View>

      <View style={styles.locationRow}>
        <View style={styles.locationIcon} />
        <Text style={styles.locationText}>{user?.district || 'Tamil Nadu, India'}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <HeadingC style={styles.sectionTitle}>{t('language', 'en')}</HeadingC>
          <Menu size={20} color={colors.secondaryText} />
        </View>
        <View style={styles.languageList}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setLanguage(lang.code as any)}
              activeOpacity={0.8}
              style={[styles.languageItem, language === lang.code && styles.languageItemActive]}
            >
              <View style={styles.langInfo}>
                <Text style={styles.langName}>{lang.nativeName}</Text>
                <Caption style={styles.langCode}>{lang.name}</Caption>
              </View>
              {language === lang.code && <Check size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <HeadingC style={styles.sectionTitle}>{t('notifications', 'en')}</HeadingC>
          <Bell size={20} color={colors.secondaryText} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Price alerts</Text>
          <View style={styles.switchWrap} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>New inquiries</Text>
          <View style={styles.switchWrap} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <HeadingC style={styles.sectionTitle}>Account</HeadingC>
          <ArrowRight size={18} color={colors.secondaryText} />
        </View>
        <View style={styles.settingsList}>
          <TouchableOpacity activeOpacity={0.8} style={styles.settingsItem} onPress={() => router.push('/legal/privacy')}>
            <Text style={styles.settingsLabel}>{t('privacy', 'en')}</Text>
            <ArrowRight size={16} color={colors.secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.settingsItem} onPress={() => router.push('/legal/terms')}>
            <Text style={styles.settingsLabel}>{t('terms', 'en')}</Text>
            <ArrowRight size={16} color={colors.secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.settingsItem} onPress={() => router.push('/legal/help')}>
            <Text style={styles.settingsLabel}>{t('help', 'en')}</Text>
            <ArrowRight size={16} color={colors.secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.settingsItem} onPress={() => router.push('/legal/about')}>
            <Text style={styles.settingsLabel}>{t('about', 'en')}</Text>
            <ArrowRight size={16} color={colors.secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={[styles.settingsItem, styles.settingsItemDanger]} onPress={handleLogout}>
            <Text style={[styles.settingsLabel, { color: colors.error }]}>{t('logout', 'en')}</Text>
            <LogOut size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.round,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  avatarImg: { width: 76, height: 76, borderRadius: radius.round },
  avatarBg: { width: 56, height: 56, borderRadius: radius.round, backgroundColor: colors.primary },
  profileInfo: { gap: 4 },
  profileName: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontBold,
  },
  profileRole: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontBold,
  },
  languageList: { gap: spacing.sm },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  languageItemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  langInfo: { gap: 2 },
  langName: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
  },
  langCode: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  toggleLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
  },
  switchWrap: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.muted,
  },
  settingsList: { gap: spacing.sm, paddingHorizontal: spacing.lg },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  settingsItemDanger: {},
  settingsLabel: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
  },
});

const HeadingC = (props: { style?: any; children: React.ReactNode }) => (
  <Text style={[styles.sectionTitle, props.style]} {...props} />
);
