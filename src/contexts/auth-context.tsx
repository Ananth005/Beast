
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserRole } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

// Define a mock user type that can be used for bypassing login
type MockUser = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
};

interface AuthContextType {
  user: User | MockUser | null;
  userRole: UserRole | null;
  loading: boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This effect now only handles initial loading state and cleanup.
    // The onAuthStateChanged listener is removed to allow for manual user session control.
    setLoading(false);

    // If you want to re-enable Firebase authentication, you can add the
    // onAuthStateChanged listener back here.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!user && firebaseUser) {
             // To prevent overriding the manual login
        }
    });

    return () => unsubscribe();
  }, [user]);

  const loginAsRole = (role: UserRole) => {
    setLoading(true);
    const mockUser: MockUser = {
      uid: role === 'owner' ? 'owner-mock-uid' : 'user-mock-uid',
      email: `${role}@example.com`,
      displayName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      photoURL: `https://picsum.photos/seed/${role}/100/100`,
    };
    setUser(mockUser);
    setUserRole(role);
    setLoading(false);
    router.push('/dashboard');
  };


  const logout = async () => {
    // Reset manual user state
    setUser(null);
    setUserRole(null);
    // Also sign out from Firebase if a real session existed
    await signOut(auth);
    router.push('/');
  };

  const value = { user, userRole, loading, loginAsRole, logout };

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This component will be used in layouts to protect routes
export const AuthGuard = ({ children, roles }: { children: React.ReactNode, roles?: UserRole[] }) => {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
        router.push('/');
    }
  }, [user, loading, router]);


  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="space-y-4 w-full max-w-md p-8">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-32" />
            <Skeleton className="h-80" />
          </div>
        </div>
    );
  }

  if (!user) {
    // If not loading and no user, we are about to redirect, so don't render children
    return null;
  }
  
  if (roles && userRole && !roles.includes(userRole)) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>You are not authorized to view this page.</p>
        </div>
    )
  }

  return <>{children}</>;
};
