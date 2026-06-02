import { Stack } from "expo-router";
import { ApolloClient, InMemoryCache,HttpLink} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import { DrawerProvider } from '@/features/navigation/context/DrawerContext';
import { CounterProvider } from '@/features/counter/context/CounterContext';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://rickandmortyapi.com/graphql',}),
    // uri: 'https://graphqlzero.almansi.me/api',}),
  cache: new InMemoryCache(),
});

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DrawerProvider>
          <CounterProvider>
            <ApolloProvider client={client}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(drawer)" />
                <Stack.Screen name="pokemon/[id]" />
              </Stack>
            </ApolloProvider>
          </CounterProvider>
        </DrawerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
