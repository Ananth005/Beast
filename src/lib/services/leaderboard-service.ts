
'use server';

import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { LeaderboardCategory } from '@/app/(main)/leaderboard/page';
import { LeaderboardRecord } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const leaderboardsCollection = collection(db, 'leaderboards');

export async function getLeaderboards(): Promise<LeaderboardCategory[]> {
  const snapshot = await getDocs(leaderboardsCollection);
  const leaderboards = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as LeaderboardCategory));
  
  // Sort records by rank inside each leaderboard
  leaderboards.forEach(lb => {
    lb.records.sort((a, b) => a.rank - b.rank);
  });
  
  return leaderboards;
}

export async function addLeaderboard(leaderboardData: Omit<LeaderboardCategory, 'id'>): Promise<string> {
    const id = leaderboardData.title.replace(/\s+/g, '-').toLowerCase();
    const newLeaderboardRef = doc(leaderboardsCollection, id);
    await setDoc(newLeaderboardRef, leaderboardData);
    return id;
}

export async function updateLeaderboard(id: string, updateData: Partial<LeaderboardCategory>): Promise<void> {
  const leaderboardDoc = doc(db, 'leaderboards', id);
  await updateDoc(leaderboardDoc, updateData);
}

export async function deleteLeaderboard(id: string): Promise<void> {
  const leaderboardDoc = doc(db, 'leaderboards', id);
  await deleteDoc(leaderboardDoc);
}


// --- Record Management ---
const sortRecords = (records: LeaderboardRecord[]): LeaderboardRecord[] => {
    return records.sort((a, b) => a.rank - b.rank);
};

export async function addRecord(leaderboardId: string, recordData: LeaderboardRecord): Promise<void> {
    const leaderboardDocRef = doc(db, 'leaderboards', leaderboardId);
    const leaderboardDoc = await getDoc(leaderboardDocRef);

    if (!leaderboardDoc.exists()) {
        throw new Error('Leaderboard not found.');
    }
    
    let currentRecords: LeaderboardRecord[] = leaderboardDoc.data()?.records || [];
    
    // Check if a record for this member already exists
    if (currentRecords.some(r => r.memberId === recordData.memberId)) {
        throw new Error('A record for this member already exists in this leaderboard.');
    }

    currentRecords.push(recordData);
    
    const newSortedRecords = sortRecords(currentRecords);

    await updateDoc(leaderboardDocRef, { records: newSortedRecords });
}

export async function updateRecord(leaderboardId: string, updatedRecord: LeaderboardRecord): Promise<void> {
    const leaderboardDocRef = doc(db, 'leaderboards', leaderboardId);
    const leaderboardDoc = await getDoc(leaderboardDocRef);

    if (!leaderboardDoc.exists()) {
        throw new Error('Leaderboard not found.');
    }

    let currentRecords: LeaderboardRecord[] = leaderboardDoc.data()?.records || [];

    // Find and update the record. We use memberId as a unique identifier for a record in a category.
    const recordIndex = currentRecords.findIndex(r => r.memberId === updatedRecord.memberId);
    
    if (recordIndex === -1) {
        throw new Error('Record not found to update.');
    }

    currentRecords[recordIndex] = { ...currentRecords[recordIndex], ...updatedRecord };

    const newSortedRecords = sortRecords(currentRecords);

    await updateDoc(leaderboardDocRef, { records: newSortedRecords });
}


export async function deleteRecord(leaderboardId: string, recordToDelete: LeaderboardRecord): Promise<void> {
    const leaderboardDocRef = doc(db, 'leaderboards', leaderboardId);
    const leaderboardDoc = await getDoc(leaderboardDocRef);

    if (!leaderboardDoc.exists()) {
        throw new Error('Leaderboard not found.');
    }

    let currentRecords: LeaderboardRecord[] = leaderboardDoc.data()?.records || [];
    
    const newRecords = currentRecords.filter(r => r.memberId !== recordToDelete.memberId);
    const newSortedRecords = sortRecords(newRecords);

    await updateDoc(leaderboardDocRef, { records: newSortedRecords });
}
