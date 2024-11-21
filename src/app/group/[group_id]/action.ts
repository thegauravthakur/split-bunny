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

async function createExpense(
    expense: CreateExpenseSchemaType,
    groupId: string,
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
    const expense = await createExpense(expenseBody, expenseBody.group_id)
    console.log(expense)
    if (expense.isErr()) {
        return createParsableResultInterface(err(expense.error))
    }
    revalidatePath("/")
    revalidatePath(`/group/${expenseBody.group_id}`)
    return createParsableResultInterface(ok(["Expense created successfully"]))
}
