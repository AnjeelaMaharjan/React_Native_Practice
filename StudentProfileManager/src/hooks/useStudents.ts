import { useState, useCallback } from 'react';
import { studentService } from '../services/studentService';
import { NewStudent, Student } from '../db/schema';

/**
 * Custom hook for student state management and actions.
 * Integrates error handling and loading indicators with our database service.
 */
export function useStudents() {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches students from the database.
   */
  const fetchStudents = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudents(searchQuery);
      setStudentsList(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches a single student profile by its unique ID.
   */
  const fetchStudentById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudentById(id);
      if (data) {
        setCurrentStudent(data);
      } else {
        setError('Student profile not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds a student to the database and re-fetches the list.
   */
  const addStudent = useCallback(async (student: NewStudent) => {
    setLoading(true);
    setError(null);
    try {
      const newStudent = await studentService.createStudent(student);
      await fetchStudents();
      return newStudent;
    } catch (err: any) {
      setError(err.message || 'Failed to add student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  /**
   * Updates an existing student record and re-fetches the list.
   */
  const updateStudent = useCallback(async (id: number, data: Partial<NewStudent>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await studentService.updateStudent(id, data);
      await fetchStudents();
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  /**
   * Deletes a student record and re-fetches the list.
   */
  const deleteStudent = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await studentService.deleteStudent(id);
      await fetchStudents();
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStudents]);

  return {
    studentsList,
    currentStudent,
    loading,
    error,
    fetchStudents,
    fetchStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}
