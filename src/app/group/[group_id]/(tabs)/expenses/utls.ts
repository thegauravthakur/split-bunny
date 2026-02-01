import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"

export function calculateUserBalance(userId: string, expenses: ExpenseWithSplits[]): number {
    let totalBalance = 0

    for (const expense of expenses) {
        const userSplit = expense.splits.find((split) => split.user_id === userId)
        const userOwes = userSplit ? userSplit.amount : 0
        const userPaid = expense.paid_by === userId ? expense.amount : 0
        totalBalance += userPaid - userOwes
    }

    // Round to 2 decimal places to avoid floating-point accumulation errors
    return Math.round(totalBalance * 100) / 100
}
