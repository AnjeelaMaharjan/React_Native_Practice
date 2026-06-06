import { useState, useEffect, useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { storageService, CapturedPhoto } from '../services/storageService';
import { logger } from '@/utils/logger';

/**
 * Custom Hook: useCameraStorage.
 * Manages Expo Camera permissions, captures photos, supports importing from device library,
 * manages a list of captured images, handles editing metadata/captions, deleting, and
 * saving to device gallery using expo-media-library.
 */
export const useCameraStorage = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isHydrating, setIsHydrating] = useState<boolean>(true);
  
  const cameraRef = useRef<CameraView>(null);

  // 1. Rehydrate photos from AsyncStorage on app load
  useEffect(() => {
    const loadSavedPhotos = async () => {
      try {
        const savedPhotos = await storageService.getPhotos();
        setPhotos(savedPhotos);
      } catch (err) {
        logger.error('[useCameraStorage] Failed to rehydrate photo list:', err);
      } finally {
        setIsHydrating(false);
      }
    };

    loadSavedPhotos();
  }, []);

  // 2. Toggle camera facing side
  const toggleCameraFacing = (): void => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  // 3. Capture photo and append to state & local storage
  const takePhoto = async (): Promise<void> => {
    if (!cameraRef.current) {
      logger.warn('[useCameraStorage] Camera ref is null. Take photo cancelled.');
      return;
    }

    try {
      logger.info('[useCameraStorage] Capturing snapshot...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });

      if (photo?.uri) {
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          uri: photo.uri,
          timestamp: new Date().toLocaleString(),
          notes: '',
        };

        const updatedList = [newPhoto, ...photos];
        setPhotos(updatedList);
        setIsCameraActive(false); // Close viewfinder
        await storageService.savePhotos(updatedList);
      }
    } catch (error) {
      logger.error('[useCameraStorage] Error capturing photo:', error);
    }
  };

  // 4. Import/pick a photo from the system library
  const pickPhotoFromLibrary = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedUri = result.assets[0].uri;
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          uri: pickedUri,
          timestamp: new Date().toLocaleString(),
          notes: 'Imported from Library',
        };

        const updatedList = [newPhoto, ...photos];
        setPhotos(updatedList);
        await storageService.savePhotos(updatedList);
      }
    } catch (error) {
      logger.error('[useCameraStorage] Error selecting photo from gallery:', error);
    }
  };

  // 5. Replace an existing photo with one from camera or library
  const replacePhoto = async (id: string): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newUri = result.assets[0].uri;
        const updatedList = photos.map((p) =>
          p.id === id ? { ...p, uri: newUri, timestamp: new Date().toLocaleString() } : p
        );
        setPhotos(updatedList);
        await storageService.savePhotos(updatedList);
        logger.info('[useCameraStorage] Replaced image URI for item ID:', id);
      }
    } catch (error) {
      logger.error('[useCameraStorage] Error replacing photo:', error);
    }
  };

  // 6. Delete a specific photo
  const deletePhoto = async (id: string): Promise<void> => {
    try {
      const updatedList = photos.filter((p) => p.id !== id);
      setPhotos(updatedList);
      await storageService.savePhotos(updatedList);
      logger.info('[useCameraStorage] Deleted photo ID:', id);
    } catch (error) {
      logger.error('[useCameraStorage] Error deleting photo:', error);
    }
  };

  // 7. Clear all photos
  const clearAllPhotos = async (): Promise<void> => {
    try {
      setPhotos([]);
      await storageService.clearPhotos();
      logger.info('[useCameraStorage] Cleared all photos successfully');
    } catch (error) {
      logger.error('[useCameraStorage] Error clearing all photos:', error);
    }
  };

  // 8. Edit/update description metadata notes of a photo
  const editPhotoNotes = async (id: string, notes: string): Promise<void> => {
    try {
      const updatedList = photos.map((p) =>
        p.id === id ? { ...p, notes } : p
      );
      setPhotos(updatedList);
      await storageService.savePhotos(updatedList);
      logger.info('[useCameraStorage] Updated notes for photo ID:', id);
    } catch (error) {
      logger.error('[useCameraStorage] Error editing photo notes:', error);
    }
  };

  // 9. Save a specific photo to the permanent device gallery
  const savePhotoToGallery = async (uri: string): Promise<boolean> => {
    try {
      let isGranted = mediaPermission?.granted;
      
      if (!isGranted) {
        const req = await requestMediaPermission();
        isGranted = req.granted;
      }

      if (!isGranted) {
        logger.warn('[useCameraStorage] Media library write permission denied');
        return false;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      logger.info('[useCameraStorage] Saved photo to phone gallery:', uri);
      return true;
    } catch (error) {
      logger.error('[useCameraStorage] Error saving to photo gallery:', error);
      return false;
    }
  };

  const openCamera = (): void => setIsCameraActive(true);
  const closeCamera = (): void => setIsCameraActive(false);

  return {
    cameraPermission,
    requestCameraPermission,
    mediaPermission,
    requestMediaPermission,
    photos,
    isCameraActive,
    facing,
    isHydrating,
    cameraRef,
    toggleCameraFacing,
    takePhoto,
    pickPhotoFromLibrary,
    replacePhoto,
    deletePhoto,
    clearAllPhotos,
    editPhotoNotes,
    savePhotoToGallery,
    openCamera,
    closeCamera,
  };
};

export default useCameraStorage;
