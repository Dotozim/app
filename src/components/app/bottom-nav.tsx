'use client';

import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

type BottomNavProps = {
  onListClients: () => void;
  onAddClient: () => void;
};

export function BottomNav({ onListClients, onAddClient }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-center z-20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="lg" className="h-12" onClick={onListClients}>
          <Users className="mr-2 h-5 w-5" />
          Clients
        </Button>
        <Button size="lg" className="h-12" onClick={onAddClient}>
          <Plus className="mr-2 h-5 w-5" />
          New Client
        </Button>
      </div>
    </nav>
  );
}
