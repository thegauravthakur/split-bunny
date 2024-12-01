import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"
import { calculateUserBalance } from "@/app/group/[group_id]/(tabs)/expenses/utls"
import { getUserDetails } from "@/app/group/[group_id]/(tabs)/utils"
import { formattedNumber } from "@/app/utils/words"
import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"

interface PageProps {
    params: Promise<{ group_id: string }>
}

function getTotalAmountSpendByUser(userId: string, expenses: ExpenseWithSplits[]) {
    return expenses.reduce((acc, expense) => {
        const expenseSpend = expense.splits.reduce((acc, split) => {
            if (split.user_id === userId) return acc + split.amount
            return acc
        }, 0)
        return acc + expenseSpend
    }, 0)
}

export default async function Page({ params }: PageProps) {
    const { group_id } = await params

    const { userId } = await auth()
    const group = await prisma.group.findUnique({
        where: { id: group_id, member_ids: { has: userId } },
    })

    if (!group) notFound()

    const expenses = await prisma.expense.findMany({
        where: { group_id: group_id },
        include: { splits: true },
    })

    const userDetails = await getUserDetails(...group.member_ids)

    const members = userDetails.map((user) => ({
        name: user.id === userId ? "You" : user.fullName,
        profile: user.imageUrl,
        totalSpent: getTotalAmountSpendByUser(user.id, expenses),
        balance: calculateUserBalance(user.id, expenses),
    }))

    return (
        <ul className="grid grid-cols-2 gap-4 mt-10">
            {members.map((member) => (
                <li key={member.name}>
                    <MemberCard member={member} />
                </li>
            ))}
        </ul>
    )
}

interface MemberWithBalance {
    name: string | null
    profile: string
    totalSpent: number
    balance: number
}

interface MemberCardProps {
    member: MemberWithBalance
}

function MemberCard({ member }: MemberCardProps) {
    return (
        <div className="flex items-center gap-x-4 border shadow-sm p-3 rounded-lg">
            <img alt={member.name ?? ""} className="w-12 h-12 rounded-full" src={member.profile} />
            <div className="flex-1">
                <h6 className="font-semibold">{member.name}</h6>
                <p className="text-sm text-muted-foreground">
                    Spend: {formattedNumber(member.totalSpent)}
                </p>
            </div>
            <p
                className={cn(
                    "text-sm font-semibold",
                    member.balance > 0 ? "text-green-700" : "text-red-600",
                )}
            >
                {formattedNumber(member.balance)}
            </p>
        </div>
    )
}
