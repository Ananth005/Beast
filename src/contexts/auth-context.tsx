
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
import { doc, getDoc, setDoc, getDocs, collection, writeBatch, updateDoc } from 'firebase/firestore';
import type { UserRole, Member, LeaderboardRecord } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { LeaderboardCategory } from '@/app/(main)/leaderboard/page';

// Define a mock user type that can be used for bypassing login
type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

interface AuthContextType {
  user: AppUser | null;
  userRole: UserRole | null;
  loading: boolean;
  loginAsRole: (role: UserRole) => void;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  updateUser: (newUserData: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const syncUserToMembers = async (user: AppUser, role: UserRole) => {
    const memberDocRef = doc(db, 'members', user.uid);
    const memberDoc = await getDoc(memberDocRef);

    if (!memberDoc.exists()) {
        const newMemberData: Member = {
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
  const [user, setUser] = useState<AppUser | null>(null);
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
        let userProfileData: Partial<AppUser> = {};

        if (userDoc.exists()) {
          const dbUser = userDoc.data();
          currentRole = dbUser.role;
          userProfileData = {
              displayName: dbUser.displayName,
              photoURL: dbUser.photoURL,
          };
        } else {
          // New user from Google Sign-In, create their record in 'users' collection
           userProfileData = {
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          await setDoc(userDocRef, {
            email: firebaseUser.email,
            ...userProfileData,
            role: 'user',
          });
        }
        
        const appUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: userProfileData.displayName || firebaseUser.displayName,
            photoURL: userProfileData.photoURL || firebaseUser.photoURL,
        };

        setUserRole(currentRole);
        setUser(appUser);
        await syncUserToMembers(appUser, currentRole);
        
        setLoading(false);

      } else {
        const localMockUser = localStorage.getItem('mockUser');
        const localMockRole = localStorage.getItem('mockRole');
        if(localMockUser && localMockRole) {
            const mockUser = JSON.parse(localMockUser);
            setUser(mockUser);
            setUserRole(localMockRole as UserRole);
        } else {
            setUser(null);
            setUserRole(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAsRole = async (role: UserRole) => {
    setLoading(true);
    const mockUid = role === 'owner' ? 'owner-mock-uid' : 'user-mock-uid';
    const mockUser: AppUser = {
      uid: mockUid,
      email: `${role}@example.com`,
      displayName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      photoURL: `https://picsum.photos/seed/${role}/100/100`,
    };
    
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockRole', role);

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

  const updateUser = async (newUserData: Partial<AppUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);

    const isMockUser = user.uid.includes('-mock-uid');
    if (isMockUser) {
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    } else if (auth.currentUser) {
        // This updates the auth service profile, but Firestore is our source of truth
        try {
          await (auth.currentUser, { 
              displayName: updatedUser.displayName, 
              photoURL: updatedUser.photoURL 
          });
        } catch (error) {
          console.error("Error updating Firebase Auth profile:", error);
        }
    }
    
    const batch = writeBatch(db);

    // 1. Update 'users' collection (Our source of truth)
    const userDocRef = doc(db, 'users', user.uid);
    batch.set(userDocRef, { 
        displayName: updatedUser.displayName, 
        photoURL: updatedUser.photoURL 
    }, { merge: true });

    // 2. Update 'members' collection
    const memberDocRef = doc(db, 'members', user.uid);
    batch.set(memberDocRef, { 
        name: updatedUser.displayName, 
        avatarUrl: updatedUser.photoURL 
    }, { merge: true });

    // 3. Update 'leaderboards' collection
    const leaderboardsCollectionRef = collection(db, 'leaderboards');
    const leaderboardSnapshot = await getDocs(leaderboardsCollectionRef);
    
    leaderboardSnapshot.forEach(leaderboardDoc => {
        const leaderboardData = leaderboardDoc.data() as LeaderboardCategory;
        const records = leaderboardData.records || [];
        
        let recordUpdated = false;
        const updatedRecords = records.map(record => {
            if (record.memberId === user.uid) {
                recordUpdated = true;
                return { 
                    ...record, 
                    memberName: updatedUser.displayName || record.memberName, 
                    memberAvatarUrl: updatedUser.photoURL || record.memberAvatarUrl 
                };
            }
            return record;
        });

        if (recordUpdated) {
            batch.update(leaderboardDoc.ref, { records: updatedRecords });
        }
    });

    await batch.commit();
  };


  const logout = async () => {
    const isMockUser = user?.uid.includes('-mock-uid');
    if (isMockUser) {
        localStorage.removeItem('mockUser');
        localStorage.removeItem('mockRole');
    } else {
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
