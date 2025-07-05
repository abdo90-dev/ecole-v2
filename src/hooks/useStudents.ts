import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, realtimeDb } from '../lib/firebase';
import { Student, User, Specialty } from '../types';
import { child, get, push, ref, remove, set, update } from 'firebase/database';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const dbRef = ref(realtimeDb);

      // Fetch students
      const studentsSnap = await get(child(dbRef, 'students'));
      const studentsVal = studentsSnap.val() || {};

      const studentList: Student[] = Object.entries(studentsVal).map(([id, data]: any) => ({
        id,
        ...(data as Omit<Student, 'id'>),
      }));

      // Fetch related users
      const usersSnap = await get(child(dbRef, 'users'));
      const usersVal = usersSnap.val() || {};
      const usersMap: Record<string, User> = {};
      for (const [uid, user] of Object.entries(usersVal)) {
        usersMap[uid] = { id: uid, ...(user as Omit<User, 'id'>) };
      }

      // Fetch specialties
      const specialtiesSnap = await get(child(dbRef, 'specialties'));
      const specialtiesVal = specialtiesSnap.val() || {};
      const specialtiesMap: Record<string, Specialty> = {};
      for (const [sid, spec] of Object.entries(specialtiesVal)) {
        specialtiesMap[sid] = { id: sid, ...(spec as Omit<Specialty, 'id'>) };
      }

      // Merge profile and specialty into students
      const enrichedStudents = studentList.map(student => ({
        ...student,
        profile: usersMap[student.profile_id],
        specialty: specialtiesMap[student.specialty_id],
      }));

      setStudents(enrichedStudents);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur de chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

const createStudent = async (
  studentData: Omit<Student, 'id' | 'created_at' | 'updated_at' | 'profile_id' | 'profile' | 'specialty'> & {
    email: string;
    first_name: string;
    last_name: string;
  }
) => {
  try {
    const timestamp = new Date().toISOString();

    // Step 1: Create user
    const usersRef = ref(realtimeDb, 'users');
    const newUserRef = push(usersRef);
    const newUser = {
      email: studentData.email,
      first_name: studentData.first_name,
      last_name: studentData.last_name,
      role: 'student',
      created_at: timestamp,
      updated_at: timestamp,
    };
    await set(newUserRef, newUser);

    // Step 2: Create student linked to the new user
    const studentsRef = ref(realtimeDb, 'students');
    const newStudentRef = push(studentsRef);
    const newStudent = {
      student_number: studentData.student_number,
      birth_date: studentData.birth_date,
      phone: studentData.phone,
      address: studentData.address,
      specialty_id: studentData.specialty_id,
      year: studentData.year,
      status: studentData.status,
      profile_id: newUserRef.key,
      created_at: timestamp,
      updated_at: timestamp,
    };
    await set(newStudentRef, newStudent);

    // Optional: Refresh list
    await fetchStudents();

    return newStudentRef.key;
  } catch (err) {
    console.error('Error creating student:', err);
    throw err;
  }
};


const updateStudent = async (id: string, studentData: Partial<Student> & {
  email?: string;
  first_name?: string;
  last_name?: string;
}) => {
  try {
    const timestamp = new Date().toISOString();

    // Update student node
    const studentRef = ref(realtimeDb, `students/${id}`);
    const updatedStudentData = {
      phone: studentData.phone,
      address: studentData.address,
      birth_date: studentData.birth_date,
      specialty_id: studentData.specialty_id,
      status: studentData.status,
      year: studentData.year,
      updated_at: timestamp,
    };
    await update(studentRef, updatedStudentData);

    // Fetch student to get profile_id
    const snap = await get(studentRef);
    const student = snap.val();
    const profileId = student?.profile_id;

    if (profileId) {
      const userRef = ref(realtimeDb, `users/${profileId}`);
      const updatedUserData = {
        email: studentData.email,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        updated_at: timestamp,
      };
      await update(userRef, updatedUserData);
    }

  } catch (err) {
    console.error('Error updating student:', err);
    throw err;
  }
};

const deleteStudent = async (id: string) => {
  try {
    // Get profile_id before deleting student
    const studentSnap = await get(ref(realtimeDb, `students/${id}`));
    const student = studentSnap.val();

    if (!student) throw new Error('Étudiant introuvable');

    const profileId = student.profile_id;

    // Delete student record
    await remove(ref(realtimeDb, `students/${id}`));

    // Delete related user record
    if (profileId) {
      await remove(ref(realtimeDb, `users/${profileId}`));
    }

  } catch (err) {
    console.error('Error deleting student:', err);
    throw err;
  }
};


  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
