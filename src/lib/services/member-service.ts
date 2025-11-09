
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, setDoc, query, where, getDoc } from 'firebase/firestore';
import { Member } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const membersCollection = collection(db, 'members');

export async function getMembers(): Promise<Member[]> {
  // Step 1: Fetch all members
  const snapshot = await getDocs(collection(db, "members"));
  const members = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "No Name",
      email: data.email || "",
      mobileNumber: data.mobileNumber || "",
      gender: data.gender || "other",
      joinDate: data.joinDate || new Date().toISOString(),
      lastVisit: data.lastVisit || new Date().toISOString(),
      membershipStatus: data.membershipStatus || "active",
      avatarUrl: data.avatarUrl || `https://picsum.photos/seed/${doc.id}/100/100`,
    } as Member;
  });

  // Step 2: Fetch all users who have role === "owner"
  const ownersQuery = query(collection(db, "users"), where("role", "==", "owner"));
  const ownersSnapshot = await getDocs(ownersQuery);
  const ownerIds = ownersSnapshot.docs.map(doc => doc.id);

  // Step 3: Filter out members who are also owners
  const filteredMembers = members.filter(member => !ownerIds.includes(member.id));

  // Step 4: Return the filtered list
  return filteredMembers;
}

export async function addMember(memberData: Omit<Member, 'id' | 'lastVisit' | 'avatarUrl'>): Promise<Member> {
    // This function adds members who do not have a login (e.g., manually by an owner).
    if (memberData.email) {
        const q = query(membersCollection, where("email", "==", memberData.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            throw new Error("A member with this email already exists.");
        }
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
      ...memberData
  });

  // Also update the display name in the core 'users' table if it exists
  const userDoc = doc(db, 'users', memberId);
  try {
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
        await updateDoc(userDoc, {
            displayName: memberData.name,
            email: memberData.email
        });
    }
  } catch (e) {
      console.log('User record in `users` collection not found or could not be updated for member:', memberId);
  }
}

export async function deleteMember(memberId: string): Promise<void> {
  // This will delete the member from the 'members' collection.
  const memberDoc = doc(db, 'members', memberId);
  await deleteDoc(memberDoc);

  // For this app, we'll also remove them from the 'users' collection to disable login.
  // This part might fail if the user was manually added and doesn't have a 'users' record,
  // so we wrap it in a try-catch.
  try {
    const userDoc = doc(db, 'users', memberId);
    await deleteDoc(userDoc);
  } catch (error) {
    console.log(`Could not delete user from 'users' collection for memberId: ${memberId}. They might have been a manually added member.`)
  }
}
