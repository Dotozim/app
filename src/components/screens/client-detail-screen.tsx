'use client';

import { useAppContext } from '@/context/app-context';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, DollarSign, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';

export function ClientDetailScreen() {
  const { activeClient, navigateTo, handleRemoveItem } = useAppContext();

  if (!activeClient) {
    return <div className="text-center py-10">No client selected.</div>;
  }
  
  const total = activeClient.currentTab.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="h-full flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-foreground">Total</span>
            <span className="font-bold text-2xl text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        <Button className="flex-1" onClick={() => navigateTo('add-items')}>
          <Plus className="mr-2" /> Add Item
        </Button>
        <Button 
          variant="secondary"
          className="flex-1" 
          onClick={() => navigateTo('settle-tab')}
          disabled={total === 0}
        >
          <DollarSign className="mr-2" /> Settle Tab
        </Button>
      </div>

      <Separator />

      <h3 className="text-lg font-medium">
        Current Order
      </h3>
      {activeClient.currentTab.length > 0 ? (
        <ScrollArea className="flex-grow">
          <div className="space-y-2 pr-1">
            {activeClient.currentTab.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-lg bg-secondary"
              >
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(activeClient.id, item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10 bg-secondary rounded-lg">
          <p className="text-muted-foreground">
            No items in the current tab.
          </p>
        </div>
      )}
    </div>
  );
}
