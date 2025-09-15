'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Payment } from '@/lib/types';

const paymentsCollection = collection(db, 'payments');

export async function getPayments(): Promise<Payment[]> {
  const snapshot = await getDocs(paymentsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
}

export async function updatePayment(paymentId: string, paymentData: Partial<Payment>): Promise<void> {
  const paymentDoc = doc(db, 'payments', paymentId);
  await updateDoc(paymentDoc, paymentData);
}
