import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

import { calculateUserBalance } from "@/app/group/[group_id]/(tabs)/expenses/utls"
import { DeleteGroupButton } from "@/app/group/[group_id]/(tabs)/settings/components/delete-group-button"
import prisma from "@/lib/prisma"

interface PageProps {
    params: Promise<{ group_id: string }>
}

const BALANCE_TOLERANCE = 0.01

export default async function Page({ params }: PageProps) {
    const { group_id } = await params

    const { userId } = await auth()
    const group = await prisma.group.findUnique({
        where: { id: group_id, member_ids: { has: userId } },
    })

    if (!group) notFound()

    // Get all expenses to check if settled
    const expenses = await prisma.expense.findMany({
        where: { group_id },
        include: { splits: true },
    })

    // Check if all expenses are settled
    const isSettled =
        expenses.length === 0 ||
        group.member_ids.every(
            (memberId) => Math.abs(calculateUserBalance(memberId, expenses)) <= BALANCE_TOLERANCE,
        )

    return (
        <div className="mt-10 max-w-md">
            <section className="border border-destructive/50 rounded-lg p-4">
                <h3 className="font-semibold text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {isSettled
                        ? "Once you delete a group, there is no going back. Please be certain."
                        : "You cannot delete this group until all expenses are settled. Make sure everyone has paid their share."}
                </p>
                <DeleteGroupButton
                    groupId={group_id}
                    groupName={group.name}
                    isSettled={isSettled}
                />
            </section>
        </div>
    )
}
