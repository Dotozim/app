'use client';

import { useMemo } from 'react';
import type { Client, Item } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { AddItemForm } from '@/components/app/add-item-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2, DollarSign, History } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type ClientTabProps = {
  client: Client;
  onAddItem: (item: Omit<Item, 'id'>) => void;
  onRemoveItem: (itemId: string) => void;
  onSettleTab: () => void;
};

export function ClientTab({
  client,
  onAddItem,
  onRemoveItem,
  onSettleTab,
}: ClientTabProps) {
  const total = useMemo(
    () => client.currentTab.reduce((sum, item) => sum + item.price, 0),
    [client.currentTab]
  );

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="p-0">
          {/* The title is now in the main AppHeader */}
      </CardHeader>
      <CardContent className="space-y-6 !pt-2">
        <div>
          <h3 className="text-lg font-medium mb-3">
            Add to Tab
          </h3>
          <AddItemForm onItemAdded={onAddItem} />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-2">
            Current Order
          </h3>
          {client.currentTab.length > 0 ? (
            <div className="space-y-2">
              {client.currentTab.map((item) => (
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
                    onClick={() => onRemoveItem(item.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6 bg-secondary rounded-lg">
              No items in the current tab.
            </p>
          )}
        </div>
        
        <div className="flex justify-end pt-2">
           <Button
            size="lg"
            onClick={onSettleTab}
            disabled={client.currentTab.length === 0}
            className="bg-primary text-primary-foreground"
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Settle Tab ({formatCurrency(total)})
          </Button>
        </div>

      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4 p-0">
        {client.purchaseHistory.length > 0 && (
           <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="history" className="border-t">
              <AccordionTrigger className="py-4">
                <span className="flex items-center gap-2">
                  <History className="h-5 w-5" /> Purchase History
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2 pr-4">
                    {client.purchaseHistory.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-secondary"
                      >
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardFooter>
    </Card>
  );
}
