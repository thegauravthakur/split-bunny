import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import React from "react"
import { CiEdit, CiReceipt } from "react-icons/ci"

import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"
import { Member, NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
import { getDevice } from "@/app/utils/device/device.server"
import { formattedNumber } from "@/app/utils/words"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface ExpenseCardProps {
    expense: ExpenseWithSplits
    members: Member[]
}

export async function ExpenseCard({ expense, members }: ExpenseCardProps) {
    const { userId } = await auth()
    const device = await getDevice()
    const isPaidByMe = userId === expense.created_by
    const paidBy = members.find((member) => member.id === expense.created_by)?.name

    return (
        <Drawer>
            <div
                className={cn("rounded-xl border p-4 shadow-sm flex items-center gap-x-2 relative")}
            >
                <DrawerTrigger asChild>
                    <Button
                        aria-label="show expense details"
                        className="absolute inset-0 h-full w-full hover:bg-transparent"
                        variant="ghost"
                    />
                </DrawerTrigger>
                <div className="flex flex-col text-muted-foreground">
                    <span>{format(expense.created_at, "MMM")}</span>
                    <span>{format(expense.created_at, "dd")}</span>
                </div>
                <CiReceipt fontSize={42} />
                <div className="flex-1">
                    <h5 className="font-semibold">{expense.name}</h5>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>{isPaidByMe ? "You paid" : paidBy + " paid"}</span>
                        <span>{formattedNumber(expense.amount)}</span>
                    </p>
                </div>
                <NewExpenseButton
                    device={device}
                    expense={expense}
                    groupId={expense.group_id}
                    members={members}
                    userId={userId as string}
                >
                    <Button className="size-10 [&_svg]:size-6 relative z-10" variant="ghost">
                        <CiEdit />
                    </Button>
                </NewExpenseButton>
            </div>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Expenses</DrawerTitle>
                    <DrawerDescription>All expenses for this group</DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    )
}
