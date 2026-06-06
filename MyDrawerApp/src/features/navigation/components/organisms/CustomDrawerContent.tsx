import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useDrawerContext } from '../../context/DrawerContext';
import { SPACING, BORDER_RADIUS, CustomDrawerContentstyles as styles, CustomDrawerContentstyles } from '@/styles';

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
  { id: 'CreatePost', label: 'Create Post', route: '/(drawer)/CreatePost', icon: 'create-outline'},
  { id: 'GraphQLExample', label: 'GraphQL Example', route: '/(drawer)/(tabs)/GraphQLExample', icon: 'git-network-outline' },
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
    if (route.includes('GraphQLExample')) return activeSegments.includes('GraphQLExample');
    if (route.includes('CreatePost')) return activeSegments.includes('CreatePost');
    if (route.includes('pokemon')) return activeSegments.includes('pokemon');
    return false;
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
    onClose();
  };

  return (
    <SafeAreaView style={[CustomDrawerContentstyles.container, { backgroundColor: colors.card }]} edges={['top', 'bottom']}>
      {/* Drawer Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="logo-android" size={24} color={colors.primary} />
          <Text style={{ color: colors.text }}>My DrawerApp</Text>
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

        {/* Select Drawer Placement Position */}
        <View style={{ marginTop: SPACING.xs }}>
          <View style={[styles.controlLabelGroup, { marginBottom: SPACING.xs }]}>
            <Ionicons name="compass-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.controlLabel, { color: colors.text }]}>Drawer Position</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap', marginTop: 4 }}>
            {(['left', 'right', 'top', 'bottom'] as const).map((pos) => {
              const active = side === pos;
              return (
                <TouchableOpacity
                  key={pos}
                  onPress={() => setDrawerSide(pos)}
                  style={{
                    flex: 1,
                    minWidth: 60,
                    paddingVertical: SPACING.xs + 2,
                    paddingHorizontal: SPACING.sm,
                    borderRadius: BORDER_RADIUS.md,
                    borderWidth: 1,
                    borderColor: active ? colors.primary : colors.border,
                    backgroundColor: active ? colors.primary : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '700',
                      color: active ? '#ffffff' : colors.text,
                      textTransform: 'capitalize',
                    }}
                  >
                    {pos}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>This is footer {new Date().toLocaleDateString()} </Text>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
