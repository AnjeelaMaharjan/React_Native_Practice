/**
 * HOC: withTheme
 *
 * WHAT IT DOES:
 *   Wraps any component and gives it access to a dark/light theme.
 *
 * WHY WE NEED IT:
 *   Without a HOC you would copy the same theme state + toggle logic
 *   into every screen. This HOC keeps that logic in ONE place and just
 *   hands the result down as props.
 *
 * USAGE:
 *   const ThemedScreen = withTheme(MyScreen);
 *   // MyScreen now receives: theme, toggleTheme
 *
 * FLOW:
 *   withTheme(MyScreen)
 *     └─ returns <WithThemeWrapper>
 *           ├─ owns: isDarkMode state, toggleTheme()
 *           └─ renders: <MyScreen theme={...} toggleTheme={...} {...ownProps} />
 */

import React, { useState, ComponentType } from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme, WithThemeProps } from './types';

// T = the props the wrapped component itself needs (beyond theme props)
function withTheme<T extends object>(
  WrappedComponent: ComponentType<T & WithThemeProps>,
): ComponentType<Omit<T, keyof WithThemeProps>> {

  // The HOC returns a NEW component
  const WithThemeWrapper = (props: Omit<T, keyof WithThemeProps>) => {

    // ── State lives inside the HOC, not the wrapped component ──
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // ── Build the theme object ──────────────────────────────────
    const theme: Theme = {
      isDarkMode,
      colors: {
        background:  isDarkMode ? '#1a1a1a' : '#ffffff',
        text:        isDarkMode ? '#ffffff' : '#000000',
        primary:     isDarkMode ? '#bb86fc' : '#6200ee',
        secondary:   isDarkMode ? '#03dac6' : '#03dac6',
        error:       isDarkMode ? '#cf6679' : '#b00020',
        surface:     isDarkMode ? '#121212' : '#f5f5f5',
      },
      spacing: {
        small:  8,
        medium: 16,
        large:  24,
      },
      borderRadius: 8,
    };

    const toggleTheme = (): void => {
      setIsDarkMode(prev => !prev);
    };

    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/*
          Spread original props back, then add the HOC-injected props.
          The wrapped component receives everything it needs.
        */}
        <WrappedComponent
          {...(props as T)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </View>
    );
  };

  // Name shown in React DevTools: "WithTheme(MyScreen)"
  WithThemeWrapper.displayName = `WithTheme(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return WithThemeWrapper;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default withTheme;
