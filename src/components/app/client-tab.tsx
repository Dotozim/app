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
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl">
              {client.name}
            </CardTitle>
            <CardDescription>
              Manage this client's current running tab.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettleTab}
            disabled={client.currentTab.length === 0}
            className="text-accent-foreground bg-accent hover:bg-accent/90"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Settle Tab
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 font-headline">
            Add to Tab
          </h3>
          <AddItemForm onItemAdded={onAddItem} />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-4 font-headline">
            Current Order
          </h3>
          {client.currentTab.length > 0 ? (
            <div className="space-y-2">
              {client.currentTab.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 rounded-md bg-background"
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
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4 bg-background rounded-md">
              No items in the current tab.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Separator />
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
        {client.purchaseHistory.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="history">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4" /> Purchase History
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="h-40">
                  <div className="space-y-2 pr-4">
                    {client.purchaseHistory.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="flex justify-between items-center text-sm p-2"
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
