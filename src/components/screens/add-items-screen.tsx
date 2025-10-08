'use client';
import { AddItemForm } from "@/components/app/add-item-form";
import { useAppContext } from "@/context/app-context";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Trash2 } from "lucide-react";

export function AddItemsScreen() {
    const { activeClient, handleRemoveItem } = useAppContext();

    if(!activeClient) {
        return <div>No active client</div>
    }

    return (
        <div className="flex flex-col h-full gap-4">
            <div>
                <h3 className="text-lg font-medium mb-3">Add to Tab</h3>
                <AddItemForm />
            </div>

            <div className="flex-grow flex flex-col gap-2">
                <h3 className="text-lg font-medium">Current Items</h3>
                 {activeClient.currentTab.length > 0 ? (
                    <ScrollArea className="flex-grow pr-1">
                        <div className="space-y-2">
                        {activeClient.currentTab.map((item) => (
                            <div
                            key={item.id}
                            className="flex justify-between items-center p-3 rounded-lg bg-secondary"
                            >
                            <div className="flex-grow">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.price)}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(activeClient.id, item.id)}
                                className="text-muted-foreground hover:text-destructive h-9 w-9"
                            >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Remove item</span>
                            </Button>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="text-sm text-muted-foreground text-center py-6 bg-secondary rounded-lg flex-grow flex items-center justify-center">
                        <p>No items added yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
