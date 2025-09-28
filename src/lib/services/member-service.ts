
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc, query, where } from 'firebase/firestore';
import { Member } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const membersCollection = collection(db, 'members');

export async function getMembers(): Promise<Member[]> {
  const snapshot = await getDocs(membersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
}

export async function addMember(memberData: Omit<Member, 'id' | 'lastVisit' | 'avatarUrl'>): Promise<Member> {
    // Check if a member with this email already exists
    const q = query(membersCollection, where("email", "==", memberData.email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error("A member with this email already exists.");
    }
    
    // Note: This only creates a member record in Firestore, not a Firebase Auth user.
    // This means the user cannot log in. A real app would need an invitation flow.
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
  await updateDoc(memberDoc, memberData);
}

export async function deleteMember(memberId: string): Promise<void> {
  // In a real app, you might want to handle deleting the corresponding Firebase Auth user
  // and cleaning up related data (payments, etc.).
  const memberDoc = doc(db, 'members', memberId);
  await deleteDoc(memberDoc);
}

    