import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useDrawerContext } from '../../context/DrawerContext';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';

interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'pokedex', label: 'Pokédex Tracker', route: '/(drawer)/(tabs)', icon: 'list-circle-outline' },
  { id: 'counter', label: 'Counter App', route: '/(drawer)/(tabs)/counter', icon: 'add-circle-outline' },
  { id: 'camera', label: 'Camera & Storage', route: '/(drawer)/(tabs)/camera', icon: 'camera-outline' },
  { id: 'profile', label: 'My Profile', route: '/(drawer)/(tabs)/profile', icon: 'person-outline' },
  { id: 'settings', label: 'System Settings', route: '/(drawer)/settings', icon: 'settings-outline' },
];

interface CustomDrawerContentProps {
  onClose: () => void;
}

/**
 * Organism: CustomDrawerContent.
 * Custom content container displayed inside the drawer panel.
 * Contains router navigation logic, theme switches, and side anchor controls.
 */
export const CustomDrawerContent: React.FC<CustomDrawerContentProps> = ({ onClose }) => {
  const router = useRouter();
  const segments = useSegments();
  const { colors, isDark, toggleTheme } = useTheme();
  const { side, setDrawerSide } = useDrawerContext();

  // Highlight active link by examining current route segments
  const checkIsActive = (route: string) => {
    const activeSegments = segments as string[];
    // Tab routes logic
    if (route === '/(drawer)/(tabs)') {
      // is root tabs
      return activeSegments.length === 3 && activeSegments[1] === '(tabs)' && activeSegments[2] === 'index';
    }
    if (route.includes('counter')) return activeSegments.includes('counter');
    if (route.includes('camera')) return activeSegments.includes('camera');
    if (route.includes('profile')) return activeSegments.includes('profile');
    if (route.includes('settings')) return activeSegments.includes('settings');
    return false;
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
    onClose();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]} edges={['top', 'bottom']}>
      {/* Drawer Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="sparkles" size={24} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Auxfin Dev</Text>
        </View>
        <Text style={styles.headerSubtitle}>Internship Project</Text>
      </View>

      {/* Drawer Navigation Links */}
      <ScrollView style={styles.menuScroll} contentContainerStyle={styles.menuContent}>
        {MENU_ITEMS.map((item) => {
          const isActive = checkIsActive(item.route);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { borderRadius: BORDER_RADIUS.md },
                isActive && { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.08)' },
              ]}
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.menuItemText,
                  { color: isActive ? colors.primary : colors.text },
                  isActive && { fontWeight: '600' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* System Settings & Custom Controls */}
      <View style={[styles.settingsSection, { borderTopColor: colors.border }]}>
        {/* Toggle 1: Theme Toggler */}
        <View style={styles.controlRow}>
          <View style={styles.controlLabelGroup}>
            <Ionicons name="moon-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.controlLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={isDark ? '#F5DD4B' : '#F4F3F4'}
          />
        </View>

        {/* Toggle 2: Drawer Orientation Side */}
        <View style={styles.controlRow}>
          <View style={styles.controlLabelGroup}>
            <Ionicons name="swap-horizontal-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.controlLabel, { color: colors.text }]}>Drawer Right</Text>
          </View>
          <Switch
            value={side === 'right'}
            onValueChange={(checked) => setDrawerSide(checked ? 'right' : 'left')}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={side === 'right' ? '#4CAF50' : '#F4F3F4'}
          />
        </View>
      </View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>v1.0.0 (Production-Ready)</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsSection: {
    padding: SPACING.md,
    borderTopWidth: 1,
    gap: SPACING.sm,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  controlLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 11,
    color: '#666',
  },
});

export default CustomDrawerContent;
