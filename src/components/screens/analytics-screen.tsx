'use client';
import { useAppContext } from "@/context/app-context";
import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsScreen() {
  const { clients } = useAppContext();

  const { totalRevenue, topClients, topProducts } = useMemo(() => {
    let totalRevenue = 0;
    const clientSpending: { [key: string]: number } = {};
    const productCounts: { [key: string]: { count: number; revenue: number } } = {};

    clients.forEach(client => {
      const clientHistory = [...client.purchaseHistory, ...client.currentTab];
      let clientTotal = 0;
      clientHistory.forEach(item => {
        totalRevenue += item.price;
        clientTotal += item.price;
        productCounts[item.name] = productCounts[item.name] || { count: 0, revenue: 0 };
        productCounts[item.name].count++;
        productCounts[item.name].revenue += item.price;
      });
      clientSpending[client.name] = (clientSpending[client.name] || 0) + clientTotal;
    });

    const topClients = Object.entries(clientSpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, total]) => ({ name, total }));

    const topProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
      
    return { totalRevenue, topClients, topProducts };
  }, [clients]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
          <p className="text-muted-foreground text-sm">Total from all settled and open tabs.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topClients} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={80} 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--secondary))' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-2 border rounded-lg shadow-sm">
                        <p className="font-bold">{payload[0].payload.name}</p>
                        <p className="text-primary">{formatCurrency(payload[0].value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Products</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-2">
            {topProducts.map((product) => (
              <div key={product.name} className="flex justify-between items-center bg-secondary p-3 rounded-md">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.count} sold</p>
                </div>
                <p className="font-bold text-primary">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
