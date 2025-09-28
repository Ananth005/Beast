
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, setDoc } from 'firebase/firestore';
import { Payment } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const paymentsCollection = collection(db, 'payments');

export async function getPayments(): Promise<Payment[]> {
  const snapshot = await getDocs(paymentsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
}

export async function addPayment(paymentData: Omit<Payment, 'id'>): Promise<Payment> {
    const newId = uuidv4();
    const newPayment: Payment = { ...paymentData, id: newId };
    await setDoc(doc(paymentsCollection, newId), newPayment);
    return newPayment;
}

export async function updatePayment(paymentId: string, paymentData: Partial<Payment>): Promise<void> {
  const paymentDoc = doc(db, 'payments', paymentId);
  await updateDoc(paymentDoc, paymentData);
}
