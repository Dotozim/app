'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Client, Item } from '@/lib/types';
import { AppHeader } from '@/components/app/app-header';
import { AddClientForm } from '@/components/app/add-client-form';
import { ClientTab } from '@/components/app/client-tab';
import { EmptyState } from '@/components/app/empty-state';
import { BottomNav } from '@/components/app/bottom-nav';
import { ClientListSheet } from '@/components/app/client-list-sheet';
import { AddItemForm } from '@/components/app/add-item-form';

const initialClients: Client[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    currentTab: [
      { id: 'a1', name: 'Craft IPA', price: 7.5 },
      { id: 'b2', name: 'Pretzel Bites', price: 5.0 },
    ],
    purchaseHistory: [{ id: 'c3', name: 'Stout', price: 8.0 }],
  },
  {
    id: '2',
    name: 'Marcus Holloway',
    currentTab: [{ id: 'd4', name: 'Lager', price: 6.0 }],
    purchaseHistory: [
      { id: 'e5', name: 'Lager', price: 6.0 },
      { id: 'f6', name: 'Chicken Wings', price: 12.0 },
    ],
  },
];

export default function Home() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [activeClientId, setActiveClientId] = useState<string | undefined>(
    initialClients[0]?.id
  );
  const [isMounted, setIsMounted] = useState(false);
  const [isClientSheetOpen, setClientSheetOpen] = useState(false);
  const [isAddClientFormOpen, setAddClientFormOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddClient = (name: string) => {
    const newClient: Client = {
      id: crypto.randomUUID(),
      name,
      currentTab: [],
      purchaseHistory: [],
    };
    const newClients = [...clients, newClient];
    setClients(newClients);
    setActiveClientId(newClient.id);
  };

  const handleAddItem = (clientId: string, item: Omit<Item, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, currentTab: [...c.currentTab, newItem] }
          : c
      )
    );
  };

  const handleRemoveItem = (clientId: string, itemId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, currentTab: c.currentTab.filter((i) => i.id !== itemId) }
          : c
      )
    );
  };

  const handleSettleTab = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            purchaseHistory: [...c.purchaseHistory, ...c.currentTab],
            currentTab: [],
          };
        }
        return c;
      })
    );
    // Optional: Switch to another client or set to undefined
    const newActiveClient = clients.find(c => c.id !== clientId);
    setActiveClientId(newActiveClient?.id);
  };

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.name.localeCompare(b.name)),
    [clients]
  );
  
  const activeClient = useMemo(() => clients.find(c => c.id === activeClientId), [clients, activeClientId]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader clientName={activeClient?.name} />
      <main className="flex-grow p-4 md:p-6 lg:p-8 pb-24">
        {activeClient ? (
           <ClientTab
              client={activeClient}
              onAddItem={(item) => handleAddItem(activeClient.id, item)}
              onRemoveItem={(itemId) => handleRemoveItem(activeClient.id, itemId)}
              onSettleTab={() => handleSettleTab(activeClient.id)}
            />
        ) : (
          <EmptyState onAddClient={() => setAddClientFormOpen(true)} />
        )}
      </main>

      {clients.length > 0 && (
        <BottomNav
          onListClients={() => setClientSheetOpen(true)}
          onAddClient={() => setAddClientFormOpen(true)}
        />
      )}
      
      <ClientListSheet
        isOpen={isClientSheetOpen}
        onOpenChange={setClientSheetOpen}
        clients={sortedClients}
        activeClientId={activeClientId}
        onClientSelect={(id) => {
          setActiveClientId(id);
          setClientSheetOpen(false);
        }}
      />
      
      <AddClientForm
        isOpen={isAddClientFormOpen}
        onOpenChange={setAddClientFormOpen}
        onAddClient={handleAddClient}
      />

    </div>
  );
}
