import { currentUser } from "@clerk/nextjs/server"
import { format } from "date-fns"
import Link from "next/link"

import { CreateNewGroupCard } from "@/app/components/create-new-group-card"
import { PlainCard } from "@/app/components/plain-cart"
import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"

export default async function Home() {
    const user = await currentUser()
    const groups = await prisma.group.findMany({
        where: { member_ids: { has: user?.id } },
        orderBy: { created_at: "desc" },
    })

    return (
        <div className="max-w-(--breakpoint-lg) md:mx-auto px-4">
            <h3 className="text-lg font-bold mt-4 md:mt-10 mb-4 capitalize">groups</h3>
            <main className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full")}>
                <CreateNewGroupCard />
                {groups.map((group) => (
                    <PlainCard
                        key={group.id}
                        description={format(group.created_at, "MMMM dd, yyyy")}
                        title={group.name}
                        triggerElement={
                            <Link aria-label={group.name} href={`/group/${group.id}`} />
                        }
                    />
                ))}
            </main>
        </div>
    )
}
