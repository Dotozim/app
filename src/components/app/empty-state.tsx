import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';

export function EmptyState() {
  const { setAddClientFormOpen } = useAppContext();
  return (
    <div className="text-center p-12 border-2 border-dashed rounded-lg mt-8 flex flex-col items-center gap-4">
      <Users className="mx-auto h-16 w-16 text-muted-foreground" />
      <h3 className="mt-2 text-xl font-medium">
        No Clients Found
      </h3>
      <p className="max-w-xs text-center text-muted-foreground">
        Get started by creating the first client tab.
      </p>
      <Button onClick={() => setAddClientFormOpen(true)} className="mt-4">
        Create First Client
      </Button>
    </div>
  );
}
