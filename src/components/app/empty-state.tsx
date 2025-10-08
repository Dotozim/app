import { Beer } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  onAddClient: () => void;
};

export function EmptyState({ onAddClient }: EmptyStateProps) {
  return (
    <div className="text-center p-12 border-2 border-dashed rounded-lg mt-8 flex flex-col items-center gap-4">
      <Beer className="mx-auto h-16 w-16 text-muted-foreground" />
      <h3 className="mt-2 text-xl font-medium">
        No Open Tabs
      </h3>
      <p className="max-w-xs text-center text-muted-foreground">
        Get started by creating the first client tab.
      </p>
      <Button onClick={onAddClient} className="mt-4">
        Create First Tab
      </Button>
    </div>
  );
}
