import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

const PHOTO_STORAGE_KEY = '@auxfin_pokedex_captured_photo';

/**
 * Service: Camera Storage.
 * Encapsulates read/write operations for React Native AsyncStorage.
 * Prevents side-effects in component render cycles.
 */
export const storageService = {
  /**
   * Save a file URI or base64 photo string locally.
   */
  saveCapturedPhoto: async (uri: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(PHOTO_STORAGE_KEY, uri);
      logger.info('[StorageService] Successfully saved photo URI to local storage:', uri);
    } catch (error) {
      logger.error('[StorageService] Error saving photo URI to local storage:', error);
      throw error;
    }
  },

  /**
   * Fetch the last saved photo URI.
   */
  getCapturedPhoto: async (): Promise<string | null> => {
    try {
      const uri = await AsyncStorage.getItem(PHOTO_STORAGE_KEY);
      logger.info('[StorageService] Rehydrated photo URI:', uri);
      return uri;
    } catch (error) {
      logger.error('[StorageService] Error loading photo URI from local storage:', error);
      return null;
    }
  },

  /**
   * Clear captured photo.
   */
  clearCapturedPhoto: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(PHOTO_STORAGE_KEY);
      logger.info('[StorageService] Cleared photo URI from local storage');
    } catch (error) {
      logger.error('[StorageService] Error clearing photo URI:', error);
      throw error;
    }
  },
};

export default storageService;
