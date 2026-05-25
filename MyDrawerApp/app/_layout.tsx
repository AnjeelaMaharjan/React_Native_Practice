import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import { DrawerProvider } from '@/features/navigation/context/DrawerContext';
import { CounterProvider } from '@/features/counter/context/CounterContext';

/**
 * Root Layout for Expo Router.
 * Configures the primary stack and mounts global state providers at the top level.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DrawerProvider>
          <CounterProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(drawer)" />
              <Stack.Screen name="pokemon/[id]" />
            </Stack>
          </CounterProvider>
        </DrawerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
