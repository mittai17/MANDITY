import { StyleSheet, View, StatusBar, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Home, ShoppingBag, Mic } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s < 2 ? s + 1 : s)), 900);
    return () => clearTimeout(t);
  }, []);

  const steps = [
    {
      title: 'Know the price.',
      subtitle: 'Check live mandi prices for your crops in your language.',
      icon: <Home size={48} color={colors.primary} />,
    },
    {
      title: 'Find the buyer.',
      subtitle: 'List your produce and connect directly with buyers near you.',
      icon: <ShoppingBag size={48} color={colors.primary} />,
    },
    {
      title: 'Sell smarter.',
      subtitle: 'Compare markets, calculate net proceeds, and use the voice assistant.',
      icon: <Mic size={48} color={colors.primary} />,
    },
  ];

  const current = steps[step];

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.content}>
        <View style={styles.iconBox}>{current.icon}</View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>
      {step === steps.length - 1 ? (
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/welcome')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => setStep((s) => s + 1)}>
          <Text style={[styles.buttonText, styles.buttonTextOutline]}>Next</Text>
        </TouchableOpacity>
      )}
      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  content: { alignItems: 'center' },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: radius.round,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    color: colors.white,
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontBold,
    textAlign: 'center' as const,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.fontSize.md,
    textAlign: 'center' as const,
    lineHeight: typography.lineHeight.lg,
    paddingHorizontal: spacing.sm,
  },
  button: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.white,
  },
  buttonText: {
    color: colors.primaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontBold,
  },
  buttonTextOutline: {
    color: colors.white,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 24, backgroundColor: colors.white },
});
