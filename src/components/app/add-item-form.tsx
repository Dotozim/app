'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addItemToTabWithAIPriceLookup } from '@/ai/flows/add-item-to-tab-with-ai-price-lookup';
import type { Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  itemName: z.string().min(1, 'Item name cannot be empty.'),
});

type AddItemFormProps = {
  onItemAdded: (item: Omit<Item, 'id'>) => void;
};

export function AddItemForm({ onItemAdded }: AddItemFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await addItemToTabWithAIPriceLookup({
        itemName: values.itemName,
      });
      if (result) {
        onItemAdded(result);
        form.reset();
      }
    } catch (error) {
      console.error('Error adding item with AI:', error);
      toast({
        title: 'Error',
        description:
          'Could not fetch price for the item. Please check the item name or try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder="e.g., Beer, Snacks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-24">
          {isLoading ? <Loader2 className="animate-spin" /> : 'Add Item'}
        </Button>
      </form>
    </Form>
  );
}
