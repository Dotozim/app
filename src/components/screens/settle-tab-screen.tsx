'use client';

import * as React from "react";
import { useAppContext } from "@/context/app-context";
import { formatCurrency, formatValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { PaymentMethod, SplitPayment } from "@/lib/types";
import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

import { DollarSign, CreditCard, Banknote, Landmark, Plus, Trash2 } from "lucide-react";

const paymentMethods: { name: PaymentMethod; icon: JSX.Element }[] = [
    { name: 'Cash', icon: <Banknote /> },
    { name: 'Credit Card', icon: <CreditCard /> },
    { name: 'Debit Card', icon: <Landmark /> },
  ];

export function SettleTabScreen() {
  const { activeClient, handleSettleTab, isSensitiveDataVisible } = useAppContext();
  const { toast } = useToast();
  const [payments, setPayments] = useState<SplitPayment[]>([]);
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState('');
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod>('Cash');

  if (!activeClient) {
    return <div className="text-center py-10">No client selected.</div>;
  }

  const total = useMemo(() => activeClient.currentTab.reduce((sum, item) => sum + (item.price * item.quantity), 0), [activeClient.currentTab]);
  const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
  const remainingBalance = useMemo(() => total - totalPaid, [total, totalPaid]);

  const handleAddPayment = () => {
    const amount = parseFloat(currentPaymentAmount);
    if (isNaN(amount) || amount <= 0) {
        toast({ variant: "destructive", title: "Invalid amount", description: "Please enter a positive number." });
        return;
    }
    if (amount > remainingBalance + 0.001) { // allow for floating point inaccuracies
        toast({ variant: "destructive", title: "Amount too high", description: `Payment cannot exceed remaining balance of ${formatCurrency(remainingBalance)}.` });
        return;
    }

    setPayments(prev => [...prev, { method: currentPaymentMethod, amount }]);
    setCurrentPaymentAmount('');
    // Set remaining balance as next payment amount
    const newRemaining = remainingBalance - amount;
    if (newRemaining > 0.01) {
        setCurrentPaymentAmount(newRemaining.toFixed(2));
    }
  };
  
  const handleRemovePayment = (index: number) => {
    setPayments(prev => prev.filter((_, i) => i !== index));
  }

  const onSettle = () => {
    if (Math.abs(remainingBalance) > 0.01) {
        toast({ variant: "destructive", title: "Balance not cleared", description: "The full tab amount must be paid before settling." });
        return;
    }
    handleSettleTab(activeClient.id, payments);
  }

  const getPaymentMethodIcon = (method: PaymentMethod) => {
      const pm = paymentMethods.find(p => p.name === method);
      return pm ? React.cloneElement(pm.icon, { className: "h-5 w-5" }) : null;
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-grow flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Settle Tab</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="space-y-4 pr-6">
            <Card className="bg-secondary">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center text-md font-medium">
                    <span>Total Bill:</span>
                    <span>{formatValue(total, isSensitiveDataVisible, formatCurrency)}</span>
                </div>
                <div className="flex justify-between items-center text-md font-medium text-destructive">
                    <span>Remaining:</span>
                    <span>{formatValue(remainingBalance, isSensitiveDataVisible, formatCurrency)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <p className="text-sm font-medium">Add a Payment</p>
              <div className='flex flex-col gap-2 mb-2'>
                  {paymentMethods.map(pm => (
                      <Button 
                          key={pm.name}
                          variant={currentPaymentMethod === pm.name ? "default" : "secondary"}
                          onClick={() => setCurrentPaymentMethod(pm.name)}
                          className='flex items-center justify-start gap-2 h-12'
                      >
                          {React.cloneElement(pm.icon, { className: "h-5 w-5" })}
                          <span>{pm.name}</span>
                      </Button>
                  ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  placeholder="Amount"
                  value={currentPaymentAmount}
                  onChange={(e) => setCurrentPaymentAmount(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleAddPayment} disabled={remainingBalance <= 0}>
                  <Plus />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
                {payments.length > 0 && <p className="text-sm font-medium">Payments Added</p>}
                  <div className="space-y-2">
                    {payments.map((p, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-secondary">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(p.method)}
                          <span>{p.method}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{formatValue(p.amount, isSensitiveDataVisible, formatCurrency)}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground" onClick={() => handleRemovePayment(index)}>
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex-col items-stretch gap-4 p-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="lg" disabled={Math.abs(remainingBalance) > 0.01 || payments.length === 0}>
                    <DollarSign className="mr-2 h-5 w-5" />
                    Settle Tab
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Settlement</AlertDialogTitle>
                <AlertDialogDescription>
                  This will close the tab for {activeClient.name} with the specified payments. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSettle}>
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
