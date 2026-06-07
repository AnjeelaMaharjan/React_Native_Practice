import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { runMigrations } from '../db';

/**
 * Root Layout of the application.
 * 
 * Concept:
 * - We check if the local SQLite database has run migrations.
 * - If not, we show a loading indicator.
 * - Once migrations are completed, we render the screen Stack.
 */
export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function initDb() {
      await runMigrations();
      setDbReady(true);
    }
    initDb();
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5', // Deep Indigo primary theme
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor: '#F3F4F6', // Sleek background color
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Student Directory' }} />
      <Stack.Screen name="add" options={{ title: 'Add New Student' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Edit Student' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
