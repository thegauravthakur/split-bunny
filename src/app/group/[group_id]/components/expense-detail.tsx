"use client"

import { format } from "date-fns"
import { useTransition } from "react"
import { CiReceipt, CiTrash } from "react-icons/ci"
import { toast } from "sonner"

import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"
import { deleteExpenseAction } from "@/app/group/[group_id]/action"
import { Member } from "@/app/group/[group_id]/components/new-expense-button"
import { formattedNumber } from "@/app/utils/words"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"
import { SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface ExpenseDetailProps {
    expense: ExpenseWithSplits
    members: Member[]
    currentUserId: string
    device?: "mobile" | "desktop"
}

export function ExpenseDetail({
    expense,
    members,
    currentUserId,
    device = "mobile",
}: ExpenseDetailProps) {
    const [isPending, startTransition] = useTransition()
    const paidByMember = members.find((m) => m.id === expense.paid_by)
    const isPaidByMe = expense.paid_by === currentUserId
    const CloseComponent = device === "desktop" ? SheetClose : DrawerClose

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteExpenseAction(expense.id, expense.group_id)
            if ("error" in result) {
                const errors = result.error as string[]
                toast.error(errors[0])
            } else {
                toast.success("Expense deleted")
            }
        })
    }

    return (
        <div className="px-4 pb-6 space-y-6">
            {/* Header with expense name and amount */}
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-secondary flex items-center justify-center">
                    <CiReceipt className="size-6" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{expense.name}</h3>
                    <p className="text-2xl font-bold">{formattedNumber(expense.amount)}</p>
                </div>
            </div>

            {/* Paid by section */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <Avatar className="size-8">
                    <AvatarImage src={paidByMember?.image} />
                    <AvatarFallback>{paidByMember?.name?.charAt(0) ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Paid by</p>
                    <p className="font-medium">{isPaidByMe ? "You" : paidByMember?.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                    {format(expense.created_at, "MMM d, yyyy")}
                </p>
            </div>

            {/* Description */}
            {expense.description && (
                <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{expense.description}</p>
                </div>
            )}

            {/* Split breakdown */}
            <div>
                <p className="text-sm text-muted-foreground mb-3">Split breakdown</p>
                <ul className="space-y-2">
                    {expense.splits.map((split) => {
                        const member = members.find((m) => m.id === split.user_id)
                        const isMe = split.user_id === currentUserId
                        const isPayer = split.user_id === expense.paid_by

                        // Calculate what this person owes or is owed
                        const paidAmount = isPayer ? expense.amount : 0
                        const netBalance = paidAmount - split.amount

                        return (
                            <li
                                key={split.id}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
                            >
                                <Avatar className="size-8">
                                    <AvatarImage src={member?.image} />
                                    <AvatarFallback>
                                        {member?.name?.charAt(0) ?? "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">
                                        {isMe ? "You" : member?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        owes {formattedNumber(split.amount)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={cn(
                                            "text-sm font-medium",
                                            netBalance > 0
                                                ? "text-green-600 dark:text-green-400"
                                                : netBalance < 0
                                                  ? "text-red-600 dark:text-red-400"
                                                  : "text-muted-foreground",
                                        )}
                                    >
                                        {netBalance > 0
                                            ? `+${formattedNumber(netBalance)}`
                                            : netBalance < 0
                                              ? formattedNumber(netBalance)
                                              : "Settled"}
                                    </p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Delete button */}
            <CloseComponent asChild>
                <Button
                    className="w-full"
                    disabled={isPending}
                    variant="destructive"
                    onClick={handleDelete}
                >
                    <CiTrash className="size-5 mr-2" />
                    {isPending ? "Deleting..." : "Delete Expense"}
                </Button>
            </CloseComponent>
        </div>
    )
}
