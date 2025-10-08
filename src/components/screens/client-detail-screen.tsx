'use client';

import { useAppContext } from '@/context/app-context';
import { formatCurrency, formatValue } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, DollarSign, Minus } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';

export function ClientDetailScreen() {
  const { activeClient, navigateTo, handleAddItem, handleRemoveItem, products, isSensitiveDataVisible } = useAppContext();

  if (!activeClient) {
    return <div className="text-center py-10">No client selected.</div>;
  }
  
  const total = activeClient.currentTab.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="h-full flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-foreground">Total</span>
            <span className="font-bold text-2xl text-primary">
              {formatValue(total, isSensitiveDataVisible, formatCurrency)}
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
            {activeClient.currentTab.map((item) => {
              const product = products.find(p => p.name === item.name);
              const subtotal = item.price * item.quantity;
              return (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 rounded-lg bg-secondary"
              >
                <div className="flex items-center gap-3 flex-grow">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md object-cover" />
                  )}
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {formatValue(item.price, isSensitiveDataVisible, formatCurrency)} each
                        </p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveItem(activeClient.id, item.id)}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-md w-4 text-center">{formatValue(item.quantity, isSensitiveDataVisible, (val) => val)}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => product && handleAddItem(activeClient.id, product)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <div className="w-20 text-right font-medium">
                  {formatValue(subtotal, isSensitiveDataVisible, formatCurrency)}
                </div>
              </div>
            )})}
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
