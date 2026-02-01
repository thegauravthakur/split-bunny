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
        include: { Invitation: true },
    })

    if (!group) notFound()

    const expenses = await prisma.expense.findMany({
        where: { group_id: group_id },
        include: { splits: true },
    })

    // Get Clerk users for real user IDs
    const clerkUsers = await getUserDetails(...group.member_ids)
    const clerkUserIds = new Set(clerkUsers.map((u) => u.id))

    // Find placeholder IDs (invited members not yet in Clerk)
    const placeholderIds = group.member_ids.filter((id) => !clerkUserIds.has(id))

    // Map invitations by placeholder ID for quick lookup
    const invitationsByPlaceholder = new Map(
        group.Invitation.map((inv) => [inv.placeholder, inv])
    )

    // Build member list from Clerk users
    const clerkMembers = clerkUsers.map((user) => ({
        id: user.id,
        name: user.id === userId ? "You" : user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Unknown",
        profile: user.imageUrl,
        totalSpent: getTotalAmountSpendByUser(user.id, expenses),
        balance: calculateUserBalance(user.id, expenses),
        isInvited: false,
    }))

    // Build member list from invitations (placeholder IDs)
    const invitedMembers = placeholderIds
        .map((placeholderId) => {
            const invitation = invitationsByPlaceholder.get(placeholderId)
            if (!invitation) return null
            return {
                id: placeholderId,
                name: invitation.name,
                profile: null as string | null,
                totalSpent: getTotalAmountSpendByUser(placeholderId, expenses),
                balance: calculateUserBalance(placeholderId, expenses),
                isInvited: true as const,
                email: invitation.email,
            }
        })
        .filter((m): m is NonNullable<typeof m> => m !== null)

    const members = [...clerkMembers, ...invitedMembers]

    return (
        <div>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
                {members.map((member) => (
                    <li key={member.id}>
                        <MemberCard member={member} />
                    </li>
                ))}
                <li>
                    <AddNewMemberCard groupId={group_id} />
                </li>
            </ul>
        </div>
    )
}
