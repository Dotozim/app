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
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Client name must be at least 2 characters.',
  }),
});

export function AddClientForm() {
  const { isAddClientFormOpen, setAddClientFormOpen, handleAddClient, editingClient, handleUpdateClient, setEditingClient } = useAppContext();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  
  const isEditing = !!editingClient;

  useEffect(() => {
    if (isEditing) {
      form.reset({ name: editingClient.name });
    } else {
      form.reset({ name: '' });
    }
  }, [editingClient, isEditing, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditing && editingClient) {
        handleUpdateClient(editingClient.id, values.name);
    } else {
        handleAddClient(values.name);
    }
    form.reset();
    setAddClientFormOpen(false);
    setEditingClient(null);
  }

  const handleClose = () => {
    setAddClientFormOpen(false);
    setEditingClient(null);
  }

  return (
    <Dialog open={isAddClientFormOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client Name' : 'Create New Client Tab'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the client\'s name.' : "Enter the client's name to start a new tab for them."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Save Changes' : 'Create Tab'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
