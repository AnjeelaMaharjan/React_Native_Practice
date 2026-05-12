/**
 * Screen: Example1_Theme
 *
 * Demonstrates withTheme HOC.
 *
 * Notice: this component has ZERO knowledge of how the theme is built
 * or how isDarkMode state is managed. It just uses what the HOC gives it.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import withTheme from '../hocs/withTheme';
import { WithThemeProps } from '../hocs/types';

// ── Component ────────────────────────────────────────────────────────────────
// Only declares the props IT needs. The HOC props (theme, toggleTheme) come
// from WithThemeProps — they are injected automatically.
type Props = WithThemeProps;

const ThemeScreen: React.FC<Props> = ({ theme, toggleTheme }) => {
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Text style={[styles.title, { color: theme.colors.text }]}>
         withTheme Example
      </Text>

      <Text style={[styles.modeLabel, { color: theme.colors.primary }]}>
        Mode: {theme.isDarkMode ? 'Dark ' : 'Light '}
      </Text>

      {/* Show every color swatch */}
      {(Object.entries(theme.colors) as [string, string][]).map(([name, hex]) => (
        <View key={name} style={styles.colorRow}>
          <View style={[styles.swatch, { backgroundColor: hex }]} />
          <Text style={[styles.swatchLabel, { color: theme.colors.text }]}>
            {name}: {hex}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.toggleButton, { backgroundColor: theme.colors.primary }]}
        onPress={toggleTheme}
      >
        <Text style={styles.toggleButtonText}>
          Switch to {theme.isDarkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      <View style={[styles.infoBox, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          The withTheme HOC owns the isDarkMode state and the theme object.
          This screen just reads the props it receives — no state needed here!
        </Text>
      </View>

    </ScrollView>
  );
};

// ── HOC wrapping ─────────────────────────────────────────────────────────────
// withTheme injects `theme` and `toggleTheme` so callers don't pass them.
export default withTheme(ThemeScreen);

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:       { flex: 1, padding: 20 },
  title:           { fontSize: 26, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  modeLabel:       { fontSize: 16, fontWeight: '600', marginBottom: 20 },
  colorRow:        { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  swatch:          { width: 32, height: 32, borderRadius: 6, marginRight: 12, borderWidth: 1, borderColor: '#ccc' },
  swatchLabel:     { fontSize: 14 },
  toggleButton:    { marginTop: 24, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  toggleButtonText:{ color: '#fff', fontSize: 16, fontWeight: 'bold' },
  infoBox:         { marginTop: 24, padding: 16, borderRadius: 8 },
  infoText:        { fontSize: 14, lineHeight: 22 },
});
