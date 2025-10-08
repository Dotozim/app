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
}

export interface Client {
  id: string;
  name: string;
  currentTab: Item[];
  purchaseHistory: Purchase[];
  tabOpenedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}
