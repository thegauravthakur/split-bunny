import { auth } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import React from "react"
import { IoIosAdd } from "react-icons/io"

import { getUserDetails, trimMembersDetails } from "@/app/group/[group_id]/(tabs)/utils"
import { ExpenseCard } from "@/app/group/[group_id]/components/expense-cart"
import { NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
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

    const { userId } = await auth()
    const group = await prisma.group.findUnique({
        where: { id: group_id, member_ids: { has: userId } },
    })

    if (!group) notFound()

    const expenses = await prisma.expense.findMany({
        where: { group_id: group_id },
        orderBy: { created_at: "desc" },
        include: { splits: true },
    })

    const userDetails = await getUserDetails(...group.member_ids)
    const members = trimMembersDetails(userDetails)

    const expensesByMonth = getExpensesByMonth(expenses)

    return (
        <main className="">
            {expenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 mt-6">
                    <h4 className="font-semibold">No Expenses</h4>
                    <p className="text-muted-foreground text-sm">
                        You haven&#39;t added any expenses yet. Start by adding some.
                    </p>
                    <span className="mt-6">
                        <NewExpenseButton
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
            ) : null}
            {Object.keys(expensesByMonth).map((month) => (
                <div key={month} className="mt-6 text-sm px-4">
                    <h4 className="font-semibold">{month}</h4>
                    <ul className="grid grid-cols-2 gap-4 mt-4">
                        {expensesByMonth[month].map((expense) => (
                            <li key={expense.id} className="">
                                <ExpenseCard expense={expense} members={members} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </main>
    )
}
