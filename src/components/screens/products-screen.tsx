'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/app-context';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { formatCurrency } from '@/lib/utils';
import { Card } from '../ui/card';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  })
});

export function ProductsScreen() {
  const { products, handleAddProduct, handleRemoveProduct } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleAddProduct(values);
    form.reset();
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2" /> New Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the product details. This will be available to add to any client's tab.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Craft IPA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 7.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <h3 className="text-lg font-medium">Existing Products</h3>
      {products.length > 0 ? (
        <ScrollArea className="flex-grow">
            <div className="space-y-2 pr-1">
                {products.map((product) => (
                <Card
                    key={product.id}
                    className="flex justify-between items-center p-3"
                >
                    <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-muted-foreground hover:text-destructive h-9 w-9"
                    >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remove product</span>
                    </Button>
                </Card>
                ))}
            </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-10 bg-secondary rounded-lg flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">No products added yet.</p>
        </div>
      )}
    </div>
  );
}
