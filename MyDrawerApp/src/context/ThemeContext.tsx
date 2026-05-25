import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  shadow: string;
}

export interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
  background: '#F9FAFB', // slate grey base
  card: '#FFFFFF',
  text: '#111827', // Charcoal/Black text
  textSecondary: '#4B5563', // muted body text
  border: '#E5E7EB',
  primary: '#4F46E5', // Indigo 600
  shadow: 'rgba(0, 0, 0, 0.05)',
};

const darkColors: ThemeColors = {
  background: '#0F172A', // Slate 900 base
  card: '#1E293B', // Slate 800 cards
  text: '#F8FAFC', // Slate 50 text
  textSecondary: '#94A3B8', // Slate 400 secondary text
  border: '#334155', // Slate 700 borders
  primary: '#6366F1', // Indigo 500
  shadow: 'rgba(0, 0, 0, 0.25)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component managing the theme engine.
 * Synchronizes with device preferences initially but allows manual toggles.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>((deviceColorScheme as ThemeMode) || 'light');

  useEffect(() => {
    if (deviceColorScheme) {
      setTheme(deviceColorScheme as ThemeMode);
    }
  }, [deviceColorScheme]);

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = (mode: ThemeMode): void => {
    setTheme(mode);
  };

  const colors = theme === 'dark' ? darkColors : lightColors;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
