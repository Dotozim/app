'use client';
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { Client, Item, Product, Purchase, PaymentMethod, TabSession } from '@/lib/types';
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
  isSensitiveDataVisible: boolean;

  // Actions
  handleAddItem: (clientId: string, item: Omit<Item, 'id' | 'quantity'>) => void;
  handleRemoveItem: (clientId: string, itemId: string) => void;
  handleSettleTab: (clientId: string, paymentMethod: PaymentMethod) => void;
  handleAddClient: (name: string) => void;
  handleAddProduct: (product: Omit<Product, 'id'>) => void;
  handleUpdateProduct: (product: Product) => void;
  handleRemoveProduct: (productId: string) => void;
  
  // Navigation
  navigateTo: (screen: Screen, clientId?: string) => void;
  navigateBack: () => void;
  
  // UI Actions
  setAddClientFormOpen: (isOpen: boolean) => void;
  toggleSensitiveDataVisibility: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialProducts: Product[] = [
    { id: 'p1', name: 'Craft IPA', category: 'Beer', price: 7.5, imageUrl: 'https://picsum.photos/seed/p1/400/400' },
    { id: 'p2', name: 'Pretzel Bites', category: 'Snack', price: 5.0, imageUrl: 'https://picsum.photos/seed/p2/400/400' },
    { id: 'p3', name: 'Stout', category: 'Beer', price: 8.0, imageUrl: 'https://picsum.photos/seed/p3/400/400' },
    { id: 'p4', name: 'Lager', category: 'Beer', price: 6.0, imageUrl: 'https://picsum.photos/seed/p4/400/400' },
    { id: 'p5', name: 'Chicken Wings', category: 'Food', price: 12.0, imageUrl: 'https://picsum.photos/seed/p5/400/400' },
];

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    currentTab: [
      { id: 'a1', name: 'Craft IPA', category: 'Beer', price: 7.5, quantity: 2, imageUrl: 'https://picsum.photos/seed/p1/400/400' },
      { id: 'b2', name: 'Pretzel Bites', category: 'Snack', price: 5.0, quantity: 1, imageUrl: 'https://picsum.photos/seed/p2/400/400' },
    ],
    purchaseHistory: [{ id: 'c3', name: 'Stout', category: 'Beer', price: 8.0, quantity: 1, purchaseDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), paymentMethod: 'Credit Card', imageUrl: 'https://picsum.photos/seed/p3/400/400' }],
    tabOpenedAt: new Date().toISOString(),
    tabHistory: [
        {
          openedAt: new Date(new Date().setDate(new Date().getDate() - 1) - 3 * 60 * 60 * 1000).toISOString(),
          closedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
          duration: 3 * 60 * 60 * 1000,
        }
    ]
  },
  {
    id: '2',
    name: 'Marcus Holloway',
    currentTab: [{ id: 'd4', name: 'Lager', category: 'Beer', price: 6.0, quantity: 1, imageUrl: 'https://picsum.photos/seed/p4/400/400' }],
    purchaseHistory: [
      { id: 'e5', name: 'Lager', category: 'Beer', price: 6.0, quantity: 1, purchaseDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), paymentMethod: 'Cash', imageUrl: 'https://picsum.photos/seed/p4/400/400' },
      { id: 'f6', name: 'Chicken Wings', category: 'Food', price: 12.0, quantity: 1, purchaseDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), paymentMethod: 'Credit Card', imageUrl: 'https://picsum.photos/seed/p5/400/400' },
    ],
    tabOpenedAt: new Date().toISOString(),
    tabHistory: [
      {
        openedAt: new Date(new Date().setDate(new Date().getDate() - 2) - 2 * 60 * 60 * 1000).toISOString(),
        closedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        duration: 2 * 60 * 60 * 1000,
      }
    ],
  },
];


export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['home']);
  const [isAddClientFormOpen, setAddClientFormOpen] = useState(false);
  const [isSensitiveDataVisible, setIsSensitiveDataVisible] = useState(true);

  const toggleSensitiveDataVisibility = () => {
    setIsSensitiveDataVisible(prev => !prev);
  }

  const handleAddClient = (name: string) => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      currentTab: [],
      purchaseHistory: [],
      tabHistory: [],
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
          if (!c.tabOpenedAt) {
            console.error("Cannot settle tab without an opening time.");
            return c;
          }

          const settledItems: Purchase[] = c.currentTab.map(item => ({
            ...item,
            purchaseDate: new Date().toISOString(),
            paymentMethod: paymentMethod,
          }));

          const newTabSession: TabSession = {
            openedAt: c.tabOpenedAt,
            closedAt: new Date().toISOString(),
            duration: new Date().getTime() - new Date(c.tabOpenedAt).getTime(),
          };
          
          return {
            ...c,
            purchaseHistory: [...c.purchaseHistory, ...settledItems],
            currentTab: [],
            tabOpenedAt: undefined,
            tabHistory: [...c.tabHistory, newTabSession],
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

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setClients(prevClients => prevClients.map(client => ({
      ...client,
      currentTab: client.currentTab.map(item => {
        const product = products.find(p => p.id === updatedProduct.id);
        if (item.name === product?.name) {
          return { ...item, price: updatedProduct.price, category: updatedProduct.category, imageUrl: updatedProduct.imageUrl };
        }
        return item;
      })
    })));
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const navigateTo = (screen: Screen, clientId?: string) => {
    if (clientId) {
      setActiveClientId(clientId);
    }
    if (screen === 'clients' || screen === 'home' || screen === 'products' || screen === 'analytics') {
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
    isSensitiveDataVisible,
    handleAddItem,
    handleRemoveItem,
    handleSettleTab,
    handleAddClient,
    handleAddProduct,
    handleUpdateProduct,
    handleRemoveProduct,
    navigateTo,
    navigateBack,
    setAddClientFormOpen,
    toggleSensitiveDataVisibility
  };

  return (
    <AppContext.Provider value={value}>
        {children}
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
