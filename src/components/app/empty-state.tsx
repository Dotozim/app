import { Beer } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center p-12 border-2 border-dashed rounded-lg mt-8">
      <Beer className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold font-headline">
        No Open Tabs
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Click "New Client Tab" to get started and create the first tab.
      </p>
    </div>
  );
}
