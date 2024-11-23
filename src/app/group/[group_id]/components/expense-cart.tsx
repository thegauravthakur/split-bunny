import { Prisma } from "@prisma/client"
import { Member, NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
import { auth } from "@clerk/nextjs/server"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CiEdit, CiReceipt } from "react-icons/ci"
import { Button } from "@/components/ui/button"
import React from "react"
import { ExpenseWithSplits } from "@/app/group/[group_id]/page"

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
                members={members}
                groupId={expense.group_id}
                expense={expense}
                userId={userId as string}
            >
                <Button variant="ghost" className="size-10 [&_svg]:size-6">
                    <CiEdit />
                </Button>
            </NewExpenseButton>
        </div>
    )
}
