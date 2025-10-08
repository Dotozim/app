'use client';

import { useAppContext } from "@/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign } from "lucide-react";
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


export function SettleTabScreen() {
  const { activeClient, handleSettleTab } = useAppContext();

  if (!activeClient) {
    return <div className="text-center py-10">No client selected.</div>;
  }

  const total = activeClient.currentTab.reduce((sum, item) => sum + item.price, 0);

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
                  <span>{item.name}</span>
                  <span className="font-mono">{formatCurrency(item.price)}</span>
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
            <AlertDialogTrigger asChild>
              <Button size="lg" disabled={total === 0}>
                <DollarSign className="mr-2 h-5 w-5" />
                Confirm & Settle Tab
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will settle the tab for {activeClient.name} for a total of {formatCurrency(total)}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleSettleTab(activeClient.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
