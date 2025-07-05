import { useEffect, useState } from 'react';
import {
  getDatabase,
  ref,
  onValue,
  off,
  push,
  set,
  update,
  remove,
} from 'firebase/database';
import { Specialty } from '../types';

export const useSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const db = getDatabase();
  const specialtiesRef = ref(db, 'specialties');

  useEffect(() => {
    const handleValue = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const parsed = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...(value as Omit<Specialty, 'id'>),
        }));
        setSpecialties(parsed);
      } else {
        setSpecialties([]);
      }
      setLoading(false);
    };

    const handleError = (err: any) => {
      setError(err.message);
      setLoading(false);
    };

    onValue(specialtiesRef, handleValue, handleError);

    return () => {
      off(specialtiesRef, 'value', handleValue);
    };
  }, []);

  // 🔹 Create
  const createSpecialty = async (specialtyData: Omit<Specialty, 'id' | 'created_at' | 'updated_at'>) => {
    const newRef = push(specialtiesRef);
    const timestamp = new Date().toISOString();
    await set(newRef, {
      ...specialtyData,
      created_at: timestamp,
      updated_at: timestamp,
    });
  };

  // 🔹 Update
  const updateSpecialty = async (id: string, specialtyData: Partial<Specialty>) => {
    const updates = {
      ...specialtyData,
      updated_at: new Date().toISOString(),
    };
    await update(ref(db, `specialties/${id}`), updates);
  };

  // 🔹 Delete
  const deleteSpecialty = async (id: string) => {
    await remove(ref(db, `specialties/${id}`));
  };

  return {
    specialties,
    loading,
    error,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  };
};
