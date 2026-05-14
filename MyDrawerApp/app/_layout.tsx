import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DrawerProvider } from './src/context/DrawerContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DrawerProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </DrawerProvider>
    </SafeAreaProvider>
  );
}
