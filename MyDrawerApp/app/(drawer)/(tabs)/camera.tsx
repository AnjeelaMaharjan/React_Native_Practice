import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Modal,
  TextInput,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { useCameraStorage } from '@/features/camera/hooks/useCameraStorage';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/organisms/Header';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';
import { CapturedPhoto } from '@/features/camera/services/storageService';
// import styles from '@/components/organisms/Drawer/styles/styles';
import { Camerastyles as styles } from '@/styles';

/**
 * Screen: Camera & Local Storage.
 * Captures multiple photos, stores them in local database, allows descriptions editing,
 * replacements, individual saves to phone gallery, and sweeping deletions.
 */
export const CameraScreen = () => {

  const { colors, isDark } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);
  const [editNotesText, setEditNotesText] = useState('');
  const {
    cameraPermission,
    requestCameraPermission,
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
  } = useCameraStorage();

  // State for managing photo detail inspection modal and layouts
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');


  // 1. Loading screen while rehydrating photo state
  if (isHydrating) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 2. Render permission request UI if not authorized
  if (!cameraPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Native Camera" />
        <View style={[styles.content, styles.centered]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!cameraPermission.granted) {
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
            onPress={requestCameraPermission}
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

  // Determine grid column counts based on screen width
  const numColumns = screenWidth >= 1024 ? 4 : screenWidth >= 768 ? 3 : 2;
  const itemSize = (screenWidth - SPACING.md * 2 - SPACING.sm * (numColumns - 1)) / numColumns;

  // Handle opening inspection modal
  const openInspectModal = (photo: CapturedPhoto) => {
    setSelectedPhoto(photo);
    setEditNotesText(photo.notes || '');
  };

  const saveEditedNotes = async () => {
    if (!selectedPhoto) return;
    await editPhotoNotes(selectedPhoto.id, editNotesText);
    setSelectedPhoto({ ...selectedPhoto, notes: editNotesText });
    Alert.alert('Success', 'Photo description updated.');
  };

  const handleExportToGallery = async (uri: string) => {
    const success = await savePhotoToGallery(uri);
    if (success) {
      Alert.alert('Export Complete', 'Photo saved to your phone gallery successfully!');
    } else {
      Alert.alert('Permission Denied', 'Unable to write to phone gallery without permissions.');
    }
  };

  const handleBatchDelete = async () => {
    for (const id of selectedIds) {
      await deletePhoto(id);
    }
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const handleConfirmDeleteSingle = async (id: string) => {
    Alert.alert(
      'Delete Photo',
      'Remove this photo from your dashboard list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePhoto(id);
            setSelectedPhoto(null);
          },
        },
      ]
    );
  };

  const handleReplaceImage = async (id: string) => {
    await replacePhoto(id);
    // Refresh modal info
    const updatedPhotos = photos.find((p) => p.id === id);
    if (updatedPhotos) {
      setSelectedPhoto(updatedPhotos);
    } else {
      setSelectedPhoto(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Camera Storage"
        rightComponent={
          <View style={styles.headerRightActions}>
            {selectionMode ? (
              <>
                <TouchableOpacity onPress={() => { setSelectionMode(false); setSelectedIds([]); }} style={styles.headerCancelBtn} activeOpacity={0.7}>
                  <Ionicons name="close" size={22} color={colors.text} />
                </TouchableOpacity>
                {selectedIds.length > 0 && (
                  <TouchableOpacity onPress={handleBatchDelete} style={styles.headerDeleteBtn} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {photos.length > 0 && (
                  <>
                    <TouchableOpacity onPress={() => setViewMode(prev => prev === 'card' ? 'list' : 'card')} style={styles.headerSelectBtn} activeOpacity={0.7}>
                      <Ionicons name={viewMode === 'card' ? "list-outline" : "grid-outline"} size={22} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectionMode(true)} style={styles.headerSelectBtn} activeOpacity={0.7}>
                      <Ionicons name="checkbox-outline" size={22} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                      Alert.alert(
                        'Clear All',
                        'Are you sure you want to delete all captured photos?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Clear All', style: 'destructive', onPress: clearAllPhotos }
                        ]
                      );
                    }} style={styles.headerSelectBtn} activeOpacity={0.7}>
                      <Ionicons name="trash-bin-outline" size={22} color="#EF4444" />
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </View>
        }
      />

      <FlatList
        data={photos}
        key={viewMode === 'card' ? `grid-${numColumns}` : 'list'}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'card' ? numColumns : 1}
        columnWrapperStyle={viewMode === 'card' && numColumns > 1 ? styles.gridRow : undefined}
        contentContainerStyle={styles.scrollListContent}
        ListHeaderComponent={
          <>
            {/* Floating Panel Controls */}
            <View style={styles.topControlContainer}>
              <TouchableOpacity
                style={[styles.actionCardButton, { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
                onPress={openCamera}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color="#FFF" />
                <Text style={styles.actionCardButtonText}>Take Snapshot</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionCardButton,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: BORDER_RADIUS.md,
                  },
                ]}
                onPress={pickPhotoFromLibrary}
                activeOpacity={0.8}
              >
                <Ionicons name="images-outline" size={20} color={colors.text} />
                <Text style={[styles.actionCardButtonText, { color: colors.text }]}>Import Photo</Text>
              </TouchableOpacity>
            </View>
            {photos.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {viewMode === 'card' ? 'Grid Gallery' : 'List Gallery'} ({photos.length})
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.centeredPlaceholder}>
            <View style={[styles.placeholderCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
              <Ionicons name="images-outline" size={60} color={colors.textSecondary} style={styles.iconSpacing} />
              <Text style={[styles.placeholderTitle, { color: colors.text }]}>No Local Snapshots</Text>
              <Text style={[styles.placeholderDesc, { color: colors.textSecondary }]}>
                Use your native camera to capture photos, or select images from your camera roll. Photos will save locally.
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          if (viewMode === 'card') {
            return (
              <TouchableOpacity
                style={[
                  styles.gridItemCard,
                  {
                    width: itemSize,
                    height: itemSize + 50,
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: BORDER_RADIUS.lg,
                  },
                ]}
                onPress={() => {
                  if (selectionMode) {
                    const already = selectedIds.includes(item.id);
                    setSelectedIds(prev => already ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                  } else {
                    openInspectModal(item);
                  }
                }}
                onLongPress={() => {
                  if (!selectionMode) {
                    setSelectionMode(true);
                    setSelectedIds([item.id]);
                  } else {
                    const already = selectedIds.includes(item.id);
                    setSelectedIds(prev => already ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                  }
                }}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.uri }} style={styles.itemImage} resizeMode="cover" />
                {selectionMode && (
                  <View style={styles.selectionOverlay}>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={24}
                      color={isSelected ? colors.primary : "#FFF"}
                    />
                  </View>
                )}
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemDateText, { color: colors.textSecondary }]} numberOfLines={1}>
                    {item.timestamp.split(',')[0]}
                  </Text>
                  {item.notes ? (
                    <Text style={[styles.itemNotesText, { color: colors.text }]} numberOfLines={1}>
                      {item.notes}
                    </Text>
                  ) : (
                    <Text style={[styles.itemNotesText, { color: colors.textSecondary, fontStyle: 'italic' }]}>Add note...</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                style={[
                  styles.listItemCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: BORDER_RADIUS.lg,
                  },
                ]}
                onPress={() => {
                  if (selectionMode) {
                    const already = selectedIds.includes(item.id);
                    setSelectedIds(prev => already ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                  } else {
                    openInspectModal(item);
                  }
                }}
                onLongPress={() => {
                  if (!selectionMode) {
                    setSelectionMode(true);
                    setSelectedIds([item.id]);
                  } else {
                    const already = selectedIds.includes(item.id);
                    setSelectedIds(prev => already ? prev.filter(id => id !== item.id) : [...prev, item.id]);
                  }
                }}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.uri }} style={styles.listItemImage} resizeMode="cover" />
                <View style={styles.listItemInfo}>
                  <Text style={[styles.itemDateText, { color: colors.textSecondary }]}>
                    {item.timestamp}
                  </Text>
                  {item.notes ? (
                    <Text style={[styles.listItemNotesText, { color: colors.text }]} numberOfLines={2}>
                      {item.notes}
                    </Text>
                  ) : (
                    <Text style={[styles.listItemNotesText, { color: colors.textSecondary, fontStyle: 'italic' }]}>No description added. Tap to inspect.</Text>
                  )}
                </View>
                {selectionMode ? (
                  <View style={styles.listSelectionOverlay}>
                    <Ionicons
                      name={isSelected ? "checkbox" : "square-outline"}
                      size={24}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.listChevron} />
                )}
              </TouchableOpacity>
            );
          }
        }}
      />

      {/* Inspect Detail Modal */}
      {selectedPhoto && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!selectedPhoto}
          onRequestClose={() => setSelectedPhoto(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
              {/* Modal Header */}
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Inspect Snapshot</Text>
                <TouchableOpacity onPress={() => setSelectedPhoto(null)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Scrollable View for Content */}
              <ScrollView contentContainerStyle={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selectedPhoto.uri }} style={styles.modalPreviewImage} resizeMode="contain" />
                
                <View style={styles.modalMetaRow}>
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Captured At:</Text>
                  <Text style={[styles.metaValue, { color: colors.text }]}>{selectedPhoto.timestamp}</Text>
                </View>

                {/* Notes Input Section */}
                <View style={styles.notesSection}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Photo Description / Notes</Text>
                  <TextInput
                    style={[
                      styles.notesInput,
                      {
                        borderColor: colors.border,
                        color: colors.text,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0,0,0,0.01)',
                        borderRadius: BORDER_RADIUS.md,
                      },
                    ]}
                    multiline
                    placeholder="Add some details about this snapshot..."
                    placeholderTextColor={colors.textSecondary}
                    value={editNotesText}
                    onChangeText={setEditNotesText}
                  />
                  <TouchableOpacity
                    style={[styles.notesSaveBtn, { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
                    onPress={saveEditedNotes}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.notesSaveBtnText}>Save Notes</Text>
                  </TouchableOpacity>
                </View>

                {/* Operational Action buttons */}
                <View style={styles.modalOperationsBlock}>
                  <TouchableOpacity
                    style={[styles.btnModalOp, { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
                    onPress={() => handleExportToGallery(selectedPhoto.uri)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="download-outline" size={18} color="#FFF" />
                    <Text style={styles.btnModalOpText}>Save to Gallery</Text>
                  </TouchableOpacity>

                  <View style={styles.splitRow}>
                    <TouchableOpacity
                      style={[styles.btnModalOpSplit, { borderColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
                      onPress={() => handleReplaceImage(selectedPhoto.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="image-outline" size={16} color={colors.primary} />
                      <Text style={[styles.btnModalOpSplitText, { color: colors.primary }]}>Replace</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btnModalOpSplitDanger, { borderRadius: BORDER_RADIUS.md }]}
                      onPress={() => handleConfirmDeleteSingle(selectedPhoto.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FFF" />
                      <Text style={styles.btnModalOpSplitText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default CameraScreen;
