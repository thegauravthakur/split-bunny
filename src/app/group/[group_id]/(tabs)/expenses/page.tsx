import { auth } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import React from "react"
import { IoIosAdd } from "react-icons/io"

import { getUserDetails, trimMembersDetails } from "@/app/group/[group_id]/(tabs)/utils"
import { ExpenseCard } from "@/app/group/[group_id]/components/expense-cart"
import { Member, NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
import { getDevice } from "@/app/utils/device/device.server"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"

export type ExpenseWithSplits = Prisma.ExpenseGetPayload<{ include: { splits: true } }>

interface PageProps {
    params: Promise<{ group_id: string }>
}

function getExpensesByMonth(expenses: ExpenseWithSplits[]) {
    return expenses.reduce(
        (acc, expense) => {
            const month = format(expense.created_at, "MMMM")
            if (!acc[month]) acc[month] = []
            acc[month].push(expense)
            return acc
        },
        {} as Record<string, ExpenseWithSplits[]>,
    )
}

export default async function Page({ params }: PageProps) {
    const { group_id } = await params
    const device = await getDevice()

    const { userId } = await auth()
    const group = await prisma.group.findUnique({
        where: { id: group_id, member_ids: { has: userId } },
        include: { Invitation: true },
    })

    if (!group) notFound()

    const expenses = await prisma.expense.findMany({
        where: { group_id: group_id },
        orderBy: { created_at: "desc" },
        include: { splits: true },
    })

    // Get Clerk users for real user IDs
    const clerkUsers = await getUserDetails(...group.member_ids)
    const clerkMembers = trimMembersDetails(clerkUsers)
    const clerkUserIds = new Set(clerkUsers.map((u) => u.id))

    // Find placeholder IDs (invited members not yet in Clerk)
    const placeholderIds = group.member_ids.filter((id) => !clerkUserIds.has(id))

    // Map invitations by placeholder ID
    const invitationsByPlaceholder = new Map(
        group.Invitation.map((inv) => [inv.placeholder, inv])
    )

    // Build invited members list
    const invitedMembers: Member[] = placeholderIds
        .map((placeholderId) => {
            const invitation = invitationsByPlaceholder.get(placeholderId)
            if (!invitation) return null
            return {
                id: placeholderId,
                name: invitation.name,
                image: "", // Empty image for invited members
            }
        })
        .filter((m): m is Member => m !== null)

    const members = [...clerkMembers, ...invitedMembers]

    const expensesByMonth = getExpensesByMonth(expenses)

    return (
        <main>
            {expenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-6">
                    <h4 className="font-semibold">No Expenses</h4>
                    <p className="text-muted-foreground text-sm max-w-72 text-center">
                        You haven&#39;t added any expenses yet. Start by adding some.
                    </p>
                    <span className="mt-6">
                        <NewExpenseButton
                            device={device}
                            groupId={group_id}
                            members={members}
                            userId={userId as string}
                        >
                            <Button className="[&_svg]:size-6" variant="secondary">
                                <IoIosAdd />
                                <span>New Expense</span>
                            </Button>
                        </NewExpenseButton>
                    </span>
                </div>
            ) : (
                Object.keys(expensesByMonth).map((month) => (
                    <div key={month} className="my-6 text-sm">
                        <h4 className="font-semibold">{month}</h4>
                        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                            {expensesByMonth[month].map((expense) => (
                                <li key={expense.id}>
                                    <ExpenseCard expense={expense} members={members} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </main>
    )
}
