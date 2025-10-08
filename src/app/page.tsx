'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Client, Item } from '@/lib/types';
import { AppHeader } from '@/components/app/app-header';
import { AddClientForm } from '@/components/app/add-client-form';
import { ClientTab } from '@/components/app/client-tab';
import { EmptyState } from '@/components/app/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
  const [activeTab, setActiveTab] = useState<string | undefined>(
    initialClients[0]?.id
  );
  const [isMounted, setIsMounted] = useState(false);

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
    setClients((prev) => [...prev, newClient]);
    setActiveTab(newClient.id);
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
  };

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.name.localeCompare(b.name)),
    [clients]
  );
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline text-foreground/90">
            Client Tabs
          </h1>
          <AddClientForm onAddClient={handleAddClient} />
        </div>

        {sortedClients.length > 0 && activeTab ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <ScrollArea className="w-full pb-2.5">
              <TabsList>
                {sortedClients.map((client) => (
                  <TabsTrigger key={client.id} value={client.id}>
                    {client.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {sortedClients.map((client) => (
              <TabsContent key={client.id} value={client.id} className="mt-4">
                <ClientTab
                  client={client}
                  onAddItem={(item) => handleAddItem(client.id, item)}
                  onRemoveItem={(itemId) => handleRemoveItem(client.id, itemId)}
                  onSettleTab={() => handleSettleTab(client.id)}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
