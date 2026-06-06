import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppStore } from '../store/appStore';

export function SyncIndicator() {
  const { isSyncing } = useAppStore();

  if (!isSyncing) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#FFFFFF" />
      <Text style={styles.text}>Syncing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196F3', // Blue
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
