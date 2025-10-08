'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Client } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

type ClientListSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  clients: Client[];
  activeClientId?: string;
  onClientSelect: (id: string) => void;
};

export function ClientListSheet({
  isOpen,
  onOpenChange,
  clients,
  activeClientId,
  onClientSelect,
}: ClientListSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[60dvh] flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>Select a Client</SheetTitle>
          <SheetDescription>
            Choose a client to view their tab.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-2 -mr-6">
            <div className="space-y-2 py-4">
            {clients.map((client) => (
                <Button
                key={client.id}
                variant={client.id === activeClientId ? 'secondary' : 'ghost'}
                className="w-full justify-start h-14 text-left text-base"
                onClick={() => onClientSelect(client.id)}
                >
                <span className="flex-grow">{client.name}</span>
                {client.id === activeClientId && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                )}
                </Button>
            ))}
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
