'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Minus } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  productId: z.string().min(1, 'Please select a product.'),
});


export function AddItemForm() {
  const { activeClient, products, handleAddItem, handleRemoveItem } = useAppContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!activeClient) return;
    const product = products.find(p => p.id === values.productId);
    if(product) {
        handleAddItem(activeClient.id, { name: product.name, price: product.price });
        form.reset();
    }
  }

  return (
     <div className="flex flex-col h-full gap-4">
        <div>
            <h3 className="text-lg font-medium mb-3">Add to Tab</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
                    <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                        <FormItem className='flex-grow'>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {products.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                    <div className='flex justify-between w-full'>
                                        <span>{product.name}</span>
                                        <span className='text-muted-foreground'>{formatCurrency(product.price)}</span>
                                    </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">
                        <Plus />
                    </Button>
                </form>
            </Form>
        </div>

        <div className="flex-grow flex flex-col gap-2">
            <h3 className="text-lg font-medium">Current Items</h3>
                {activeClient && activeClient.currentTab.length > 0 ? (
                <ScrollArea className="flex-grow pr-1">
                    <div className="space-y-2">
                    {activeClient.currentTab.map((item) => {
                       const product = products.find(p => p.name === item.name);
                       return (
                        <div
                        key={item.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-secondary"
                        >
                          <div className="flex items-center gap-3 flex-grow">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.price)} each
                              </p>
                            </div>
                          </div>
                           <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => activeClient && handleRemoveItem(activeClient.id, item.id)}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold text-md w-4 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => activeClient && product && handleAddItem(activeClient.id, product)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                           </div>
                        </div>
                    )})}
                    </div>
                </ScrollArea>
            ) : (
                <div className="text-sm text-muted-foreground text-center py-6 bg-secondary rounded-lg flex-grow flex items-center justify-center">
                    <p>No items added yet.</p>
                </div>
            )}
        </div>
    </div>
  );
}
