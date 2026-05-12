// ─────────────────────────────────────────────
//  Shared types used across all HOCs
// ─────────────────────────────────────────────

// ── withTheme ──────────────────────────────────

export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  error: string;
  surface: string;
}

export interface ThemeSpacing {
  small: number;
  medium: number;
  large: number;
}

export interface Theme {
  isDarkMode: boolean;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: number;
}

// Props that withTheme injects into the wrapped component
export interface WithThemeProps {
  theme: Theme;
  toggleTheme: () => void;
}

// ── withLoader ─────────────────────────────────

// Props that withLoader reads (not passed into wrapped component)
export interface WithLoaderProps {
  isLoading?: boolean;
}

// ── withAuth ───────────────────────────────────

export interface User {
  username: string;
  email: string;
  id: string;
  loginTime: string;
}

// Props that withAuth injects into the wrapped component
export interface WithAuthProps {
  user: User;
  logout: () => void;
  isAuthenticated: boolean;
}
