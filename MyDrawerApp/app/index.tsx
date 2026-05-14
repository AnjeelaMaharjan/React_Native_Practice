import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeHeader } from './src/components/Drawer/Header/SafeHeader';
import { COLORS, SPACING, TYPOGRAPHY } from './src/styles/index';
import { withDrawer } from './src/components/Drawer/DrawerHOC';

const Index: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SafeHeader title="Home" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome! </Text>
          <Text style={styles.cardDescription}>Professional Expo Router app with TypeScript, React 19, and drawer HOC.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Tips</Text>
          <Text style={styles.cardDescription}>• Tap the menu button (☰) to open drawer{'\n'}• Navigate between Home, Profile, and Settings{'\n'}• All code is TypeScript for type safety</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[50] },
  content: { padding: SPACING.lg },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.lg, marginBottom: SPACING.lg, elevation: 2, shadowColor: COLORS.black, shadowOpacity: 0.1, shadowRadius: 3.84, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary[600], marginBottom: SPACING.md },
  cardDescription: { ...TYPOGRAPHY.body, color: COLORS.gray[600] },
});

export default withDrawer(Index);