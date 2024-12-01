import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import React, { ReactNode } from "react"
import { IoIosAdd } from "react-icons/io"

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
        <div className="max-w-screen-xl mx-auto w-full mb-10">
            <header className="border-b py-6 lg:py-6 px-2 md:px-6 lg:px-10">
                <div className="flex items-center gap-x-4">
                    <Avatar className="size-14 md:size-16">
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
                        <Button
                            className="fixed z-20 bg-white md:static shadow-md md:shadow-none bottom-4 right-4 size-10 md:size-auto [&_svg]:size-8 md:[&_svg]:size-6"
                            variant="secondary"
                        >
                            <IoIosAdd className="bg-white" />
                            <span className="hidden md:block">New Expense</span>
                        </Button>
                    </NewExpenseButton>
                </div>
            </header>
            <div className="px-2 md:px-4 lg:px-10">
                <TabGroup group_id={group_id} />
                {children}
            </div>
        </div>
    )
}
