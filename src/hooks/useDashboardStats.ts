import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { realtimeDb } from '../lib/firebase'; // Ensure this is your RTDB instance
import { DashboardStats, Student, Specialty } from '../types';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const studentsRef = ref(realtimeDb, 'students');
    const specialtiesRef = ref(realtimeDb, 'specialties');

    let students: Student[] = [];
    let specialties: Specialty[] = [];

    const handleData = () => {
      try {
        setLoading(true);

        onValue(studentsRef, (snapshot) => {
          const studentsData = snapshot.val() || {};
          students = Object.entries(studentsData).map(([id, value]) => ({
            id,
            ...(value as Omit<Student, 'id'>),
          }));

          calculateStats();
        });

        onValue(specialtiesRef, (snapshot) => {
          const specialtiesData = snapshot.val() || {};
          specialties = Object.entries(specialtiesData).map(([id, value]) => ({
            id,
            ...(value as Omit<Specialty, 'id'>),
          }));

          calculateStats();
        });

        const calculateStats = () => {
          if (!students.length || !specialties.length) return;

          const totalStudents = students.length;
          const activeStudents = students.filter(s => s.status === 'active').length;
          const totalSpecialties = specialties.length;

          const thisMonthStart = new Date();
          thisMonthStart.setDate(1);
          thisMonthStart.setHours(0, 0, 0, 0);

          const newStudentsThisMonth = students.filter(s => {
            const created = new Date(s.created_at);
            return created >= thisMonthStart;
          }).length;

          const specialtyMap: Record<string, string> = {};
          specialties.forEach(s => {
            specialtyMap[s.id] = s.name;
          });

          const studentsBySpecialty: Record<string, number> = {};
          const studentsByYear: Record<number, number> = {};
          const studentsByStatus: Record<string, number> = {};

          students.forEach(s => {
            const specialtyName = specialtyMap[s.specialty_id] || 'Unknown';
            studentsBySpecialty[specialtyName] = (studentsBySpecialty[specialtyName] || 0) + 1;

            if (s.year) {
              studentsByYear[s.year] = (studentsByYear[s.year] || 0) + 1;
            }

            if (s.status) {
              studentsByStatus[s.status] = (studentsByStatus[s.status] || 0) + 1;
            }
          });

          setStats({
            totalStudents,
            activeStudents,
            totalSpecialties,
            newStudentsThisMonth,
            studentsBySpecialty: Object.entries(studentsBySpecialty).map(([name, count]) => ({ name, count })),
            studentsByYear: Object.entries(studentsByYear).map(([year, count]) => ({ year: Number(year), count })),
            studentsByStatus: Object.entries(studentsByStatus).map(([status, count]) => ({ status, count })),
          });

          setLoading(false);
        };
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    handleData();

    return () => {
      off(studentsRef);
      off(specialtiesRef);
    };
  }, []);

  return {
    stats,
    loading,
    error,
  };
};
