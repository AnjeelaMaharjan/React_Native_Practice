import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

export interface CapturedPhoto {
  id: string;
  uri: string;
  timestamp: string;
  notes?: string;
}

const PHOTOS_STORAGE_KEY = '@captured_photo_list';

/**
 * Service: Camera Storage.
 * Encapsulates read/write operations for React Native AsyncStorage.
 * Supports storing, loading, and clearing an array of captured photos.
 */
export const storageService = {
  /**
   * Save the entire array of captured photo objects.
   */
  savePhotos: async (photos: CapturedPhoto[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
      logger.info('[StorageService] Successfully saved photo list, size:', photos.length);
    } catch (error) {
      logger.error('[StorageService] Error saving photo list to local storage:', error);
      throw error;
    }
  },

  /**
   * Fetch the list of saved photo objects.
   */
  getPhotos: async (): Promise<CapturedPhoto[]> => {
    try {
      const data = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
      if (data) {
        const photos = JSON.parse(data) as CapturedPhoto[];
        logger.info('[StorageService] Loaded photos list, size:', photos.length);
        return photos;
      }
      return [];
    } catch (error) {
      logger.error('[StorageService] Error loading photos list from local storage:', error);
      return [];
    }
  },

  /**
   * Clear all captured photos from storage.
   */
  clearPhotos: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(PHOTOS_STORAGE_KEY);
      logger.info('[StorageService] Cleared all photos from local storage');
    } catch (error) {
      logger.error('[StorageService] Error clearing photos list:', error);
      throw error;
    }
  },
};

export default storageService;
