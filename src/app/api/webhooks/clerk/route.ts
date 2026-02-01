import { WebhookEvent } from "@clerk/nextjs/server"
import { headers } from "next/headers"
import { Webhook } from "svix"

import prisma from "@/lib/prisma"

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        console.error("Missing CLERK_WEBHOOK_SECRET environment variable")
        return new Response("Webhook secret not configured", { status: 500 })
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", { status: 400 })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Verify the webhook signature
    const wh = new Webhook(WEBHOOK_SECRET)
    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("Webhook signature verification failed:", err)
        return new Response("Invalid signature", { status: 400 })
    }

    // Handle the user.created event
    if (evt.type === "user.created") {
        const { id: userId, email_addresses } = evt.data

        // Get all email addresses for this user
        const emails = email_addresses.map((e) => e.email_address.toLowerCase()).filter(Boolean)

        if (emails.length === 0) {
            return new Response("No email addresses found", { status: 200 })
        }

        try {
            // Find all invitations matching any of the user's emails
            const invitations = await prisma.invitation.findMany({
                where: {
                    email: { in: emails },
                },
            })

            if (invitations.length === 0) {
                return new Response("No pending invitations", { status: 200 })
            }

            console.log(`Found ${invitations.length} invitation(s) for user ${userId}`)

            // Process each invitation
            for (const invitation of invitations) {
                const { placeholder, group_id, id: invitationId } = invitation

                await prisma.$transaction(async (tx) => {
                    // 1. Replace placeholder in Group.member_ids
                    const group = await tx.group.findUnique({
                        where: { id: group_id },
                    })

                    if (group && group.member_ids.includes(placeholder)) {
                        const updatedMemberIds = group.member_ids.map((id) =>
                            id === placeholder ? userId : id,
                        )

                        await tx.group.update({
                            where: { id: group_id },
                            data: { member_ids: updatedMemberIds },
                        })
                    }

                    // 2. Replace placeholder in Expense.paid_by
                    await tx.expense.updateMany({
                        where: {
                            group_id,
                            paid_by: placeholder,
                        },
                        data: { paid_by: userId },
                    })

                    // 3. Replace placeholder in Expense.created_by
                    await tx.expense.updateMany({
                        where: {
                            group_id,
                            created_by: placeholder,
                        },
                        data: { created_by: userId },
                    })

                    // 4. Replace placeholder in Split.user_id
                    // Need to get expense IDs for this group first
                    const groupExpenses = await tx.expense.findMany({
                        where: { group_id },
                        select: { id: true },
                    })

                    const expenseIds = groupExpenses.map((e) => e.id)

                    await tx.split.updateMany({
                        where: {
                            expense_id: { in: expenseIds },
                            user_id: placeholder,
                        },
                        data: { user_id: userId },
                    })

                    // 5. Delete the invitation
                    await tx.invitation.delete({
                        where: { id: invitationId },
                    })
                })

                console.log(
                    `Processed invitation for group ${group_id}: ${placeholder} → ${userId}`,
                )
            }

            return new Response("Invitations processed successfully", { status: 200 })
        } catch (error) {
            console.error("Error processing invitations:", error)
            return new Response("Error processing invitations", { status: 500 })
        }
    }

    // Return 200 for other event types
    return new Response("Event type not handled", { status: 200 })
}
