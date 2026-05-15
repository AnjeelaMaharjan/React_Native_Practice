import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
 
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CameraState {
  mode: 'capture' | 'preview' | 'edit';
  photoUri: string | null;
  brightness: number;
  contrast: number;
  saturation: number;
}

export default function Camera() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<CameraState>({
    mode: 'capture',
    photoUri: null,
    brightness: 0,
    contrast: 0,
    saturation: 0,
  });

  const flashOpacity = useRef(new Animated.Value(0)).current;

  // Handle permissions
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>📷 Camera Permission Required</Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Flash effect animation
  const triggerFlash = () => {
    Animated.sequence([
      Animated.timing(flashOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Capture photo
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        triggerFlash();
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: false,
        });

        if (photo?.uri) {
          setState((prev) => ({
            ...prev,
            photoUri: photo.uri,
            mode: 'preview',
            brightness: 0,
            contrast: 0,
            saturation: 0,
          }));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  // Save to localStorage (AsyncStorage)
  const savePhoto = async () => {
    try {
      if (!state.photoUri) return;

      // Get existing photos
      const existingPhotos = await AsyncStorage.getItem('photos');
      const photosArray = existingPhotos ? JSON.parse(existingPhotos) : [];

      // Add new photo with timestamp and edits
      const newPhoto = {
        id: Date.now().toString(),
        uri: state.photoUri,
        timestamp: new Date().toISOString(),
        edits: {
          brightness: state.brightness,
          contrast: state.contrast,
          saturation: state.saturation,
        },
      };

      photosArray.push(newPhoto);
      await AsyncStorage.setItem('photos', JSON.stringify(photosArray));

      Alert.alert('Success', 'Photo saved successfully!');
      resetCamera();
    } catch (error) {
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setState((prev) => ({
      ...prev,
      mode: 'capture',
      photoUri: null,
      brightness: 0,
      contrast: 0,
      saturation: 0,
    }));
  };

  // Reset to camera
  const resetCamera = () => {
    setState({
      mode: 'capture',
      photoUri: null,
      brightness: 0,
      contrast: 0,
      saturation: 0,
    });
  };

  // Edit mode handler
  const enterEditMode = () => {
    setState((prev) => ({ ...prev, mode: 'edit' }));
  };

  // Update edits
  const updateEdit = (key: 'brightness' | 'contrast' | 'saturation', value: number) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Render camera capture mode
  if (state.mode === 'capture') {
    return (
      <SafeAreaView style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <Animated.View
            style={[styles.flashOverlay, { opacity: flashOpacity }]}
          />

          <View style={styles.cameraHeader}>
            <Text style={styles.cameraTitle}>📸</Text>
          </View>

          <View style={styles.cameraFooter}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // Render preview & edit mode
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.previewContainer}>
        {/* Image with filters */}
        <View
          style={[
            styles.imageWrapper,
            {
              opacity: 1 - Math.abs(state.brightness) * 0.3,
            },
          ]}
        >
          <Image
            source={{ uri: state.photoUri || '' }}
            style={[
              styles.previewImage,
              {
                opacity: 1 + state.brightness * 0.1,
              },
            ]}
          />
        </View>

        {/* Edit mode controls */}
        {state.mode === 'edit' && (
          <View style={styles.editControls}>
            {/* Brightness */}
            <View style={styles.controlSlider}>
              <Text style={styles.controlLabel}>☀️ Brightness</Text>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderProgress,
                    {
                      width: `${((state.brightness + 100) / 200) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.controlValue}>
                {state.brightness > 0 ? '+' : ''}{state.brightness}
              </Text>
            </View>

            {/* Contrast */}
            <View style={styles.controlSlider}>
              <Text style={styles.controlLabel}> Contrast</Text>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderProgress,
                    {
                      width: `${((state.contrast + 100) / 200) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.controlValue}>
                {state.contrast > 0 ? '+' : ''}{state.contrast}
              </Text>
            </View>

            {/* Saturation */}
            <View style={styles.controlSlider}>
              <Text style={styles.controlLabel}> Saturation</Text>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderProgress,
                    {
                      width: `${((state.saturation + 100) / 200) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.controlValue}>
                {state.saturation > 0 ? '+' : ''}{state.saturation}
              </Text>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          {state.mode === 'preview' ? (
            <>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={retakePhoto}
              >
                <Text style={styles.buttonText}>↻ Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={enterEditMode}
              >
                <Text style={styles.buttonText}> Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSuccess]}
                onPress={savePhoto}
              >
                <Text style={styles.buttonText}> Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setState((prev) => ({ ...prev, mode: 'preview' }))}
              >
                <Text style={styles.buttonText}> Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSuccess]}
                onPress={savePhoto}
              >
                <Text style={styles.buttonText}> Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '80%',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  cameraHeader: {
   
  height: 80,
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingTop: 20,
  },
  cameraTitle: {
    fontSize: 32,
    opacity: 0.6,
  },
  cameraFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
  editControls: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
    maxHeight: 280,
  },
  controlSlider: {
    gap: 8,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  controlValue: {
    color: '#999',
    fontSize: 12,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#333',
  },
  buttonSuccess: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});