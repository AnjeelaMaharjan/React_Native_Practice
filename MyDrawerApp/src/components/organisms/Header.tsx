import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useDrawerContext } from '@/features/navigation/context/DrawerContext';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';

interface HeaderProps {
  title: string;
  showDrawerButton?: boolean;
  rightComponent?: React.ReactNode;
}

/**
 * Organism: Header component.
 * Integrates global theme provider state, drawer context, and provides modular layout flexibility.
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showDrawerButton = true,
  rightComponent,
}) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { toggleDrawer } = useDrawerContext();

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <View style={styles.container}>
        {/* Left Section: Drawer Toggle & Title */}
        <View style={styles.leftSection}>
          {showDrawerButton && (
            <TouchableOpacity
              onPress={toggleDrawer}
              style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Toggle Drawer Menu"
            >
              <Ionicons name="menu-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Section: Theme Toggle or Actions */}
        <View style={styles.rightSection}>
          {rightComponent}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Toggle Light/Dark Theme"
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    borderBottomWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});

export default Header;
