import { StyleSheet, View, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store';
import { colors, spacing, radius, typography } from '../constants/theme';
import { Leaf, Home, ShoppingBag, Mic, User } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isOnboardingComplete } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isAuthenticated && isOnboardingComplete) {
      router.replace('/(tabs)');
    } else if (isAuthenticated) {
      router.replace('/(auth)/welcome');
    } else {
      router.replace('/(auth)/splash');
    }
  }, [mounted, isAuthenticated, isOnboardingComplete, router]);

  if (!mounted) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.logo}>
          <View style={styles.logoBg}>
            <Leaf size={32} color={colors.white} />
          </View>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 80, height: 80 },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: radius.round,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
