import React, { type ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  View,
} from 'react-native';

import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '@/styles';
import { useTheme } from '@/context/ThemeContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  /** Visual style variant. @default 'primary' */
  variant?: ButtonVariant;
  /** Button size preset. @default 'md' */
  size?: ButtonSize;
  /** Shows an ActivityIndicator and disables the button. */
  isLoading?: boolean;
  /** Disables the button with reduced opacity. */
  disabled?: boolean;
  /** Optional left-aligned icon element. */
  icon?: ReactNode;
  /** Press handler. */
  onPress: () => void;
  /** Button label content. */
  children: ReactNode;
  /** Optional additional container style overrides. */
  style?: ViewStyle;
}

// ---------------------------------------------------------------------------
// Size mappings
// ---------------------------------------------------------------------------

const SIZE_MAP: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; textStyle: TextStyle }> = {
  sm: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    textStyle: { ...TYPOGRAPHY.small, fontWeight: '600' },
  },
  md: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    textStyle: { ...TYPOGRAPHY.bodyMedium, fontWeight: '600' },
  },
  lg: {
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.lg,
    textStyle: { ...TYPOGRAPHY.bodyMedium, fontWeight: '700' },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A theme-aware, reusable Button atom following Atomic Design.
 *
 * Supports five visual variants, three sizes, loading state, and an optional
 * left-aligned icon.
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  onPress,
  children,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const isDisabled = disabled || isLoading;

  // ---- variant-driven colours ------------------------------------------

  const variantStyles = React.useMemo((): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: COLORS.primary[600],
            shadowColor: COLORS.primary[700],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 3,
          },
          text: { color: COLORS.white },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: isDark ? COLORS.gray[700] : COLORS.gray[100],
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 1,
          },
          text: { color: isDark ? COLORS.gray[100] : COLORS.gray[800] },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: COLORS.danger,
            shadowColor: COLORS.danger,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 3,
          },
          text: { color: COLORS.white },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: { color: colors.primary },
        };
    }
  }, [variant, isDark, colors]);

  // ---- size-driven dimensions ------------------------------------------

  const sizeConfig = SIZE_MAP[size];

  // ---- render -----------------------------------------------------------

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.base,
        {
          paddingVertical: sizeConfig.paddingVertical,
          paddingHorizontal: sizeConfig.paddingHorizontal,
        },
        variantStyles.container,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color as string}
          style={styles.loader}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          {typeof children === 'string' ? (
            <Text style={[sizeConfig.textStyle, variantStyles.text]}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  loader: {
    marginVertical: 2,
  },
});

export { Button };
export default Button;
