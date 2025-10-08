'use client';
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { Client, Item, Product, Purchase, PaymentMethod } from '@/lib/types';
import { AddClientForm } from '@/components/app/add-client-form';
import { useToast } from '@/hooks/use-toast';

export type Screen = 'home' | 'clients' | 'client-detail' | 'add-items' | 'settle-tab' | 'analytics' | 'products';

type AppContextType = {
  // State
  clients: Client[];
  products: Product[];
  activeClient: Client | undefined;
  currentScreen: Screen;
  navigationHistory: Screen[];
  isAddClientFormOpen: boolean;

  // Actions
  handleAddItem: (clientId: string, item: Omit<Item, 'id' | 'quantity'>) => void;
  handleRemoveItem: (clientId: string, itemId: string) => void;
  handleSettleTab: (clientId: string, paymentMethod: PaymentMethod) => void;
  handleAddClient: (name: string) => void;
  handleAddProduct: (product: Omit<Product, 'id'>) => void;
  handleRemoveProduct: (productId: string) => void;
  
  // Navigation
  navigateTo: (screen: Screen, clientId?: string) => void;
  navigateBack: () => void;
  
  // UI Actions
  setAddClientFormOpen: (isOpen: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    currentTab: [
      { id: 'a1', name: 'Craft IPA', price: 7.5, quantity: 2 },
      { id: 'b2', name: 'Pretzel Bites', price: 5.0, quantity: 1 },
    ],
    purchaseHistory: [{ id: 'c3', name: 'Stout', price: 8.0, quantity: 1, purchaseDate: new Date().toISOString(), paymentMethod: 'Credit Card' }],
    tabOpenedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Marcus Holloway',
    currentTab: [{ id: 'd4', name: 'Lager', price: 6.0, quantity: 1 }],
    purchaseHistory: [
      { id: 'e5', name: 'Lager', price: 6.0, quantity: 1, purchaseDate: new Date().toISOString(), paymentMethod: 'Cash' },
      { id: 'f6', name: 'Chicken Wings', price: 12.0, quantity: 1, purchaseDate: new Date().toISOString(), paymentMethod: 'Credit Card' },
    ],
    tabOpenedAt: new Date().toISOString(),
  },
];

const initialProducts: Product[] = [
    { id: 'p1', name: 'Craft IPA', price: 7.5 },
    { id: 'p2', name: 'Pretzel Bites', price: 5.0 },
    { id: 'p3', name: 'Stout', price: 8.0 },
    { id: 'p4', name: 'Lager', price: 6.0 },
    { id: 'p5', name: 'Chicken Wings', price: 12.0 },
];


export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['home']);
  const [isAddClientFormOpen, setAddClientFormOpen] = useState(false);

  const handleAddClient = (name: string) => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      currentTab: [],
      purchaseHistory: [],
    };
    const newClients = [...clients, newClient];
    setClients(newClients);
    navigateTo('client-detail', newClient.id);
  };

  const handleAddItem = (clientId: string, product: Omit<Item, 'id' | 'quantity'>) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const existingItem = c.currentTab.find(item => item.name === product.name);
          let newTab;

          if (existingItem) {
            newTab = c.currentTab.map(item => 
              item.id === existingItem.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            const newItem: Item = { ...product, id: crypto.randomUUID(), quantity: 1 };
            newTab = [...c.currentTab, newItem];
          }

          return { ...c, currentTab: newTab, tabOpenedAt: c.tabOpenedAt || new Date().toISOString() };
        }
        return c;
      })
    );
  };


  const handleRemoveItem = (clientId: string, itemId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const newTab = c.currentTab.map(item => {
            if (item.id === itemId) {
              return { ...item, quantity: item.quantity -1 };
            }
            return item;
          }).filter(item => item.quantity > 0);
          return { ...c, currentTab: newTab };
        }
        return c;
      })
    );
  };

  const handleSettleTab = (clientId: string, paymentMethod: PaymentMethod) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const settledItems: Purchase[] = c.currentTab.map(item => ({
            ...item,
            purchaseDate: new Date().toISOString(),
            paymentMethod: paymentMethod,
          }));
          return {
            ...c,
            purchaseHistory: [...c.purchaseHistory, ...settledItems],
            currentTab: [],
            tabOpenedAt: undefined,
          };
        }
        return c;
      })
    );
    toast({
        title: "Tab Settled!",
        description: `The tab has been successfully closed.`,
    })
    navigateTo('clients');
  };

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const navigateTo = (screen: Screen, clientId?: string) => {
    if (clientId) {
      setActiveClientId(clientId);
    }
    // If we're not navigating to a detail screen, clear the active client
    if (screen === 'clients' || screen === 'home' || screen === 'products') {
        setActiveClientId(null);
    }
    setNavigationHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    const history = [...navigationHistory];
    history.pop();
    const prevScreen = history[history.length - 1] || 'home';

    if(prevScreen === 'clients' || prevScreen === 'home' || prevScreen === 'analytics' || prevScreen === 'products') {
        setActiveClientId(null);
    }
    
    setNavigationHistory(history);
    setCurrentScreen(prevScreen);
  };
  
  const activeClient = useMemo(() => clients.find(c => c.id === activeClientId), [clients, activeClientId]);

  const value = {
    clients,
    products,
    activeClient,
    currentScreen,
    navigationHistory,
    isAddClientFormOpen,
    handleAddItem,
    handleRemoveItem,
    handleSettleTab,
    handleAddClient,
    handleAddProduct,
    handleRemoveProduct,
    navigateTo,
    navigateBack,
    setAddClientFormOpen
  };

  return (
    <AppContext.Provider value={value}>
        {children}
        <AddClientForm />
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
