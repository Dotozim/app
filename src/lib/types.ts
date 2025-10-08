export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface Client {
  id: string;
  name: string;
  currentTab: Item[];
  purchaseHistory: Item[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
}
