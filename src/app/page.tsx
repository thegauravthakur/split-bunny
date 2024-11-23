import { currentUser } from "@clerk/nextjs/server"
import { format } from "date-fns"
import Link from "next/link"

import { CreateNewGroupCard } from "@/app/components/create-new-group-card"
import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"

export default async function Home() {
    const user = await currentUser()
    const groups = await prisma.group.findMany({
        where: { member_ids: { has: user?.id } },
        orderBy: { created_at: "desc" },
    })

    return (
        <div>
            <main className={cn("max-w-screen-lg mx-auto grid grid-cols-3 gap-4 mt-20")}>
                <CreateNewGroupCard />
                {groups.map((group) => (
                    <Link
                        key={group.id}
                        className="border rounded-md shadow p-4 flex flex-col justify-between gap-y-4"
                        href={`/group/${group.id}`}
                    >
                        <h3 className="capitalize">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {format(group.created_at, "MMMM dd, yyyy")}
                        </p>
                    </Link>
                ))}
            </main>
        </div>
    )
}
