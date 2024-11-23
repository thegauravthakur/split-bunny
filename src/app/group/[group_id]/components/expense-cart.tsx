import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import React from "react"
import { CiEdit, CiReceipt } from "react-icons/ci"

import { Member, NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
import { ExpenseWithSplits } from "@/app/group/[group_id]/page"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExpenseCardProps {
    expense: ExpenseWithSplits
    members: Member[]
}

export async function ExpenseCard({ expense, members }: ExpenseCardProps) {
    const { userId } = await auth()
    const isPaidByMe = userId === expense.created_by
    const paidBy = members.find((member) => member.id === expense.created_by)?.name

    return (
        <div className={cn("rounded-xl border p-4 shadow-sm flex items-center gap-x-2")}>
            <div className="flex flex-col text-muted-foreground">
                <span>{format(expense.created_at, "MMM")}</span>
                <span>{format(expense.created_at, "dd")}</span>
            </div>
            <CiReceipt fontSize={42} />
            <div className="flex-1">
                <h5 className="font-semibold">{expense.name}</h5>
                <p className="text-sm text-muted-foreground">
                    {isPaidByMe ? "You paid" : paidBy + " paid"} ₹{expense.amount}
                </p>
            </div>
            <NewExpenseButton
                expense={expense}
                groupId={expense.group_id}
                members={members}
                userId={userId as string}
            >
                <Button className="size-10 [&_svg]:size-6" variant="ghost">
                    <CiEdit />
                </Button>
            </NewExpenseButton>
        </div>
    )
}
