'use client';
import { Home, Users, TrendingUp, Beer } from 'lucide-react';
import { useAppContext, Screen } from '@/context/app-context';
import { cn } from '@/lib/utils';

interface NavItemProps {
  screen: Screen;
  icon: React.ReactNode;
  label: string;
}

export function BottomNavBar() {
  const { currentScreen, navigateTo } = useAppContext();

  const NavItem = ({ screen, icon, label }: NavItemProps) => {
    const isActive = currentScreen === screen || (currentScreen.includes('client') && screen === 'clients');
    
    return (
      <button
        onClick={() => navigateTo(screen)}
        className={cn(
          "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all w-20",
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-primary/5'
        )}
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[80px] bg-background/80 backdrop-blur-xl border-t z-20">
      <div className="max-w-md mx-auto h-full flex items-center justify-around">
        <NavItem screen="home" icon={<Home />} label="Home" />
        <NavItem screen="clients" icon={<Users />} label="Clients" />
        <NavItem screen="products" icon={<Beer />} label="Products" />
        <NavItem screen="analytics" icon={<TrendingUp />} label="Analytics" />
      </div>
    </nav>
  );
}
