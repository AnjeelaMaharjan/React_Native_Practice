export const COLORS = {
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Primary
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#7e0606',
  info: '#3B82F6',
} as const;

export const TEXT_COLORS = {
  primary: COLORS.gray[900],
  secondary: COLORS.gray[600],
  tertiary: COLORS.gray[500],
  inverse: COLORS.white,
} as const;
