/**
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
  THEME_PREFERENCE = '@theme_preference',
  CAPTURED_PHOTO = '@captured_photo',
  USER_PROFILE = '@user_profile',
  ONBOARDING_COMPLETE = '@onboarding_complete',
}
