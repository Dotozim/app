'use client';
import { useAppContext } from "@/context/app-context";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatValue } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

export function AnalyticsScreen() {
  const { clients, isSensitiveDataVisible } = useAppContext();

  const { totalRevenue, clientAnalytics } = useMemo(() => {
    let totalRevenue = 0;
    
    const clientAnalytics = clients.map(client => {
      const clientHistory = [...client.purchaseHistory];
      let clientTotal = 0;
      const clientProductCounts: { [key: string]: { count: number; revenue: number; purchases: {date: string, quantity: number, paymentMethod: string}[] } } = {};
      const clientCategoryCounts: { [key: string]: number } = {};

      clientHistory.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalRevenue += itemTotal;
        clientTotal += itemTotal;
        
        clientProductCounts[item.name] = clientProductCounts[item.name] || { count: 0, revenue: 0, purchases: [] };
        clientProductCounts[item.name].count += item.quantity;
        clientProductCounts[item.name].revenue += itemTotal;
        clientProductCounts[item.name].purchases.push({
            date: item.purchaseDate,
            quantity: item.quantity,
            paymentMethod: item.paymentMethod,
        });

        if (item.category) {
            clientCategoryCounts[item.category] = (clientCategoryCounts[item.category] || 0) + item.quantity;
        }
      });

      const clientTopProducts = Object.entries(clientProductCounts)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .map(([name, data]) => ({ name, ...data }));
        
      const mostConsumedCategory = Object.keys(clientCategoryCounts).length > 0 
        ? Object.entries(clientCategoryCounts).sort(([,a],[,b]) => b - a)[0][0]
        : null;

      return {
          id: client.id,
          name: client.name,
          totalSpent: clientTotal,
          topProducts: clientTopProducts,
          mostConsumedCategory: mostConsumedCategory
      }
    }).sort((a,b) => b.totalSpent - a.totalSpent);
      
    return { totalRevenue, clientAnalytics };
  }, [clients]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{formatValue(totalRevenue, isSensitiveDataVisible, formatCurrency)}</p>
          <p className="text-muted-foreground text-sm">
            Total from all clients.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Client Breakdown</CardTitle>
            <CardDescription>Consumption analysis for each client.</CardDescription>
        </CardHeader>
        <CardContent>
          {clientAnalytics.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {clientAnalytics.map(client => (
                <AccordionItem value={client.id} key={client.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                        <span>{client.name}</span>
                        <span className="text-primary font-bold">{formatValue(client.totalSpent, isSensitiveDataVisible, formatCurrency)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {client.mostConsumedCategory && (
                        <div className="mb-4 p-2 bg-muted rounded-md text-center text-sm">
                            <p className="text-muted-foreground">
                            Most consumed category: <Badge variant="outline">{client.mostConsumedCategory}</Badge>
                            </p>
                        </div>
                    )}
                    <h4 className="font-semibold mb-2 text-md">Purchase History for {client.name}</h4>
                    <div className="space-y-4">
                    {client.topProducts.length > 0 ? client.topProducts.map((product) => (
                      <div key={product.name} className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{formatValue(product.count, isSensitiveDataVisible, (val) => `${val} total sold`)}</p>
                          </div>
                          <p className="font-semibold text-primary/90">{formatValue(product.revenue, isSensitiveDataVisible, formatCurrency)}</p>
                        </div>
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {product.purchases.map((purchase, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{formatValue(purchase.quantity, isSensitiveDataVisible, (val) => `${val}x`)} on {format(new Date(purchase.date), 'MMM d, yyyy')}</span>
                                    <span>({purchase.paymentMethod})</span>
                                </li>
                            ))}
                        </ul>
                      </div>
                    )) : <p className="text-muted-foreground text-center py-2 text-sm">No purchase history for this client.</p>}
                   </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
             <p className="text-muted-foreground text-center py-4">No client data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
