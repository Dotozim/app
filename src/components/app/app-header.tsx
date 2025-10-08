import { Beer } from 'lucide-react';

type AppHeaderProps = {
  clientName?: string;
};

export function AppHeader({ clientName }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 md:px-8 py-3 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-2 text-primary">
        <Beer className="h-7 w-7" />
        <span className="text-xl font-bold font-headline tracking-tight">
          TabMaster
        </span>
      </div>
      {clientName && (
        <div className="text-lg font-medium text-foreground/80">
          {clientName}
        </div>
      )}
    </header>
  );
}
