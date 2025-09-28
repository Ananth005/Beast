
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc, query, where } from 'firebase/firestore';
import { Member } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const membersCollection = collection(db, 'members');

export async function getMembers(): Promise<Member[]> {
  const snapshot = await getDocs(membersCollection);
  // Map documents from the 'members' collection to the Member type
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || 'No Name',
      email: data.email || 'No Email',
      mobileNumber: data.mobileNumber || '',
      joinDate: data.joinDate || new Date().toISOString(),
      lastVisit: data.lastVisit || new Date().toISOString(),
      membershipStatus: data.membershipStatus || 'active',
      avatarUrl: data.avatarUrl || `https://picsum.photos/seed/${doc.id}/100/100`
    } as Member;
  });
}

export async function addMember(memberData: Omit<Member, 'id' | 'lastVisit' | 'avatarUrl'>): Promise<Member> {
    // This function adds members who do not have a login (e.g., manually by an owner).
    const q = query(membersCollection, where("email", "==", memberData.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("A member with this email already exists.");
    }
    
    const newId = uuidv4();
    const newMember: Member = {
        ...memberData,
        id: newId,
        lastVisit: new Date().toISOString(),
        avatarUrl: `https://picsum.photos/seed/${newId}/100/100`,
    };
    await setDoc(doc(membersCollection, newId), newMember);
    return newMember;
}

export async function updateMember(memberId: string, memberData: Partial<Member>): Promise<void> {
  const memberDoc = doc(db, 'members', memberId);
  await updateDoc(memberDoc, {
      name: memberData.name,
      email: memberData.email,
      mobileNumber: memberData.mobileNumber,
      membershipStatus: memberData.membershipStatus,
      joinDate: memberData.joinDate,
  });

  // Also update the display name in the core 'users' table if it exists
  const userDoc = doc(db, 'users', memberId);
  const userSnap = await getDoc(userDoc);
  if (userSnap.exists()) {
      await updateDoc(userDoc, {
          displayName: memberData.name,
          email: memberData.email
      });
  }
}

export async function deleteMember(memberId: string): Promise<void> {
  // This will delete the member from the 'members' collection.
  // In a full app, you might want to also delete the user from Firebase Auth,
  // which requires admin privileges and is usually done via a Cloud Function.
  const memberDoc = doc(db, 'members', memberId);
  await deleteDoc(memberDoc);

  // For this app, we'll also remove them from the 'users' collection to disable login.
  const userDoc = doc(db, 'users', memberId);
  const userSnap = await getDoc(userDoc);
  if (userSnap.exists()) {
      await deleteDoc(userDoc);
  }
}
