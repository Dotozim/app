'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppContext } from '@/context/app-context';
import { Client } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { GitMerge } from 'lucide-react';

interface MergeClientDialogProps {
    clientToMerge: Client | null;
    onClose: () => void;
}

export function MergeClientDialog({ clientToMerge, onClose }: MergeClientDialogProps) {
  const { clients, handleMergeClients } = useAppContext();
  const [destinationClientId, setDestinationClientId] = useState<string | null>(null);
  const { toast } = useToast();

  const otherClients = clients.filter(c => c.id !== clientToMerge?.id);

  const handleMerge = () => {
    if (!clientToMerge || !destinationClientId) {
      toast({
        variant: 'destructive',
        title: 'Merge Error',
        description: 'You must select a client to merge into.',
      });
      return;
    }
    handleMergeClients(clientToMerge.id, destinationClientId);
    onClose();
    setDestinationClientId(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setDestinationClientId(null);
    }
  }

  return (
    <Dialog open={!!clientToMerge} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Merge Client</DialogTitle>
          <DialogDescription>
            Merge <span className="font-bold">{clientToMerge?.name}</span> into another client. All tab history and current items will be transferred. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 space-y-2">
            <label htmlFor="merge-select" className="text-sm font-medium">Merge into</label>
            <Select onValueChange={setDestinationClientId}>
                <SelectTrigger id="merge-select">
                    <SelectValue placeholder="Select a destination client" />
                </SelectTrigger>
                <SelectContent>
                    {otherClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                            {client.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleMerge} disabled={!destinationClientId}>
            <GitMerge className="mr-2 h-4 w-4" />
            Confirm Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
