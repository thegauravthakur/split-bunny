"use server"

import { auth } from "@clerk/nextjs/server"
import type { Group } from "@prisma/client"
import { err, ok, Result } from "neverthrow"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { createParsableResultInterface } from "@/app/utils/result"
import prisma from "@/lib/prisma"

async function createGroup(name: string, _userId?: string): Promise<Result<Group, string[]>> {
    let userId = _userId

    try {
        if (!userId) {
            const _auth = await auth()
            userId = _auth.userId ?? undefined
        }

        if (!userId) {
            return err(["You must be logged in to create a group."])
        }

        const group = await prisma.group.create({
            data: { name, member_ids: [userId], image: "" },
        })

        return ok(group)
    } catch (_error) {
        return err(["An error occurred while creating the group. Please try again."])
    }
}

const createGroupSchema = z.object({
    name: z
        .string()
        .min(3, "Group name must be at least 3 characters.")
        .max(50, "Group name must be at most 50 characters."),
})

export async function createGroupAction(formData: FormData) {
    let groupId: string | undefined
    const name = formData.get("name") as string
    const parseResult = createGroupSchema.safeParse({ name })

    if (!parseResult.success) {
        const data = parseResult.error.errors.map((error) => error.message)
        return createParsableResultInterface(ok(data))
    }
    try {
        const response = await createGroup(name)
        if (response.isErr()) {
            return createParsableResultInterface(err(response.error))
        } else {
            groupId = response.value.id
        }
    } catch (_error) {
        return createParsableResultInterface(err(["An error occurred. Please try again."]))
    }

    if (groupId) {
        revalidatePath("/")
        redirect(`/group/${groupId}`)
    }
}
