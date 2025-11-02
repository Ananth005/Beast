
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const settingsDocRef = doc(db, 'settings', 'reminders');
const defaultMessage = "Hi {name}, this is a friendly reminder that your payment of {amount} is due on {dueDate}.";

export async function getReminderMessage(): Promise<string> {
  try {
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
      return docSnap.data().message || defaultMessage;
    }
    return defaultMessage;
  } catch (error) {
    console.error("Error fetching reminder message:", error);
    return defaultMessage;
  }
}

export async function saveReminderMessage(message: string): Promise<void> {
  try {
    await setDoc(settingsDocRef, { message });
  } catch (error) {
    console.error("Error saving reminder message:", error);
    throw new Error("Could not save the reminder message.");
  }
}
