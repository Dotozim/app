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
import { ProductsScreen } from '@/components/screens/products-screen';
import { AddClientForm } from '@/components/app/add-client-form';

export default function Home() {
  const { currentScreen } = useAppContext();

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
      case 'products':
        return <ProductsScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="bg-background flex flex-col h-screen font-sans">
      <AppHeader />
      <main className="flex-grow overflow-y-auto pb-20 p-4">{renderScreen()}</main>
      <BottomNavBar />
      <AddClientForm />
    </div>
  );
}
