import { Stack } from "expo-router";
import { ApolloProvider } from '@apollo/client/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import { DrawerProvider } from '@/features/navigation/context/DrawerContext';
import { CounterProvider } from '@/features/counter/context/CounterContext';
import { client } from '@/graphql/client';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Text, View } from 'react-native';
import React, { Suspense } from 'react';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Suspense fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading database...</Text>
        </View>
      }>
        <SQLiteProvider databaseName="offline_first_app.db" useSuspense>
          <MigrationRunner>
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
          </MigrationRunner>
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}

function MigrationRunner({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const { success, error } = useMigrations(drizzleDb, migrations);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Running migrations...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
