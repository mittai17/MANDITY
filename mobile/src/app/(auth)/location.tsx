import { StyleSheet, View, StatusBar, Text, ScrollView } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { MapPin, ArrowRight } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { t } from '../../localization';
import { useAuthStore } from '../../store';

export default function LocationScreen() {
  const router = useRouter();
  const { language } = useAuthStore();

  const handleSelect = (district: string) => {
    router.push('/(auth)/permissions');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <StatusBar />
      <View style={styles.header}>
        <Text style={styles.title}>{t('select_location', language)}</Text>
        <Text style={styles.subtitle}>Choose your district and village</Text>
      </View>

      <View style={styles.locations}>
        {[
          'Chengalpattu',
          'Chennai',
          'Tiruvallur',
          'Kancheepuram',
          'Vellore',
          'Madurai',
        ].map((d) => (
          <TouchableOpacity
            key={d}
            style={styles.locationCard}
            onPress={() => handleSelect(d)}
          >
            <MapPin size={18} color={colors.primary} />
            <Text style={styles.locationName}>{d}, Tamil Nadu</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/permissions')}>
          <Text style={styles.buttonText}>{t('continue', language)}</Text>
          <ArrowRight size={18} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/(auth)/permissions')}>
          <Text style={styles.skipText}>{t('skip', language)}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  locations: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  locationCard: {
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
  locationName: {
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
