import { redirect } from "next/navigation"

interface PageProps {
    params: Promise<{ group_id: string }>
}
export default async function Page({ params }: PageProps) {
    const { group_id } = await params
    redirect(`/group/${group_id}/expenses`)
}
