import { useState, useEffect, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { storageService } from '../services/storageService';
import { logger } from '@/utils/logger';

/**
 * Custom Hook: useCameraStorage.
 * Manages Expo Camera permissions, handles picture captures via refs,
 * and synchronizes/rehydrates photo URIs with AsyncStorage.
 */
export const useCameraStorage = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isHydrating, setIsHydrating] = useState<boolean>(true);
  
  const cameraRef = useRef<CameraView>(null);

  // 1. Rehydrate saved photo from local storage on app load
  useEffect(() => {
    const rehydratePhoto = async () => {
      try {
        const savedUri = await storageService.getCapturedPhoto();
        if (savedUri) {
          setPhotoUri(savedUri);
        }
      } catch (err) {
        logger.error('[useCameraStorage] Failed to rehydrate photo:', err);
      } finally {
        setIsHydrating(false);
      }
    };

    rehydratePhoto();
  }, []);

  // 2. Toggle camera lens orientation
  const toggleCameraFacing = (): void => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // 3. Take photo, save local file URI, and persist in AsyncStorage
  const takePhoto = async (): Promise<void> => {
    if (!cameraRef.current) {
      logger.warn('[useCameraStorage] Camera ref is null. Take photo cancelled.');
      return;
    }

    try {
      logger.info('[useCameraStorage] Taking photo...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setIsCameraActive(false); // turn off camera view
        await storageService.saveCapturedPhoto(photo.uri);
      }
    } catch (error) {
      logger.error('[useCameraStorage] Error during takePhoto:', error);
    }
  };

  // 4. Clear photo states locally and in storage
  const clearPhoto = async (): Promise<void> => {
    try {
      setPhotoUri(null);
      await storageService.clearCapturedPhoto();
    } catch (error) {
      logger.error('[useCameraStorage] Error clearing photo:', error);
    }
  };

  const openCamera = (): void => setIsCameraActive(true);
  const closeCamera = (): void => setIsCameraActive(false);

  return {
    permission,
    requestPermission,
    photoUri,
    isCameraActive,
    facing,
    isHydrating,
    cameraRef,
    toggleCameraFacing,
    takePhoto,
    clearPhoto,
    openCamera,
    closeCamera,
  };
};

export default useCameraStorage;
