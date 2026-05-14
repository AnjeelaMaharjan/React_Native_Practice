import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDrawerContext } from '../../../context/DrawerContext';
import { COLORS } from '../../../styles/colors';
import { SPACING } from '../../../styles/spacing';
import { TYPOGRAPHY } from '../../../styles/typography';

interface SafeHeaderProps {
  title: string;
  showDrawerButton?: boolean;
  rightComponent?: React.ReactNode;
}

/**
 * Safe header component that handles:
 * - Safe area insets
 * - Drawer toggle button
 * - Consistent spacing
 * - Type-safe props
 */
export const SafeHeader: React.FC<SafeHeaderProps> = ({
  title,
  showDrawerButton = true,
  rightComponent,
}) => {
  const { toggleDrawer } = useDrawerContext();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showDrawerButton && (
            <TouchableOpacity
              onPress={toggleDrawer}
              style={styles.drawerButton}
              activeOpacity={0.7}
            >
              <Text style={styles.drawerButtonText}>☰</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightComponent && (
          <View style={styles.rightSection}>
            {rightComponent}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  drawerButton: {
    padding: SPACING.sm,
    marginRight: SPACING.md,
  },
  drawerButtonText: {
    fontSize: 24,
    color: COLORS.primary[600],
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.gray[900],
  },
  rightSection: {
    marginLeft: SPACING.md,
  },
});

export default SafeHeader;