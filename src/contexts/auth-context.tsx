
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserRole, Member } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

// Define a mock user type that can be used for bypassing login
type MockUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

interface AuthContextType {
  user: User | MockUser | null;
  userRole: UserRole | null;
  loading: boolean;
  loginAsRole: (role: UserRole) => void;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  updateUser: (newUserData: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const syncUserToMembers = async (user: User | MockUser, role: UserRole) => {
    const memberDocRef = doc(db, 'members', user.uid);
    const memberDoc = await getDoc(memberDocRef);

    if (!memberDoc.exists()) {
        const newMemberData = {
            id: user.uid,
            name: user.displayName || 'New Member',
            email: user.email || '',
            mobileNumber: '',
            joinDate: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            membershipStatus: 'active',
            avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
        };
        await setDoc(memberDocRef, newMemberData);
    } else {
        await setDoc(memberDocRef, { lastVisit: new Date().toISOString() }, { merge: true });
    }

    // Also ensure the user record exists in the 'users' collection for role management
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
         await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role,
        });
    }
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        let currentRole: UserRole = 'user';

        if (userDoc.exists()) {
          currentRole = userDoc.data().role;
        } else {
          // New user from Google Sign-In, create their record in 'users' collection
          await setDoc(userDocRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user',
          });
        }
        
        setUserRole(currentRole);
        setUser(firebaseUser);
        await syncUserToMembers(firebaseUser, currentRole);
        
        setLoading(false);

      } else {
        setUser(null);
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAsRole = async (role: UserRole) => {
    setLoading(true);
    const mockUid = role === 'owner' ? 'owner-mock-uid' : 'user-mock-uid';
    const mockUser: MockUser = {
      uid: mockUid,
      email: `${role}@example.com`,
      displayName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      photoURL: `https://picsum.photos/seed/${role}/100/100`,
    };
    
    setUser(mockUser);
    setUserRole(role);
    await syncUserToMembers(mockUser, role);
    
    setLoading(false);
    router.push('/dashboard');
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle the rest, including sync
      router.push('/dashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setLoading(false);
    }
  };

  const updateUser = async (newUserData: Partial<MockUser>) => {
    if (user) {
        const updatedUser = { ...user, ...newUserData };
        setUser(updatedUser);
        
        // Update user collection
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { 
            displayName: updatedUser.displayName, 
            photoURL: updatedUser.photoURL 
        }, { merge: true });

        // Update members collection
        const memberDocRef = doc(db, 'members', user.uid);
         await setDoc(memberDocRef, { 
            name: updatedUser.displayName, 
            avatarUrl: updatedUser.photoURL 
        }, { merge: true });
    }
  };


  const logout = async () => {
    // Check if user is a mock user
    const isMockUser = user?.uid.includes('-mock-uid');
    if (!isMockUser) {
        await signOut(auth);
    }
    // Reset all local state
    setUser(null);
    setUserRole(null);
    router.push('/');
  };

  const value = { user, userRole, loading, loginAsRole, loginWithGoogle, logout, updateUser };

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
