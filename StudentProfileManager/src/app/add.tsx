import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StudentForm } from '../components/StudentForm';
import { useStudents } from '../hooks/useStudents';

/**
 * Screen component for adding a student profile.
 * 
 * Concept:
 * - Uses the useStudents custom hook to execute the Drizzle insertion.
 * - Displays database errors in a banner if they arise (e.g. duplicate email).
 * - Redirects the user back to the list screen upon success.
 */
export default function AddStudentScreen() {
  const router = useRouter();
  const { addStudent, loading, error } = useStudents();

  const handleSubmit = async (values: any) => {
    try {
      await addStudent({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        faculty: values.faculty,
        semester: values.semester,
        imageUri: values.imageUri,
      });
      router.back();
    } catch (err) {
      console.error('Failed to create student:', err);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Saving Profile...</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}
      <StudentForm onSubmit={handleSubmit} submitButtonText="Register Student" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
});
