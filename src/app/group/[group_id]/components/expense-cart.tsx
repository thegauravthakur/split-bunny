import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import React from "react"
import { CiEdit, CiReceipt } from "react-icons/ci"

import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"
import { ExpenseCardWrapper } from "@/app/group/[group_id]/components/expense-card-wrapper"
import { ExpenseDetail } from "@/app/group/[group_id]/components/expense-detail"
import { Member, NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
import { getDevice } from "@/app/utils/device/device.server"
import { formattedNumber } from "@/app/utils/words"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ExpenseCardProps {
    expense: ExpenseWithSplits
    members: Member[]
}

/**
 * Calculates the user's balance for a single expense
 * Positive = user is owed money, Negative = user owes money
 */
function getUserExpenseBalance(expense: ExpenseWithSplits, userId: string): number {
    const userSplit = expense.splits.find((s) => s.user_id === userId)
    const userOwes = userSplit?.amount ?? 0
    const userPaid = expense.paid_by === userId ? expense.amount : 0
    return userPaid - userOwes
}

export async function ExpenseCard({ expense, members }: ExpenseCardProps) {
    const { userId } = await auth()
    const device = await getDevice()
    const isPaidByMe = userId === expense.paid_by
    const paidBy = members.find((member) => member.id === expense.paid_by)?.name

    const userBalance = getUserExpenseBalance(expense, userId as string)
    const isOwed = userBalance > 0
    const owes = userBalance < 0

    const cardContent = (
        <div
            className={cn(
                "rounded-xl border p-4 pr-14 shadow-xs flex items-center gap-x-2 cursor-pointer hover:bg-accent/50 transition-colors",
            )}
        >
            <div className="flex flex-col text-muted-foreground text-xs text-center min-w-10">
                <span>{format(expense.created_at, "MMM")}</span>
                <span className="text-base font-medium text-foreground">
                    {format(expense.created_at, "dd")}
                </span>
            </div>
            {device === "desktop" && <CiReceipt fontSize={42} />}
            <div className="flex-1 min-w-0">
                <h5 className="font-semibold truncate">{expense.name}</h5>
                <p className="text-sm text-muted-foreground">
                    {isPaidByMe ? "You paid" : `${paidBy} paid`} {formattedNumber(expense.amount)}
                </p>
            </div>
            <div className="flex flex-col items-end gap-1">
                {isOwed && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                        you are owed
                    </p>
                )}
                {owes && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">you owe</p>
                )}
                {userBalance !== 0 && (
                    <p
                        className={cn(
                            "text-sm font-semibold",
                            isOwed && "text-green-600 dark:text-green-400",
                            owes && "text-red-600 dark:text-red-400",
                        )}
                    >
                        {formattedNumber(Math.abs(userBalance))}
                    </p>
                )}
                {userBalance === 0 && (
                    <p className="text-xs text-muted-foreground mr-2">not involved</p>
                )}
            </div>
        </div>
    )

    const editButton = (
        <NewExpenseButton
            device={device}
            expense={expense}
            groupId={expense.group_id}
            members={members}
            userId={userId as string}
        >
            <Button className="size-10 [&_svg]:size-6" variant="ghost">
                <CiEdit />
            </Button>
        </NewExpenseButton>
    )

    const detailContent = (
        <ExpenseDetail
            currentUserId={userId as string}
            device={device}
            expense={expense}
            members={members}
        />
    )

    return (
        <ExpenseCardWrapper
            cardContent={cardContent}
            detailContent={detailContent}
            device={device}
            editButton={editButton}
            expense={expense}
        />
    )
}
