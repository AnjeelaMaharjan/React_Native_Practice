import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';

import { SPACING, BORDER_RADIUS } from '@/styles';
import { useTheme } from '@/context/ThemeContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BlurIntensity = 'light' | 'medium' | 'heavy';

interface GlassCardProps {
  /** Card body content. */
  children: React.ReactNode;
  /** Optional additional styles applied to the outer container. */
  style?: ViewStyle;
  /** Controls the opacity of the translucent background. @default 'light' */
  blurIntensity?: BlurIntensity;
}

// ---------------------------------------------------------------------------
// Intensity → opacity mapping
// ---------------------------------------------------------------------------

const INTENSITY_OPACITY: Record<BlurIntensity, { dark: number; light: number }> = {
  light:  { dark: 0.55, light: 0.6 },
  medium: { dark: 0.7,  light: 0.75 },
  heavy:  { dark: 0.85, light: 0.88 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A theme-aware glassmorphism card atom.
 *
 * Simulates a frosted-glass look through semi-transparent background colours
 * **without** relying on `expo-blur` or any native blur library.
 */
const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  blurIntensity = 'light',
}) => {
  const { isDark } = useTheme();
  const opacities = INTENSITY_OPACITY[blurIntensity];
  const alpha = isDark ? opacities.dark : opacities.light;

  // Base RGBA values – Slate 800 for dark, white for light.
  const backgroundColor = isDark
    ? `rgba(30, 41, 59, ${alpha})`
    : `rgba(255, 255, 255, ${alpha})`;

  const borderColor = isDark
    ? `rgba(148, 163, 184, 0.18)`  // slate-400 @ low opacity
    : `rgba(0, 0, 0, 0.08)`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          shadowColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    // Subtle shadow / elevation
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, // opacity handled via shadowColor rgba
    shadowRadius: 12,
    elevation: 4,
  },
});

export { GlassCard };
export default GlassCard;
