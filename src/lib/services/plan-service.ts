
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Plan } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const plansCollection = collection(db, 'plans');

export async function getPlans(): Promise<Plan[]> {
  const snapshot = await getDocs(plansCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Plan));
}

export async function addPlan(planData: Omit<Plan, 'id'>): Promise<Plan> {
    const newId = uuidv4();
    const newPlan: Plan = { ...planData, id: newId };
    await setDoc(doc(plansCollection, newId), newPlan);
    return newPlan;
}

export async function updatePlan(planId: string, planData: Partial<Plan>): Promise<void> {
  const planDoc = doc(db, 'plans', planId);
  await updateDoc(planDoc, planData);
}

export async function deletePlan(planId: string): Promise<void> {
  const planDoc = doc(db, 'plans', planId);
  await deleteDoc(planDoc);
}
