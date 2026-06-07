import { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StudentForm } from '@/components/StudentForm'; // Fixed import
import { useStudents } from '@/hooks/useStudents';

/**
 * Dynamic Screen Route for updating a student profile.
 * 
 * Concept:
 * - Uses dynamic route parameters [id] via useLocalSearchParams.
 * - Queries the student record from SQLite using getStudentById.
 * - Passes the fetched data as initial values to StudentForm.
 * - Submits modifications to SQLite, then routes back.
 */
export default function EditStudentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const studentId = parseInt(id as string, 10);

  const { fetchStudentById, updateStudent, currentStudent, loading, error } = useStudents();

  useEffect(() => {
    if (!isNaN(studentId)) {
      fetchStudentById(studentId);
    }
  }, [studentId, fetchStudentById]);

  const handleSubmit = async (values: any) => {
    try {
      await updateStudent(studentId, {
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
      console.error('Failed to update student:', err);
    }
  };

  if (loading && !currentStudent) {
    return (
      <>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Fetching details...</Text>
        </View>
      </>
    );
  }

  if (error || !currentStudent) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error || 'Student not found.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StudentForm
        initialValues={{
          fullName: currentStudent.fullName,
          email: currentStudent.email,
          phone: currentStudent.phone,
          address: currentStudent.address,
          faculty: currentStudent.faculty,
          semester: currentStudent.semester,
          imageUri: currentStudent.imageUri,
        }}
        onSubmit={handleSubmit}
        submitButtonText="Save Changes"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
