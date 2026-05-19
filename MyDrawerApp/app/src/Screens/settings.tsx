import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeHeader } from '../components/Header/SafeHeader';
import { COLORS, SPACING, TYPOGRAPHY } from '../styles/index';
import { withDrawer } from '../components/Drawer/DrawerHOC';
const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SafeHeader title="Settings" />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>App Settings</Text>
          <Text style={styles.cardDescription}>Configure your preferences here</Text>
        </View>
      </View>
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray[50] },
  content: { padding: SPACING.lg },
  card: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING.lg, elevation: 2, shadowColor: COLORS.black, shadowOpacity: 0.1, shadowRadius: 3.84, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { ...TYPOGRAPHY.h3, color: COLORS.primary[600], marginBottom: SPACING.md },
  cardDescription: { ...TYPOGRAPHY.body, color: COLORS.gray[600] },
});

export default withDrawer(SettingsScreen);