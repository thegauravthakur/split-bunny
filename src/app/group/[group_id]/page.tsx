import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CiSettings } from "react-icons/ci"
import { Button } from "@/components/ui/button"
import { MdDelete } from "react-icons/md"
import { IoIosArrowRoundBack } from "react-icons/io"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import { cn } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { CiReceipt } from "react-icons/ci"

interface PageProps {
    params: Promise<{ group_id: string }>
}

export default async function Page({ params }: PageProps) {
    const { group_id } = await params
    const { userId } = await auth()
    const group = await prisma.group.findUnique({
        where: { id: group_id, member_ids: { has: userId } },
    })

    if (!group) notFound()

    return (
        <main className="max-w-screen-xl mx-auto w-full">
            <header className="border-b py-6 px-10">
                <Button className="-ml-4" variant="ghost" asChild>
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
                            <Button variant="ghost" className="size-10 [&_svg]:size-6">
                                <CiSettings />
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" className="size-10 [&_svg]:size-6">
                                <MdDelete />
                            </Button>
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
                            subTitle="$5600"
                            title={"Total Transactions"}
                            description="have been done"
                        />
                    </li>
                    <li className="flex-1 min-w-60">
                        <InfoCard subTitle="2" title={"Total Members"} description="have joined" />
                    </li>
                </ul>
            </header>
            <div className="mt-6 text-sm px-4">
                <h4 className="font-semibold">February 2022</h4>
                <ul className="grid grid-cols-2 gap-4 mt-4">
                    <li>
                        <ExpenseCard />
                    </li>
                    <li>
                        <ExpenseCard />
                    </li>
                    <li>
                        <ExpenseCard />
                    </li>
                    <li>
                        <ExpenseCard />
                    </li>
                </ul>
            </div>
            <div className="mt-6 text-sm px-4">
                <h4 className="font-semibold">January 2024</h4>
                <ul className="grid grid-cols-2 gap-4 mt-4">
                    <li>
                        <ExpenseCard />
                    </li>
                    <li>
                        <ExpenseCard />
                    </li>
                    <li>
                        <ExpenseCard />
                    </li>
                    <li>
                        <ExpenseCard />
                    </li>
                </ul>
            </div>
        </main>
    )
}

interface InfoCardProps {
    title: string
    subTitle: string
    description: string
}

export function InfoCard({ title, subTitle, description }: InfoCardProps) {
    return (
        <Card>
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2")}>
                <CardTitle className={cn("text-sm font-medium")}>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold")}>{subTitle}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

export function ExpenseCard() {
    return (
        <div className={cn("rounded-xl border p-4 shadow-sm flex items-center gap-x-2")}>
            <div className="flex flex-col text-muted-foreground">
                <span>Jan</span>
                <span>06</span>
            </div>
            <CiReceipt fontSize={42} />
            <div>
                <h5 className="font-semibold">Meghana Biryani</h5>
                <p className="text-sm text-muted-foreground">You paid $120</p>
            </div>
        </div>
    )
}
