'use client';
import { Beer, ChevronLeft } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { Button } from '../ui/button';

const screenTitles: Record<string, string> = {
  home: 'TabMaster',
  clients: 'Clients',
  'client-detail': 'Client Tab',
  'add-items': 'Add Items',
  'settle-tab': 'Settle Tab',
  analytics: 'Analytics',
  products: 'Products',
};

export function AppHeader() {
  const { currentScreen, activeClient, navigateBack } = useAppContext();

  const canGoBack = currentScreen === 'client-detail' || currentScreen === 'add-items' || currentScreen === 'settle-tab' || currentScreen === 'analytics';
  
  const getTitle = () => {
    if (canGoBack) {
      if(activeClient && (currentScreen === 'client-detail' || currentScreen === 'add-items' || currentScreen === 'settle-tab')) {
        return activeClient.name;
      }
       if (currentScreen === 'analytics') {
        return 'Analytics';
      }
    }
    return screenTitles[currentScreen] || 'TabMaster';
  }
  
  const title = getTitle();

  return (
    <header className="flex items-center gap-4 px-4 py-3 border-b bg-background sticky top-0 z-10 h-16">
      <div className="flex items-center gap-2 flex-1">
        {canGoBack ? (
          <Button variant="ghost" size="icon" onClick={navigateBack} className='-ml-2'>
            <ChevronLeft className="h-6 w-6" />
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-primary">
            <Beer className="h-7 w-7" />
          </div>
        )}
        <h1 className="text-xl font-bold tracking-tight">
          {title}
        </h1>
      </div>
    </header>
  );
}
