import { auth, clerkClient, User } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import { format } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"
import { CiSettings } from "react-icons/ci"
import { IoIosAdd, IoIosArrowRoundBack } from "react-icons/io"
import { MdDelete } from "react-icons/md"

import { ExpenseCard } from "@/app/group/[group_id]/components/expense-cart"
import { InfoCard } from "@/app/group/[group_id]/components/info-cart"
import { Member, NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"

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

export async function getUserDetails(...userIds: string[]) {
    const client = await clerkClient()
    const users = await client.users.getUserList({ userId: userIds })
    return users.data
}

function trimMembersDetails(users: User[]): Member[] {
    return users.map((user) => ({
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? user.id,
        id: user.id,
        image: user.imageUrl,
    }))
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

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    const totalMembers = group.member_ids.length

    const expensesByMonth = getExpensesByMonth(expenses)

    return (
        <main className="max-w-screen-xl mx-auto w-full">
            <header className="border-b py-6 px-10">
                <Button asChild className="-ml-4" variant="ghost">
                    <Link href={"/"}>
                        <IoIosArrowRoundBack />
                        <span className="capitalize">all groups</span>
                    </Link>
                </Button>
                <div className="flex items-center gap-x-4 mt-4">
                    <Avatar className="size-16">
                        <AvatarImage src="https://github.com/thegauravthakur.png" />
                        <AvatarFallback>GT</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="font-semibold capitalize">{group.name}</h2>
                        <p className="text-sm">
                            Created by <span className="font-semibold">You</span>
                        </p>
                    </div>
                    <ul className="flex items-center gap-x-1">
                        <li>
                            <Button className="size-10 [&_svg]:size-6" variant="ghost">
                                <CiSettings />
                            </Button>
                        </li>
                        <li>
                            <Button className="size-10 [&_svg]:size-6" variant="ghost">
                                <MdDelete />
                            </Button>
                        </li>
                        <li>
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
                        </li>
                    </ul>
                </div>
                <ul className={cn("gap-5 mt-6 flex overflow-x-auto -mx-6 no-scrollbar")}>
                    <li className="flex-1 min-w-60">
                        <InfoCard
                            description={"from Rudra"}
                            subTitle="$2500"
                            title={"You'll get"}
                        />
                    </li>
                    <li className="flex-1 min-w-60">
                        <InfoCard
                            description="have been done"
                            subTitle={`$${totalExpenses}`}
                            title={"Total Transactions"}
                        />
                    </li>
                    <li className="flex-1 min-w-60">
                        <InfoCard
                            description="have joined"
                            subTitle={String(totalMembers)}
                            title={`Total ${totalMembers > 1 ? "Members" : "Member"}`}
                        />
                    </li>
                </ul>
            </header>
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
                            <li key={expense.id}>
                                <ExpenseCard expense={expense} members={members} />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </main>
    )
}
