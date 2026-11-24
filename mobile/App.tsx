import { StatusBar } from 'expo-status-bar';
import { ExpoRoot } from 'expo-router';
import { View } from 'react-native';

export default function App() {
  // @ts-ignore - Expo router context
  const ctx = require.context('./src/app');
  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <ExpoRoot context={ctx} />
    </View>
  );
}
