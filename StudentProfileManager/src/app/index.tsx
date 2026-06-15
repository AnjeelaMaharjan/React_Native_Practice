import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,

} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useStudents } from '../hooks/useStudents';
import { StudentCard } from '../components/StudentCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { studentService } from '../services/studentService';
export default function StudentListScreen() {
  const router = useRouter();
  const { studentsList, loading, fetchStudents, deleteStudent } = useStudents();
  const [searchQuery, setSearchQuery] = useState('');

  // Re-fetch when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchStudents(searchQuery);
    }, [searchQuery])
  );

  // Handle name-based searching
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Navigate to Edit screen (Phase 4)
  const handleEdit = (student: any) => {
    router.push({
      pathname: `/edit/[id]`,
      params: { id: student.id },
    });
  };

  // Delete execution (Phase 5)
  const executeDelete = async (id: number) => {
    try {
      await deleteStudent(id);
    } catch (error) {
      console.error('Failed to delete student:', error);
      Alert.alert('Error', 'Failed to delete student profile.');
    }
  };

  // Delete confirmation dialog (Phase 5)
  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this student profile permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => executeDelete(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search student by name..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✖️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Loading Indicator */}
        {loading && studentsList.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#ee8b2f" />
          </View>
        ) : (
          /* Student FlatList */
          <FlatList
            data={studentsList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <StudentCard student={item} onEdit={handleEdit} onDelete={handleDelete} />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🎓</Text>
                <Text style={styles.emptyTitle}>No students found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery.length > 0
                    ? "Try adjusting your search criteria."
                    : "Tap the button below to add your first student."}
                </Text>
              </View>
            }
          />
        )}

        {/* Floating Action Button (FAB) */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+ Add Student</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#1F2937',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 80, // Space for floating button
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: '#ee8b2f',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ee8b2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
