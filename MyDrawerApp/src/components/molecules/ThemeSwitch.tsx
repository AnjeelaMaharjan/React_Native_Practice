import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/styles';
import { useTheme } from '@/context/ThemeContext';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PILL_BG_LIGHT = COLORS.gray[100];
const PILL_BG_DARK = COLORS.gray[800];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A self-contained theme toggle molecule.
 *
 * Renders a pill-shaped button with an animated background transition. Shows a
 * sun icon when the current theme is dark (pressing switches to light) and a
 * moon icon when light. A label reading "Light" / "Dark" accompanies the icon.
 */
const ThemeSwitch: React.FC = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  // Animated value: 0 = light, 1 = dark
  const anim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isDark ? 1 : 0,
      duration: 280,
      useNativeDriver: false, // background color cannot use native driver
    }).start();
  }, [isDark, anim]);

  const animatedBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [PILL_BG_LIGHT, PILL_BG_DARK],
  });

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={toggleTheme}>
      <Animated.View style={[styles.pill, { backgroundColor: animatedBg }]}>
        <View style={styles.inner}>
          <Ionicons
            name={isDark ? 'sunny' : 'moon'}
            size={18}
            color={isDark ? COLORS.warning : COLORS.primary[500]}
          />
          <Text style={[styles.label, { color: colors.text }]}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  pill: {
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.smallMedium,
  },
});

export { ThemeSwitch };
export default ThemeSwitch;
