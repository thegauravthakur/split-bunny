"use client"

import { format } from "date-fns"
import { ReactNode } from "react"

import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface ExpenseCardWrapperProps {
    expense: ExpenseWithSplits
    device: "mobile" | "desktop"
    cardContent: ReactNode
    detailContent: ReactNode
    editButton: ReactNode
}

export function ExpenseCardWrapper({
    expense,
    device,
    cardContent,
    detailContent,
    editButton,
}: ExpenseCardWrapperProps) {
    if (device === "desktop") {
        return (
            <div className="relative">
                <Sheet>
                    <SheetTrigger asChild>{cardContent}</SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle>{expense.name}</SheetTitle>
                            <SheetDescription>
                                {format(expense.created_at, "MMMM d, yyyy")}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">{detailContent}</div>
                    </SheetContent>
                </Sheet>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{editButton}</div>
            </div>
        )
    }

    return (
        <div className="relative">
            <Drawer>
                <DrawerTrigger asChild>{cardContent}</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{expense.name}</DrawerTitle>
                        <DrawerDescription>
                            {format(expense.created_at, "MMMM d, yyyy")}
                        </DrawerDescription>
                    </DrawerHeader>
                    {detailContent}
                </DrawerContent>
            </Drawer>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{editButton}</div>
        </div>
    )
}
