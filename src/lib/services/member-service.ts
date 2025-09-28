
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc, query, where } from 'firebase/firestore';
import { Member } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

// The 'users' collection is now the source of truth for members who can log in.
// The 'members' collection can be for manually added, non-login members if needed, but for a unified view, we fetch from 'users'.
const usersCollection = collection(db, 'users');
const membersCollection = collection(db, 'members');


export async function getMembers(): Promise<Member[]> {
  const snapshot = await getDocs(usersCollection);
  // Map documents from the 'users' collection to the Member type
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.displayName || 'No Name',
      email: data.email || 'No Email',
      mobileNumber: data.mobileNumber || '',
      joinDate: data.joinDate || new Date().toISOString(),
      lastVisit: data.lastVisit || new Date().toISOString(),
      membershipStatus: data.membershipStatus || 'active',
      avatarUrl: data.photoURL || `https://picsum.photos/seed/${doc.id}/100/100`
    } as Member;
  });
}

export async function addMember(memberData: Omit<Member, 'id' | 'lastVisit' | 'avatarUrl'>): Promise<Member> {
    // This function will now add members to the 'members' collection, for users who do not have a login.
    // In a real app, you'd likely want an invitation flow that creates a Firebase Auth user.
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
  // This needs to update the document in the 'users' collection
  const memberDoc = doc(db, 'users', memberId);
  // Firestore security rules should protect sensitive fields
  await updateDoc(memberDoc, {
      displayName: memberData.name,
      email: memberData.email,
      mobileNumber: memberData.mobileNumber,
      membershipStatus: memberData.membershipStatus,
  });
}

export async function deleteMember(memberId: string): Promise<void> {
  // This should delete the user from the 'users' collection.
  // WARNING: In a real production app, you would also need to delete the user from Firebase Authentication,
  // which requires a privileged backend environment (like a Cloud Function). Deleting only the Firestore
  // document will leave an orphaned auth user who can still log in.
  const memberDoc = doc(db, 'users', memberId);
  await deleteDoc(memberDoc);
}
