'use client';

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/app-context";
import { formatCurrency, formatValue } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, ChevronRight } from "lucide-react";
import { EmptyState } from "../app/empty-state";
import { formatDistanceToNow } from 'date-fns';

export function ClientsScreen() {
  const { clients, navigateTo, setAddClientFormOpen } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilities, setVisibilities] = useState<Record<string, boolean>>({});
  // State to force re-renders for the duration updates
  const [, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const toggleVisibility = (clientId: string) => {
    setVisibilities(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search clients..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={() => setAddClientFormOpen(true)}>
          <Plus className="mr-2" /> New Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollArea className="flex-grow">
          <div className="space-y-3 pr-1">
            {filteredClients.map(client => {
              const tabTotal = client.currentTab.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const isVisible = visibilities[client.id] ?? true;

              return (
                <Card 
                  key={client.id}
                  onClick={() => navigateTo('client-detail', client.id)}
                  className="cursor-pointer hover:bg-secondary transition-colors"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        {tabTotal > 0 ? (
                          <>
                            <span className="bg-accent/20 text-accent font-medium text-xs px-2 py-1 rounded-full">
                              Open Tab
                            </span>
                            <span 
                              className="text-accent font-bold cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleVisibility(client.id);
                              }}
                            >
                              {formatValue(tabTotal, isVisible, formatCurrency)}
                            </span>
                          </>
                        ) : (
                          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium">
                            No open tab
                          </span>
                        )}
                      </div>
                      {client.tabOpenedAt && tabTotal > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                              Seated for: {formatDistanceToNow(new Date(client.tabOpenedAt), { addSuffix: false })}
                          </p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
