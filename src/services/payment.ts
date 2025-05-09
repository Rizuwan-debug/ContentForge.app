
'use server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { PaymentRequest } from '@/types';

export async function logPaymentAttempt(
  userId: string,
  amount: number,
  currency: string = 'INR'
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }
  if (amount <= 0) {
    return { success: false, error: 'Invalid amount.' };
  }

  try {
    const paymentRequestData: Omit<PaymentRequest, 'id' | 'timestamp'> & { timestamp: any } = {
      userId,
      amount,
      currency,
      status: 'pending_verification',
      paymentMethod: 'UPI',
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'paymentRequests'), paymentRequestData);
    return { success: true, paymentId: docRef.id };
  } catch (e) {
    console.error('Error logging payment attempt:', e);
    return { success: false, error: 'Failed to log payment attempt.' };
  }
}
