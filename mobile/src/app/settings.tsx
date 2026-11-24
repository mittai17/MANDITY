import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { ChevronRight, Bell, Globe, LogOut, Shield, Info } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows, LANGUAGES } from '../constants/theme';
import { t } from '../localization';
import { useAuthStore } from '../store';
import { Card, Text, Caption } from '../components/ui';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const router = useRouter();
  const { language, setLanguage, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <ChevronRight size={20} color={colors.primaryText} style={{ transform: [{ rotate: '180deg' }] } as any} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings', 'en')}</Text>
      </View>

      <View style={styles.section}>
        <SettingsRow
          label={t('language', 'en')}
          value={LANGUAGES.find((l) => l.code === language)?.name || 'English'}
          icon={<Globe size={20} color={colors.primary} />}
          onPress={() => {}}
        />
        <SettingsRow
          label="Location"
          value="Chengalpattu, Tamil Nadu"
          icon={<Shield size={20} color={colors.primary} />}
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <SettingsRow
          label={t('notifications', 'en')}
          value="On"
          icon={<Bell size={20} color={colors.primary} />}
          onPress={() => router.push('/notifications')}
        />
        <SettingsRow
          label="Privacy"
          value=""
          icon={<Shield size={20} color={colors.primary} />}
          onPress={() => router.push('/legal/privacy')}
        />
      </View>

      <View style={styles.section}>
        <SettingsRow
          label={t('help', 'en')}
          value=""
          icon={<Info size={20} color={colors.primary} />}
          onPress={() => router.push('/legal/help')}
        />
        <SettingsRow
          label={t('about', 'en')}
          value=""
          icon={<Info size={20} color={colors.primary} />}
          onPress={() => router.push('/legal/about')}
        />
        <SettingsRow
          label={t('terms', 'en')}
          value=""
          icon={<Info size={20} color={colors.primary} />}
          onPress={() => router.push('/legal/terms')}
        />
        <SettingsRow
          label={t('logout', 'en')}
          value=""
          icon={<LogOut size={20} color={colors.error} />}
          danger
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ivory },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  back: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center' },
  title: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
  },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  rowDanger: {},
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  label: {
    color: colors.primaryText,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  value: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
});

const SettingsRow = ({
  label,
  value,
  icon,
  onPress,
  danger,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  onPress: () => void;
  danger?: boolean;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.row, danger && styles.rowDanger]}>
    <View style={styles.iconBox}>{icon}</View>
    <View style={styles.info}>
      <Text style={[styles.label, danger && { color: colors.error }]}>{label}</Text>
      {value && <Caption style={styles.value}>{value}</Caption>}
    </View>
    <ChevronRight size={16} color={colors.secondaryText} />
  </TouchableOpacity>
);
