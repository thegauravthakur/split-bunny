"use server"

import { auth } from "@clerk/nextjs/server"
import { err, ok } from "neverthrow"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createParsableResultInterface } from "@/app/utils/result"
import prisma from "@/lib/prisma"

const addNewMemberSchema = z.object({
    name: z.string().min(1, "Name is required.").max(100, "Name is too long."),
    email: z
        .string({ message: "Email is required." })
        .email("Please enter a valid email address."),
    group_id: z.string({ message: "Group ID is required." }),
})

export async function addNewMember(formData: FormData) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return createParsableResultInterface(err(["You must be logged in."]))
        }

        const data = Object.fromEntries(formData.entries())
        const parseResult = addNewMemberSchema.safeParse(data)

        if (!parseResult.success) {
            const errors = parseResult.error.errors.map((error) => error.message)
            return createParsableResultInterface(err(errors))
        }

        const { name, email, group_id } = parseResult.data

        // Verify user is a member of the group
        const group = await prisma.group.findUnique({
            where: { id: group_id, member_ids: { has: userId } },
        })

        if (!group) {
            return createParsableResultInterface(err(["Group not found."]))
        }

        // Check if email already has an invitation for this group
        const existingInvitation = await prisma.invitation.findFirst({
            where: { email: email.toLowerCase(), group_id },
        })

        if (existingInvitation) {
            return createParsableResultInterface(
                err(["This email has already been invited to the group."])
            )
        }

        // Check if email belongs to an existing Clerk member in the group
        const { clerkClient } = await import("@clerk/nextjs/server")
        const client = await clerkClient()
        const existingUsers = await client.users.getUserList({
            emailAddress: [email.toLowerCase()],
        })

        const existingUser = existingUsers.data[0]
        if (existingUser && group.member_ids.includes(existingUser.id)) {
            return createParsableResultInterface(
                err(["This person is already a member of the group."])
            )
        }

        // Create invitation and add placeholder to group members in a transaction
        const invitation = await prisma.$transaction(async (tx) => {
            // Create the invitation
            const newInvitation = await tx.invitation.create({
                data: {
                    name,
                    email: email.toLowerCase(),
                    group_id,
                },
            })

            // Add placeholder ID to group's member_ids
            await tx.group.update({
                where: { id: group_id },
                data: {
                    member_ids: {
                        push: newInvitation.placeholder,
                    },
                },
            })

            return newInvitation
        })

        revalidatePath(`/group/${group_id}`)
        return createParsableResultInterface(
            ok([`${invitation.name} has been added to the group.`])
        )
    } catch (error) {
        console.error("Error adding member:", error)
        return createParsableResultInterface(
            err(["Failed to add member. Please try again."])
        )
    }
}
