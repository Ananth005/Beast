'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Member } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const membersCollection = collection(db, 'members');

export async function getMembers(): Promise<Member[]> {
  const snapshot = await getDocs(membersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
}

export async function addMember(memberData: Omit<Member, 'id' | 'lastVisit' | 'avatarUrl'>): Promise<Member> {
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
  const memberDoc = doc(db, 'members', memberId);
  await deleteDoc(memberDoc);
}
