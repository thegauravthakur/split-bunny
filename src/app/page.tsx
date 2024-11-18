import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { format } from "date-fns"
import { CreateNewGroupCard } from "@/app/components/create-new-group-card"
import Link from "next/link"

export default async function Home() {
    const user = await currentUser()
    const groups = await prisma.group.findMany({
        where: { member_ids: { has: user?.id } },
    })

    return (
        <div>
            <main className={cn("max-w-screen-lg mx-auto grid grid-cols-3 gap-4 mt-20")}>
                <CreateNewGroupCard />
                {groups.map((group) => (
                    <Link
                        href={`/group/${group.id}`}
                        key={group.id}
                        className="border rounded-md shadow p-4 flex flex-col justify-between gap-y-4"
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
