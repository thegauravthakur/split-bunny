import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"
import { calculateUserBalance } from "@/app/group/[group_id]/(tabs)/expenses/utls"
import { AddNewMemberCard } from "@/app/group/[group_id]/(tabs)/members/components/add-new-member-card"
import { MemberCard } from "@/app/group/[group_id]/(tabs)/members/components/member-card"
import { getUserDetails } from "@/app/group/[group_id]/(tabs)/utils"
import prisma from "@/lib/prisma"

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
        <div>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
                {members.map((member) => (
                    <li key={member.name}>
                        <MemberCard member={member} />
                    </li>
                ))}
                <li>
                    <AddNewMemberCard />
                </li>
            </ul>
        </div>
    )
}
