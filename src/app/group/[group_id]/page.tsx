import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

interface PageProps {
    params: Promise<{ group_id: string }>
}

export default async function Page({ params }: PageProps) {
    const { group_id } = await params
    const group = await prisma.group.findUnique({ where: { id: group_id } })

    if (!group) notFound()

    return (
        <div>
            <h1>Welcome to {group.name}</h1>
        </div>
    )
}
