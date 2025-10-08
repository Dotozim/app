'use client';
import { useAppContext } from "@/context/app-context";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency, formatValue } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { Purchase } from "@/lib/types";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const formatDuration = (milliseconds: number) => {
  if (milliseconds < 0) return '0m';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export function AnalyticsScreen() {
  const { clients, isSensitiveDataVisible, handleRemoveClient } = useAppContext();

  const { totalRevenue, clientAnalytics } = useMemo(() => {
    let totalRevenue = 0;
    
    const clientAnalytics = clients.map(client => {
      let clientTotal = 0;
      const clientCategoryCounts: { [key: string]: number } = {};
      
      const allPurchases = client.tabHistory.flatMap(session => session.items);

      allPurchases.forEach(item => {
        const itemTotal = item.amountPaid;
        totalRevenue += itemTotal;
        clientTotal += itemTotal;
        
        if (item.category) {
            clientCategoryCounts[item.category] = (clientCategoryCounts[item.category] || 0) + item.quantity;
        }
      });
      
      const sortedDurations = client.tabHistory.map(tab => tab.duration).sort((a,b) => a - b);
      let medianSeatedTime = 0;
      if (sortedDurations.length > 0) {
          const mid = Math.floor(sortedDurations.length / 2);
          medianSeatedTime = sortedDurations.length % 2 !== 0 
            ? sortedDurations[mid] 
            : (sortedDurations[mid - 1] + sortedDurations[mid]) / 2;
      }
      
      const enrichedTabHistory = client.tabHistory.map(session => {
        const total = session.items.reduce((acc, p) => acc + p.amountPaid, 0);
        return {
          ...session,
          total,
        };
      }).sort((a,b) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime());
        
      const mostConsumedCategory = Object.keys(clientCategoryCounts).length > 0 
        ? Object.entries(clientCategoryCounts).sort(([,a],[,b]) => b - a)[0][0]
        : null;

      return {
          id: client.id,
          name: client.name,
          totalSpent: clientTotal,
          medianSeatedTime: medianSeatedTime,
          mostConsumedCategory: mostConsumedCategory,
          tabHistory: enrichedTabHistory,
          isArchived: client.isArchived,
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
                    <div className="flex justify-between items-center w-full pr-4">
                        <span>{client.name}</span>
                        <span className="text-primary font-bold">{formatValue(client.totalSpent, isSensitiveDataVisible, formatCurrency)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 mb-4">
                          {client.mostConsumedCategory && (
                              <div className="flex-1 p-2 bg-muted rounded-md text-center text-sm">
                                  <div className="text-muted-foreground">
                                  Favorite Category: <Badge variant="outline">{client.mostConsumedCategory}</Badge>
                                  </div>
                              </div>
                          )}
                          {client.medianSeatedTime > 0 && (
                              <div className="flex-1 p-2 bg-muted rounded-md text-center text-sm">
                                  <div className="text-muted-foreground">
                                  Median Seated Time: <Badge variant="outline">{formatDuration(client.medianSeatedTime)}</Badge>
                                  </div>
                              </div>
                          )}
                      </div>
                       {client.isArchived && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This will permanently delete {client.name} and all their history. This action cannot be undone.
                                  </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveClient(client.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-md">Visit History</h4>
                      {client.tabHistory.length > 0 ? (
                        <div className="space-y-4">
                          {client.tabHistory.map((session, index) => (
                            <div key={index} className="bg-muted p-3 rounded-lg">
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <p className="font-medium">
                                    Visit on {format(new Date(session.closedAt), 'MMM d, yyyy')}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Total: {formatValue(session.total, isSensitiveDataVisible, formatCurrency)}
                                  </p>
                                </div>
                                <Badge variant="secondary">{formatDuration(session.duration)}</Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                {session.items.length > 0 ? session.items.map((purchase: Purchase, pIndex: number) => (
                                  <div key={pIndex} className="flex justify-between items-center bg-background/50 p-2 rounded-md">
                                    <div>
                                      <p className="font-medium text-sm">{purchase.quantity}x {purchase.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Paid with {purchase.paymentMethod}
                                      </p>
                                    </div>
                                    <p className="font-semibold text-primary/90 text-sm">
                                      {formatValue(purchase.amountPaid, isSensitiveDataVisible, formatCurrency)}
                                    </p>
                                  </div>
                                )) : <p className="text-muted-foreground text-center py-2 text-xs">No items recorded for this visit.</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No visit history available.</p>
                      )}
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
