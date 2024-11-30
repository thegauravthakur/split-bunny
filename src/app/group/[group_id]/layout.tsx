import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import React, { ReactNode } from "react"
import { IoIosAdd, IoIosArrowRoundBack } from "react-icons/io"

import { getUserDetails, trimMembersDetails } from "@/app/group/[group_id]/(tabs)/utils"
import { NewExpenseButton } from "@/app/group/[group_id]/components/new-expense-button"
import { TabGroup } from "@/app/group/[group_id]/components/tab-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"

interface LayoutProps {
    children: ReactNode
    params: Promise<{ group_id: string }>
}

export default async function Layout({ params, children }: LayoutProps) {
    const { group_id } = await params

    const { userId } = await auth()
    const group = await prisma.group.findUnique({
        where: { id: group_id, member_ids: { has: userId } },
    })

    if (!group) notFound()

    const userDetails = await getUserDetails(...group.member_ids)
    const members = trimMembersDetails(userDetails)

    return (
        <div className="max-w-screen-xl mx-auto w-full">
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
                </div>
            </header>
            <TabGroup group_id={group_id} />
            {children}
        </div>
    )
}
