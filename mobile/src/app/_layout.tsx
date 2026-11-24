import { Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../store';

export default function RootLayout() {
  const { isAuthenticated, isOnboardingComplete } = useAuthStore();

  useEffect(() => {
    ;
  }, []);

  return <Slot />;
}
