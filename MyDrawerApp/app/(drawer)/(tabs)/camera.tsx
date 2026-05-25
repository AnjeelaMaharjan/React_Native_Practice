import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { CameraView } from 'expo-camera';
import { useCameraStorage } from '@/features/camera/hooks/useCameraStorage';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/organisms/Header';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';

/**
 * Screen: Camera & Local Storage.
 * Captures photos via expo-camera and persists path string locally in AsyncStorage.
 * Photo rehydrates automatically on launch.
 */
export const CameraScreen = () => {
  const { colors, isDark } = useTheme();
  const {
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
  } = useCameraStorage();

  // 1. Loading screen while rehydrating photo state
  if (isHydrating) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 2. Render permission request UI if not authorized
  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Native Camera" />
        <View style={[styles.content, styles.centered]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Native Camera" />
        <View style={[styles.content, styles.permissionContainer]}>
          <Ionicons name="camera-reverse-outline" size={64} color={colors.primary} style={styles.iconSpacing} />
          <Text style={[styles.title, { color: colors.text }]}>Camera Permission Required</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            This application requires access to your camera to take snapshots for your internship project profile.
          </Text>
          <TouchableOpacity
            style={[styles.btnAction, { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.btnActionText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 3. Render Camera Viewfinder overlay
  if (isCameraActive) {
    return (
      <View style={styles.container}>
        <CameraView style={StyleSheet.absoluteFillObject} facing={facing} ref={cameraRef}>
          <View style={styles.cameraOverlay}>
            
            {/* Viewfinder Top Controls */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.cameraHeaderBtn} onPress={closeCamera} activeOpacity={0.7}>
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.cameraHeaderText}>Viewfinder</Text>
              <TouchableOpacity style={styles.cameraHeaderBtn} onPress={toggleCameraFacing} activeOpacity={0.7}>
                <Ionicons name="camera-reverse" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Viewfinder Bottom Controls */}
            <View style={styles.cameraFooter}>
              <TouchableOpacity style={styles.shutterBtn} onPress={takePhoto} activeOpacity={0.6}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>
            </View>

          </View>
        </CameraView>
      </View>
    );
  }

  // 4. Standard Gallery/Preview UI
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Camera Storage" />

      <View style={styles.content}>
        {photoUri ? (
          // Captured Snapshot Preview (Rehydrated on app load!)
          <View style={[styles.previewWrapper, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
            
            <View style={styles.previewDetails}>
              <Text style={[styles.previewTitle, { color: colors.text }]}>Last Local Snapshot</Text>
              <Text style={[styles.previewStatus, { color: colors.textSecondary }]}>
                Saved Path: {photoUri.substring(0, 35)}...
              </Text>
              
              <View style={styles.previewActionRow}>
                <TouchableOpacity
                  style={[styles.btnActionSecondary, { borderColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
                  onPress={openCamera}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera" size={16} color={colors.primary} />
                  <Text style={[styles.btnActionSecondaryText, { color: colors.primary }]}>Retake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btnActionDanger, { borderRadius: BORDER_RADIUS.md }]}
                  onPress={clearPhoto}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color="#FFF" />
                  <Text style={styles.btnActionDangerText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          // Illustrative placeholder when no photo exists
          <View style={[styles.placeholderCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Ionicons name="image-outline" size={60} color={colors.textSecondary} style={styles.iconSpacing} />
            <Text style={[styles.placeholderTitle, { color: colors.text }]}>No Captured Snapshot</Text>
            <Text style={[styles.placeholderDesc, { color: colors.textSecondary }]}>
              Take a snapshot utilizing Expo Camera. Your photo URI will be cached and rehydrated locally on app load.
            </Text>
            
            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
              onPress={openCamera}
              activeOpacity={0.8}
            >
              <Ionicons name="camera-outline" size={20} color="#FFF" />
              <Text style={styles.btnActionText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  permissionContainer: {
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconSpacing: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  btnActionText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: 100,
  },
  cameraHeaderText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cameraHeaderBtn: {
    padding: SPACING.sm,
  },
  cameraFooter: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  previewWrapper: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  previewImage: {
    width: '100%',
    height: 300,
  },
  previewDetails: {
    padding: SPACING.md,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewStatus: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  previewActionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  btnActionSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    height: 44,
    gap: SPACING.xs,
  },
  btnActionSecondaryText: {
    fontWeight: '700',
  },
  btnActionDanger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    height: 44,
    gap: SPACING.xs,
  },
  btnActionDangerText: {
    color: '#FFF',
    fontWeight: '700',
  },
  placeholderCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  placeholderDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
});

export default CameraScreen;
