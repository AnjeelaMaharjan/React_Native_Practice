import React, { useState } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from 'react-native';
import { Header } from '@/components/organisms/Header';
import { useTheme } from '@/context/ThemeContext';
import { SPACING, BORDER_RADIUS } from '@/styles/spacing';
import { Ionicons } from '@expo/vector-icons';

/**
 * Screen: Profile.
 * Renders user profile information and dynamic modal options with theme configurations.
 */
export const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Ionicons name="person-circle-outline" size={80} color={colors.primary} style={styles.avatarIcon} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Anjeela Maharjan</Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              React Native Intern
            </Text>

            <TouchableOpacity
              style={[styles.btnAction, { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnActionText}>Open Profile Modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)' }]}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onStartShouldSetResponder={() => true} // stop propagation
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Profile Details</Text>
            <Text style={[styles.modalBody, { color: colors.textSecondary }]}>
              This is a modal showing more details. 
              The application is configured using a modular Feature-First Architecture and strictly typed with TypeScript.
            </Text>

            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: colors.primary, borderRadius: BORDER_RADIUS.md }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Close Modal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  card: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    elevation: 3,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarIcon: {
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.xl,
  },
  btnAction: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActionText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 340,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  modalCloseBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default ProfileScreen;
