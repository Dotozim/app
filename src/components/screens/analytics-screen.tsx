'use client';
import { useAppContext } from "@/context/app-context";
import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/lib/types";

export function AnalyticsScreen() {
  const { clients } = useAppContext();
  const [selectedClientId, setSelectedClientId] = useState<string | 'all'>('all');

  const selectedClient = useMemo(() => {
    if (selectedClientId === 'all') return null;
    return clients.find(c => c.id === selectedClientId);
  }, [clients, selectedClientId]);

  const { totalRevenue, topClients, topProducts, clientPurchaseHistory } = useMemo(() => {
    let totalRevenue = 0;
    const clientSpending: { [key: string]: number } = {};
    const productCounts: { [key: string]: { count: number; revenue: number } } = {};
    
    const clientsToProcess = selectedClient ? [selectedClient] : clients;

    clientsToProcess.forEach(client => {
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
      
    return { totalRevenue, topClients, topProducts, clientPurchaseHistory: productCounts };
  }, [clients, selectedClient]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedClientId} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selectedClient ? `${selectedClient.name}'s Revenue` : 'Overall Revenue'}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
          <p className="text-muted-foreground text-sm">
            {selectedClient ? 'Total from all purchases.' : 'Total from all clients.'}
          </p>
        </CardContent>
      </Card>

      {!selectedClient && (
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
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Products</CardTitle>
          <CardDescription>{selectedClient ? `For ${selectedClient.name}` : 'For all clients'}</CardDescription>
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
    </div>
  );
}
