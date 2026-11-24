import { StyleSheet, View, StatusBar, Text, ScrollView } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store';
import { Phone, Mic, Check } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { t } from '../../localization';

export default function PermissionsScreen() {
  const router = useRouter();
  const { language } = useAuthStore();

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <StatusBar />
      <View style={styles.header}>
        <Text style={styles.title}>{t('permissions', language)}</Text>
        <Text style={styles.subtitle}>Allow Mandity to access your device features</Text>
      </View>

      <View style={styles.permissions}>
        <PermissionRow
          icon={<Phone size={24} color={colors.primary} />}
          title="Location"
          subtitle="Show nearby mandi prices and markets"
        />
        <PermissionRow
          icon={<Mic size={24} color={colors.primary} />}
          title="Microphone"
          subtitle="Use the voice assistant to ask about prices"
        />
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={handleFinish}>
          <Text style={styles.buttonText}>{t('continue', language)}</Text>
          <Check size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const PermissionRow = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <View style={styles.row}>
    <View style={styles.iconBox}>{icon}</View>
    <View style={styles.info}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>
  </View>
);

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
  permissions: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  rowTitle: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontMedium,
  },
  rowSubtitle: {
    color: colors.secondaryText,
    fontSize: typography.fontSize.sm,
  },
  bottom: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
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
});
