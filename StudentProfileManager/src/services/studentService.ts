import { db } from '../db';
import { students, NewStudent, Student } from '../db/schema';
import { eq, desc, like } from 'drizzle-orm';

/**
 * Service class handling database access logic for students.
 * Isolates UI logic from Drizzle queries.
 */
export const studentService = {
  /**
   * Inserts a new student into the database.
   */
  async createStudent(student: NewStudent): Promise<Student> {
    const result = await db.insert(students).values(student).returning();
    if (!result || result.length === 0) {
      throw new Error('Failed to create student record');
    }
    return result[0];
  },

  /**
   * Fetches students from the database.
   * - Supports searching by name (using like operator).
   * - Always orders by latest (createdAt descending).
   */
  async getStudents(searchQuery?: string): Promise<Student[]> {
    if (searchQuery) {
      return await db
        .select()
        .from(students)
        .where(like(students.fullName, `%${searchQuery}%`))
        .orderBy(desc(students.createdAt));
    }
    return await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt));
  },

  /**
   * Fetches a single student profile by its unique ID.
   */
  async getStudentById(id: number): Promise<Student | undefined> {
    const result = await db
      .select()
      .from(students)
      .where(eq(students.id, id));
    return result[0];
  },

  /**
   * Updates an existing student record.
   */
  async updateStudent(id: number, data: Partial<NewStudent>): Promise<Student> {
    const result = await db
      .update(students)
      .set(data)
      .where(eq(students.id, id))
      .returning();
      
    if (!result || result.length === 0) {
      throw new Error('Failed to update student record');
    }
    return result[0];
  },

  /**
   * Deletes a student record by ID.
   */
  async deleteStudent(id: number): Promise<void> {
    await db
      .delete(students)
      .where(eq(students.id, id));
  },
};
