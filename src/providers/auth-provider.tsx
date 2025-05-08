
"use client";

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import type { Auth as FirebaseAuth } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  firebaseAuth: FirebaseAuth;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { user, loading, firebaseAuth: auth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
