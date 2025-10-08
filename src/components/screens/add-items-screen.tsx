'use client';
import { AddItemForm } from "@/components/app/add-item-form";
import { useAppContext } from "@/context/app-context";

export function AddItemsScreen() {
    const { activeClient } = useAppContext();

    if(!activeClient) {
        return <div>No active client</div>
    }

    return (
        <AddItemForm />
    )
}
