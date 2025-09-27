
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User,
  getRedirectResult,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserRole } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const router = useRouter();

  // Handle redirect result from Google Sign-In
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const firebaseUser = result.user;
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: 'user', // Default role
            });
          }
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error getting redirect result:', error);
      } finally {
        // This signifies that the initial redirect check is complete.
        setIsAuthenticating(false);
      }
    };

    checkRedirectResult();
  }, [router]);


  // Listen for general auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Only set loading to true if we are not in the initial auth check.
      if (!isAuthenticating) {
        setLoading(true);
      }
      
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || 'user');
        } else {
          // This case might be redundant if the redirect logic handles it, but it's a good fallback.
          await setDoc(userDocRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user',
          });
          setUserRole('user');
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      
      // We are done loading once the initial auth check is complete and onAuthStateChanged has run at least once.
      if (!isAuthenticating) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isAuthenticating]);

  // Combine the loading states
  const finalLoading = loading || isAuthenticating;

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = { user, userRole, loading: finalLoading, signInWithGoogle, logout };

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
  }, [user, loading, router])


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
