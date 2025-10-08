'use client';
import { useAppContext } from "@/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, PlusCircle, CreditCard, Banknote, Landmark } from "lucide-react";
import { useMemo } from "react";

export function HomeScreen() {
  const { clients, navigateTo, setAddClientFormOpen } = useAppContext();

  const openTabsCount = clients.filter(c => c.currentTab.length > 0).length;
  const totalOnTabs = clients.reduce((total, client) => 
    total + client.currentTab.reduce((tabTotal, item) => tabTotal + (item.price * item.quantity), 0), 0);

  const { totalRevenue, cashRevenue, creditCardRevenue, debitCardRevenue } = useMemo(() => {
    let totalRevenue = 0;
    let cashRevenue = 0;
    let creditCardRevenue = 0;
    let debitCardRevenue = 0;
    clients.forEach(client => {
      client.purchaseHistory.forEach(purchase => {
        const purchaseTotal = purchase.price * purchase.quantity;
        totalRevenue += purchaseTotal;
        if(purchase.paymentMethod === 'Cash') {
          cashRevenue += purchaseTotal;
        } else if (purchase.paymentMethod === 'Credit Card') {
          creditCardRevenue += purchaseTotal;
        } else if (purchase.paymentMethod === 'Debit Card') {
            debitCardRevenue += purchaseTotal;
        }
      });
    });
    return { totalRevenue, cashRevenue, creditCardRevenue, debitCardRevenue };
  }, [clients]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{openTabsCount}</p>
              <p className="text-muted-foreground text-sm mt-1">Active</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{formatCurrency(totalOnTabs)}</p>
              <p className="text-muted-foreground text-sm mt-1">Total Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Today's Revenue</CardTitle>
            <CardDescription>Total: {formatCurrency(totalRevenue)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <div className="flex items-center gap-3 bg-secondary p-4 rounded-lg">
                <Banknote className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-muted-foreground text-sm">Cash</p>
                  <p className="text-xl font-bold">{formatCurrency(cashRevenue)}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary p-4 rounded-lg">
                <CreditCard className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-muted-foreground text-sm">Credit Card</p>
                  <p className="text-xl font-bold">{formatCurrency(creditCardRevenue)}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary p-4 rounded-lg">
                <Landmark className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-muted-foreground text-sm">Debit Card</p>
                  <p className="text-xl font-bold">{formatCurrency(debitCardRevenue)}</p>
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
