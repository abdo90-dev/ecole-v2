import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { User } from '../types';
import { realtimeDb } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: 'admin' | 'student') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
        console.log("user"+firebaseUser);
        
      } else {
        
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
  try {
    const userRef = ref(realtimeDb, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const profileData = snapshot.val();

      setUser({
        id: firebaseUser.uid,
        email: profileData.email || firebaseUser.email || '',
        first_name: profileData.name || '',
        last_name: '', // Add this if it's in your DB
        role: profileData.role || 'student', // Default to student
        created_at: '', // Optional: pull from DB if you have it
        updated_at: '', // Optional
      });
    } else {
      setUser(null);
    }
  } catch (error: any) {
    console.error('Error fetching user profile:', error.message);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserProfile(result.user); // <-- this line is missing!
    console.log('User signed in:', result.user.uid);
  } catch (error: any) {
    throw new Error(error.message);
  }
};


  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: 'admin' | 'student') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = result.user;

      const profileData = {
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

    await setDoc(doc(db, 'profiles', newUser.uid), profileData);

    // ✅ Save to Realtime Database
    await set(ref(realtimeDb, `students/${newUser.uid}`), {
      email,
      name: firstName,
      phone: '', // or pass from UI
      specialty: '', // or pass from UI
      year: '', // or pass from UI
    });    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
