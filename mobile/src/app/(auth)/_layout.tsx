import { View } from 'react-native';
import { Slot, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuthStore } from '../../store';

export default function AuthLayout() {
  const { isAuthenticated, isOnboardingComplete } = useAuthStore();
  const params = useLocalSearchParams();

  useEffect(() => {
    // no-op
  }, [isAuthenticated, isOnboardingComplete, params]);

  return <Slot />;
}
