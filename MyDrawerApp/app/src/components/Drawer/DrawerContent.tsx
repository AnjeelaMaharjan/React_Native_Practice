import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '../../styles/index';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '@react-navigation/elements';
const DrawerContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const   router = useRouter();
  const menuItems = [
    { id: '1', label: 'Home', route: '/' },
    { id: '2', label: 'Profile', route: '/profile' },
    { id: '3', label: 'Settings', route: '/settings' },
    { id: '4', label: 'PlatformEx', route: '/PlatformEx' },
    { id: '5', label: 'Categories', route: '/CategoryScreen' },
    { id: '6', label: 'Camera', route: '/camera' },
    { id: '7', label: 'Tab View', route: '/tab' }


  ];



  const handleNavigate = (route: string) => {
    router.push(route as any);
    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleNavigate(item.route)} activeOpacity={0.7}>
            <Text style={styles.menuItemText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[200] },
  headerTitle: { ...TYPOGRAPHY.h4, color: COLORS.gray[900] },
  closeButton: { padding: SPACING.sm },
  closeButtonText: { fontSize: 24, color: COLORS.gray[600] },
  menuContainer: { flex: 1, paddingVertical: SPACING.md },
  menuItem: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] },
  menuItemText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.gray[900] },
  footer: { borderTopWidth: 1, borderTopColor: COLORS.gray[200], padding: SPACING.lg },
  footerButton: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, backgroundColor: COLORS.primary[50], borderRadius: 8 },
  footerButtonText: { ...TYPOGRAPHY.smallMedium, color: COLORS.primary[600], textAlign: 'center' },
});

export default DrawerContent;