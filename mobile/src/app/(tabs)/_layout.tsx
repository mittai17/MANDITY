import { Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../constants/theme';
import { useAuthStore } from '../../store';
import { Home, BarChart2, ShoppingBag, Mic, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const ICONS: Record<string, React.ComponentType<any>> = {
  home: Home,
  prices: BarChart2,
  marketplace: ShoppingBag,
  ai: Mic,
  profile: User,
};

export default function TabsLayout() {
  useEffect(() => {
    ;
  }, []);

  const { user } = useAuthStore();

  const screens = [
    { name: 'index', title: 'Home', icon: 'home' },
    { name: 'prices', title: 'Prices', icon: 'prices' },
    { name: 'marketplace', title: 'Marketplace', icon: 'marketplace' },
    { name: 'ai', title: 'AI', icon: 'ai' },
    { name: 'profile', title: 'Profile', icon: 'profile' },
  ];

  return (
    <Tabs>
      {screens.map((s) => (
        <Tabs.Screen
          key={s.name}
          name={s.name}
          options={{
            title: s.title,
            tabBarIcon: ({ focused }: { focused: boolean }) => {
              const Icon = ICONS[s.icon];
              return <Icon size={isSmallScreen ? 20 : 24} color={focused ? colors.primary : colors.secondaryText} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.secondaryText,
          }}
        />
      ))}
    </Tabs>
  );
}
