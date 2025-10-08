'use client';
import { Beer, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

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
  const { currentScreen, activeClient, navigateBack, isSensitiveDataVisible, toggleSensitiveDataVisibility } = useAppContext();

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
    <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background sticky top-0 z-10 h-16">
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
      {currentScreen !== 'products' && currentScreen !== 'clients' && currentScreen !== 'add-items' && (
        <div className="flex items-center gap-2">
          <Switch
            id="privacy-mode"
            checked={!isSensitiveDataVisible}
            onCheckedChange={toggleSensitiveDataVisibility}
            aria-label="Toggle privacy mode"
          />
          <Label htmlFor="privacy-mode">
              {isSensitiveDataVisible ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-primary" />}
          </Label>
        </div>
      )}
    </header>
  );
}
