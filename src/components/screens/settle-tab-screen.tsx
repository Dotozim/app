'use client';

import { useAppContext } from "@/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, CreditCard, Banknote, Landmark } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { PaymentMethod } from "@/lib/types";
import { useState } from "react";


export function SettleTabScreen() {
  const { activeClient, handleSettleTab } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  if (!activeClient) {
    return <div className="text-center py-10">No client selected.</div>;
  }

  const total = activeClient.currentTab.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const onSettle = () => {
    if (paymentMethod) {
      handleSettleTab(activeClient.id, paymentMethod);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Settle Tab</CardTitle>
          <CardDescription>Review the items before closing the tab.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-2">
              {activeClient.currentTab.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm p-2 rounded-md bg-secondary">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold bg-primary/10 text-primary rounded-full h-7 w-7 flex items-center justify-center text-xs">
                      {item.quantity}x
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4 p-4 border-t mt-auto">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
          <Separator />
           <AlertDialog>
            <AlertDialogTrigger asChild disabled={total === 0}>
                <Button size="lg">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Settle Tab
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Select Payment Method</AlertDialogTitle>
                <AlertDialogDescription>
                  How is {activeClient.name} paying for the total of {formatCurrency(total)}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-3 gap-4 py-4">
                  <Button variant={paymentMethod === 'Cash' ? 'default' : 'secondary'} className="h-20 flex-col gap-2" onClick={() => setPaymentMethod('Cash')}>
                      <Banknote className="h-7 w-7"/>
                      Cash
                  </Button>
                  <Button variant={paymentMethod === 'Credit Card' ? 'default' : 'secondary'} className="h-20 flex-col gap-2" onClick={() => setPaymentMethod('Credit Card')}>
                      <CreditCard className="h-7 w-7"/>
                      Credit
                  </Button>
                   <Button variant={paymentMethod === 'Debit Card' ? 'default' : 'secondary'} className="h-20 flex-col gap-2" onClick={() => setPaymentMethod('Debit Card')}>
                      <Landmark className="h-7 w-7"/>
                      Debit
                  </Button>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPaymentMethod(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSettle} disabled={!paymentMethod}>
                  Confirm & Settle
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
