'use client';
import { useAppContext } from "@/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, PlusCircle } from "lucide-react";

export function HomeScreen() {
  const { clients, navigateTo, setAddClientFormOpen } = useAppContext();

  const openTabsCount = clients.filter(c => c.currentTab.length > 0).length;
  const totalOnTabs = clients.reduce((total, client) => 
    total + client.currentTab.reduce((tabTotal, item) => tabTotal + item.price, 0), 0);
  const totalItemsOnTabs = clients.reduce((total, client) => total + client.currentTab.length, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Tabs Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{openTabsCount}</p>
              <p className="text-muted-foreground text-sm mt-1">Open</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalOnTabs)}</p>
              <p className="text-muted-foreground text-sm mt-1">Total</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{totalItemsOnTabs}</p>
              <p className="text-muted-foreground text-sm mt-1">Items</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => navigateTo('clients')}>
            <Users className="mr-2" /> View All Clients
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => setAddClientFormOpen(true)}>
            <PlusCircle className="mr-2" /> Create New Tab
          </Button>
           <Button variant="outline" className="w-full justify-start" onClick={() => navigateTo('analytics')}>
            <FileText className="mr-2" /> View Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
