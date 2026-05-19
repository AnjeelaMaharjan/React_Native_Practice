import React from 'react';
import { Stack } from 'expo-router';
import index from '../Screens/index';

export default function DrawerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="PlatformEx" options={{ title: 'PlatformEx' }} />
      <Stack.Screen name="CategoryScreen" options={{ title: 'Categories' }} />
      <Stack.Screen name="camera" options={{ title: 'Camera' }} />
      <Stack.Screen name="tab" options={{ title: 'Tab View' }} />
    </Stack>
  );
}