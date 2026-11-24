import { Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useAuthStore } from '../store';

export default function RootLayout() {
  const { isAuthenticated, isOnboardingComplete } = useAuthStore();

  useEffect(() => {
    ;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Slot />
    </View>
  );
}
