'use client';

import { useAppContext } from '@/context/app-context';
import { AppHeader } from '@/components/app/app-header';
import { BottomNavBar } from '@/components/app/bottom-nav-bar';
import { HomeScreen } from '@/components/screens/home-screen';
import { ClientsScreen } from '@/components/screens/clients-screen';
import { AnalyticsScreen } from '@/components/screens/analytics-screen';
import { ClientDetailScreen } from '@/components/screens/client-detail-screen';
import { AddItemsScreen } from '@/components/screens/add-items-screen';
import { SettleTabScreen } from '@/components/screens/settle-tab-screen';

export default function Home() {
  const { currentScreen, activeClient } = useAppContext();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'clients':
        return <ClientsScreen />;
      case 'client-detail':
        return <ClientDetailScreen />;
      case 'add-items':
        return <AddItemsScreen />;
      case 'settle-tab':
        return <SettleTabScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="bg-muted flex items-center justify-center min-h-screen font-sans">
      <div className="relative w-[360px] h-[800px] bg-background overflow-hidden rounded-[2.5rem] border-[14px] border-black shadow-2xl flex flex-col">
        <AppHeader />
        <main className="flex-grow overflow-y-auto pb-24 p-4">{renderScreen()}</main>
        <BottomNavBar />
      </div>
    </div>
  );
}
