export type Platform = 'youtube' | 'instagram';

export interface GeneratedContent {
  titles?: string[];
  captions?: Array<{ style: string; text: string }>;
  hashtags?: string[];
}

export interface PaymentRequest {
  id?: string; // Document ID from Firestore
  userId: string;
  amount: number;
  currency: string;
  status: 'pending_verification' | 'verified' | 'failed';
  timestamp: Date;
  paymentMethod: 'UPI'; // For now, only UPI for premium
}

export interface DonationInfo {
  method: 'UPI' | 'BTC' | 'ETH' | 'SOL';
  details: string; // UPI ID or Wallet Address
}
