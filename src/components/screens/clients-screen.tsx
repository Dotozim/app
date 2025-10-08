
'use client';

import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/context/app-context";
import { formatCurrency, formatValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, ChevronRight } from "lucide-react";
import { EmptyState } from "../app/empty-state";
import { formatDistanceToNow } from 'date-fns';
import { AutocompleteInput } from "../ui/autocomplete-input";

export function ClientsScreen() {
  const { clients, navigateTo, setAddClientFormOpen, clientVisibilities, toggleClientVisibility, handleAddClient } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to force re-renders for the duration updates
  const [, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleCreateClientFromSearch = () => {
    if (searchTerm) {
      handleAddClient(searchTerm);
      setSearchTerm('');
    }
  }

  const clientNameSuggestions = useMemo(() => clients.map(c => c.name), [clients]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));
  
  const exactMatchExists = useMemo(() => 
    clients.some(c => c.name.toLowerCase() === searchTerm.toLowerCase()),
    [clients, searchTerm]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <AutocompleteInput 
            suggestions={clientNameSuggestions}
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search clients..." 
            className="pl-10"
          />
        </div>

        {!searchTerm && (
            <Button className="w-full" onClick={() => setAddClientFormOpen(true)}>
                <Plus className="mr-2" /> New Client
            </Button>
        )}
      </div>

      {clients.length === 0 && !searchTerm ? (
        <EmptyState />
      ) : (
        <ScrollArea className="flex-grow">
          <div className="space-y-3 pr-1">
            {searchTerm && !exactMatchExists && (
                <div className="text-center py-2">
                    <Button variant="outline" onClick={handleCreateClientFromSearch} className="w-full">
                        <Plus className="mr-2" /> Create Client "{searchTerm}"
                    </Button>
                </div>
            )}
            {filteredClients.length > 0 ? (
                filteredClients.map(client => {
                const tabTotal = client.currentTab.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const isVisible = clientVisibilities[client.id] ?? true;

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
                                    toggleClientVisibility(client.id);
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
                })
            ) : searchTerm ? (
                 <div className="text-center p-8 border-2 border-dashed rounded-lg flex flex-col items-center gap-4 mt-4">
                    <p className="text-muted-foreground">No client found for "{searchTerm}"</p>
                </div>
            ) : null}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
