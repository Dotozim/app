import { Beer } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="flex items-center gap-4 px-4 md:px-8 py-4 border-b bg-card">
      <div className="flex items-center gap-2 text-primary">
        <Beer className="h-8 w-8" />
        <span className="text-2xl font-bold font-headline tracking-tight">
          TabMaster
        </span>
      </div>
    </header>
  );
}
