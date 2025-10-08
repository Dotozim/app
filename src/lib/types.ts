export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card';

export interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  imageUrl?: string;
}

export interface Purchase extends Item {
  purchaseDate: string;
  paymentMethod: PaymentMethod;
  amountPaid: number; // For split payments
}

export interface TabSession {
  openedAt: string;
  closedAt: string;
  duration: number; // in milliseconds
  items: Purchase[]; // Store items with payment info
}

export interface Client {
  id: string;
  name: string;
  currentTab: Item[];
  purchaseHistory: Purchase[]; // Kept for simplicity, but new data goes into TabSession
  tabOpenedAt?: string;
  tabHistory: TabSession[];
  isArchived: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export type SplitPayment = {
  method: PaymentMethod;
  amount: number;
};
