"use server"

import { z } from "zod"
import { createParsableResultInterface } from "@/app/utils/result"
import { err, ok, Result } from "neverthrow"
import type { Expense, Group } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function getGroupDetails(groupId: string, userId: string): Promise<Group | null> {
    return prisma.group.findUnique({
        where: { id: groupId, member_ids: { has: userId } },
    })
}

/**
 * This function creates a new expense or updates an existing expense.
 * @param expense The expense object to create or update.
 * @param groupId The ID of the group to which the expense belongs.
 * @param expenseId The ID of the expense to update. If not provided, a new expense will be created.
 */
async function createExpense(
    expense: CreateExpenseSchemaType,
    groupId: string,
    expenseId?: string,
): Promise<Result<Expense, string[]>> {
    try {
        const _auth = await auth()
        const userId = _auth.userId ?? undefined
        if (!userId) return err(["You must be logged in to create a group."])

        const parseResult = createExpenseSchema.safeParse(expense)
        if (!parseResult.success) {
            const data = parseResult.error.errors.map((error) => error.message)
            return err(data)
        }

        // If expenseId is present, it means we are updating an existing expense
        if (expenseId) {
            const existingExpense = await prisma.expense.findUnique({
                where: { id: expenseId, group_id: groupId },
            })
            if (!existingExpense) return err(["Expense not found."])

            const newExpense = await prisma.expense.update({
                where: { id: expenseId, group_id: groupId },
                data: {
                    name: expense.name,
                    amount: expense.amount,
                    description: expense.description,
                    created_by: userId,
                    group_id: groupId,
                },
            })
            return ok(newExpense)
        }

        const group = await getGroupDetails(groupId, userId)
        if (!group) return err(["You must be a member of the group to create an expense."])

        const newExpense = await prisma.expense.create({
            data: {
                name: expense.name,
                amount: expense.amount,
                description: expense.description,
                created_by: userId,
                group_id: groupId,
            },
        })

        return ok(newExpense)
    } catch (_error) {
        return err(["An error occurred while creating the group. Please try again."])
    }
}

const createExpenseSchema = z.object({
    name: z
        .string({ message: "Expense name must be a string." })
        .min(1, "Expense name must be at least 1 character.")
        .max(50, "Expense name must be at most 50 characters."),
    amount: z
        .number({ message: "Amount must be a number." })
        .min(1, "Expense amount must be at least 1 dollar."),
    description: z.string().min(1, "Expense description must be at least 1 character."),
    group_id: z.string({ message: "Group ID must be a string." }),
    id: z.string().optional(),
})

type CreateExpenseSchemaType = z.infer<typeof createExpenseSchema>

export async function createExpenseAction(formData: FormData) {
    const _expenseBody = Object.fromEntries(
        formData.entries(),
    ) as unknown as CreateExpenseSchemaType
    const expenseBody: CreateExpenseSchemaType = {
        ..._expenseBody,
        amount: Number(_expenseBody.amount),
    }
    const expense = await createExpense(expenseBody, expenseBody.group_id, expenseBody.id)
    if (expense.isErr()) {
        return createParsableResultInterface(err(expense.error))
    }
    revalidatePath("/")
    revalidatePath(`/group/${expenseBody.group_id}`)
    return createParsableResultInterface(ok(["Expense created successfully"]))
}
