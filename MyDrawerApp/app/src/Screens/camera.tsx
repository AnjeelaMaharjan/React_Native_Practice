import React, { useState, useRef, useEffect, FC } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

interface Photo {
  uri: string;
  id: string;
}

const Camera: FC = () => {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [capturedPhotos, setCapturedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(true);

  // Request permissions on mount
  useEffect((): void => {
    const setupPermissions = async () => {
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }
      if (!mediaPermission?.granted) {
        await requestMediaPermission();
      }
    };
    setupPermissions();
  }, );

  // Handle camera permission denied
  if (cameraPermission && cameraPermission.granted === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>📷 Camera access is required</Text>
          <Text style={styles.permissionSubtext}>
            We need camera permission to take photos
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (!cameraPermission || !cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Setting up camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Capture photo
  const handleCapture = async (): Promise<void> => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera reference not available');
      return;
    }

    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo) throw new Error('Failed to capture photo');

      // Save to media library
      if (mediaPermission && mediaPermission.granted) {
        try {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        } catch (err) {
          console.warn('Could not save to library:', err);
        }
      }

      // Add to local gallery
      setCapturedPhotos([
        { uri: photo.uri, id: Date.now().toString() },
        ...capturedPhotos,
      ]);

      Alert.alert('Success', 'Photo captured! ✅');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Capture Error', errorMessage);
      console.error('Capture error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle camera facing
  const toggleFacing = (): void => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Delete photo from gallery
  const deletePhoto = (id: string): void => {
    setCapturedPhotos(capturedPhotos.filter((photo) => photo.id !== id));
  };

  // Clear all photos
  const clearAll = (): void => {
    Alert.alert('Clear All', 'Delete all captured photos?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setCapturedPhotos([]),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {showCamera ? (
        <>
          {/* Camera View */}
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              onMountError={(error) => {
                console.error('Camera mount error:', error);
                Alert.alert('Camera Error', error.message);
              }}
            >
              {/* Top Status Bar */}
              <View style={styles.topBar}>
                <Text style={styles.statusText}>
                  {facing === 'back' ? '📷 Rear Camera' : '🤳 Front Camera'}
                </Text>
              </View>

              {/* Bottom Controls Overlay */}
              <View style={styles.bottomOverlay}>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => setShowCamera(false)}
                >
                  <Text style={styles.smallButtonText}>📂 Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.toggleButtonOverlay}
                  onPress={toggleFacing}
                  disabled={isLoading}
                >
                  <Text style={styles.toggleButtonText}>🔄</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.flashButton}
                  onPress={() => {}}
                >
                  <Text style={styles.flashButtonText}>⚡</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>

          {/* Main Controls Below Camera */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.captureButton, isLoading && styles.disabledButton]}
              onPress={handleCapture}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.captureButtonText}>●</Text>
              )}
            </TouchableOpacity>

            <View style={styles.photoCountBadge}>
              <Text style={styles.photoCountText}>{capturedPhotos.length}</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Gallery View */}
          <View style={styles.galleryHeader}>
            <TouchableOpacity onPress={() => setShowCamera(true)}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.galleryHeaderTitle}>
              Gallery ({capturedPhotos.length})
            </Text>
            {capturedPhotos.length > 0 && (
              <TouchableOpacity onPress={clearAll}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {capturedPhotos.length > 0 ? (
            <ScrollView style={styles.galleryGrid} showsVerticalScrollIndicator={false}>
              <View style={styles.photoGrid}>
                {capturedPhotos.map((photo) => (
                  <View key={photo.id} style={styles.photoGridItem}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.photoGridImage}
                    />
                    <TouchableOpacity
                      style={styles.photoDeleteButton}
                      onPress={() => deletePhoto(photo.id)}
                    >
                      <Text style={styles.photoDeleteText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyGallery}>
              <Text style={styles.emptyGalleryText}>📸 No photos yet</Text>
              <Text style={styles.emptyGallerySubtext}>
                Go back and capture some photos
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  smallButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  smallButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleButtonOverlay: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 20,
  },
  flashButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButtonText: {
    fontSize: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 16,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  captureButtonText: {
    fontSize: 40,
    color: '#FFF',
    fontWeight: 'bold',
  },
  photoCountBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  photoCountText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  galleryHeaderTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  galleryGrid: {
    flex: 1,
    backgroundColor: '#000',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  photoGridItem: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  photoGridImage: {
    width: '100%',
    height: 180,
  },
  photoDeleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  photoDeleteText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyGallery: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyGalleryText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyGallerySubtext: {
    color: '#999',
    fontSize: 14,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionSubtext: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 12,
  },
});

export default Camera;