'use client';
import { useAppContext } from "@/context/app-context";
import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { format } from "date-fns";

export function AnalyticsScreen() {
  const { clients } = useAppContext();

  const { totalRevenue, topProducts, clientAnalytics } = useMemo(() => {
    let totalRevenue = 0;
    const productCounts: { [key: string]: { count: number; revenue: number } } = {};
    
    const clientAnalytics = clients.map(client => {
      const clientHistory = [...client.purchaseHistory];
      let clientTotal = 0;
      const clientProductCounts: { [key: string]: { count: number; revenue: number; purchases: {date: string, quantity: number, paymentMethod: string}[] } } = {};

      clientHistory.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalRevenue += itemTotal;
        clientTotal += itemTotal;
        
        // Aggregate for overall top products
        productCounts[item.name] = productCounts[item.name] || { count: 0, revenue: 0 };
        productCounts[item.name].count += item.quantity;
        productCounts[item.name].revenue += itemTotal;
        
        // Aggregate for client-specific top products
        clientProductCounts[item.name] = clientProductCounts[item.name] || { count: 0, revenue: 0, purchases: [] };
        clientProductCounts[item.name].count += item.quantity;
        clientProductCounts[item.name].revenue += itemTotal;
        clientProductCounts[item.name].purchases.push({
            date: item.purchaseDate,
            quantity: item.quantity,
            paymentMethod: item.paymentMethod,
        });
      });

      const clientTopProducts = Object.entries(clientProductCounts)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .map(([name, data]) => ({ name, ...data }));
        
      return {
          id: client.id,
          name: client.name,
          totalSpent: clientTotal,
          topProducts: clientTopProducts
      }
    }).sort((a,b) => b.totalSpent - a.totalSpent);


    const topProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
      
    return { totalRevenue, topProducts, clientAnalytics };
  }, [clients]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
          <p className="text-muted-foreground text-sm">
            Total from all clients.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Products (Overall)</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
            {topProducts.length > 0 ? topProducts.map((product) => (
              <div key={product.name} className="flex justify-between items-center bg-secondary p-3 rounded-md">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.count} sold</p>
                </div>
                <p className="font-bold text-primary">{formatCurrency(product.revenue)}</p>
              </div>
            )) : <p className="text-muted-foreground text-center py-4">No data available.</p>}
           </div>
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
                        <span className="text-primary font-bold">{formatCurrency(client.totalSpent)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <h4 className="font-semibold mb-2 text-md">Purchase History for {client.name}</h4>
                    <div className="space-y-4">
                    {client.topProducts.length > 0 ? client.topProducts.map((product) => (
                      <div key={product.name} className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.count} total sold</p>
                          </div>
                          <p className="font-semibold text-primary/90">{formatCurrency(product.revenue)}</p>
                        </div>
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {product.purchases.map((purchase, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{purchase.quantity}x on {format(new Date(purchase.date), 'MMM d, yyyy')}</span>
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
