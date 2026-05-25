/**
 * Global TypeScript type definitions for the Auxfin internship project.
 * Central repository for shared types used across features.
 */

/** Base navigation route parameter definitions */
export type RootStackParamList = {
  '(drawer)': undefined;
  'pokemon/[id]': { id: string };
};

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

/** Generic pagination metadata */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/** Application-wide error type */
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Storage key enum for AsyncStorage consistency */
export enum StorageKeys {
  THEME_PREFERENCE = '@auxfin_theme_preference',
  CAPTURED_PHOTO = '@auxfin_pokedex_captured_photo',
  USER_PROFILE = '@auxfin_user_profile',
  ONBOARDING_COMPLETE = '@auxfin_onboarding_complete',
}
