import {clerkClient, User} from "@clerk/nextjs/server";

import {Member} from "@/app/group/[group_id]/components/new-expense-button";

export async function getUserDetails(...userIds: string[]) {
    const client = await clerkClient()
    const users = await client.users.getUserList({ userId: userIds })
    return users.data
}

export function trimMembersDetails(users: User[]): Member[] {
    return users.map((user) => ({
        name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? user.id,
        id: user.id,
        image: user.imageUrl,
    }))
}