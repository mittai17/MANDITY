import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { LanguageCode, UserRole, UserProfile } from '../types';

// Storage adapter with in-memory fallback for web and SSR/tests
const memoryStore = new Map<string, string>();

const storageAdapter = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const val = await SecureStore.getItemAsync(name);
      return val ?? memoryStore.get(name) ?? null;
    } catch {
      return memoryStore.get(name) ?? null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    memoryStore.set(name, value);
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // In-memory fallback is active
    }
  },
  removeItem: async (name: string): Promise<void> => {
    memoryStore.delete(name);
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // In-memory fallback
    }
  },
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  language: LanguageCode;
  isOnboardingComplete: boolean;
  setUser: (user: UserProfile | null) => void;
  setLanguage: (lang: LanguageCode) => void;
  setOnboardingComplete: (complete: boolean) => void;
  login: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      language: 'en',
      isOnboardingComplete: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLanguage: (lang) => set({ language: lang }),
      setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
      login: (user) => set({ user, isAuthenticated: true, isOnboardingComplete: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'mandity-auth',
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);

interface UIState {
  theme: 'light' | 'dark';
  demoMode: boolean;
  setDemoMode: (mode: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  demoMode: false,
  setDemoMode: (mode) => set({ demoMode: mode }),
}));
