"use server"

import { auth } from "@clerk/nextjs/server"
import type { Expense, Group } from "@prisma/client"
import { err, ok, Result } from "neverthrow"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createParsableResultInterface } from "@/app/utils/result"
import prisma from "@/lib/prisma"

function getGroupDetails(groupId: string, userId: string): Promise<Group | null> {
    return prisma.group.findUnique({
        where: { id: groupId, member_ids: { has: userId } },
    })
}

async function validateSplitConfig(splitConfig: string, expense: CreateExpenseSchemaType) {
    try {
        const parsedSplitConfig = JSON.parse(splitConfig) as { user_id: string; amount: number }[]
        const group = await prisma.group.findUnique({
            where: { id: expense.group_id },
        })
        const totalSplitAmount = parsedSplitConfig.reduce((acc, split) => acc + split.amount, 0)

        if (totalSplitAmount !== expense.amount)
            return err(["The total amount of splits does not match the expense amount."])

        if (!group) return err(["Group not found."])

        if (!Array.isArray(parsedSplitConfig))
            return err(["Please provide a valid split configuration."])
        if (parsedSplitConfig.length === 0)
            return err(["Please choose at least one person to split the expense"])
        for (const split of parsedSplitConfig) {
            if (!split.user_id) return err(["Please provide a valid user ID."])
            if (!group.member_ids.includes(split.user_id)) return err(["User not found."])
            if (split.amount <= 0) return err(["Please provide a valid amount."])
        }
        return ok(true)
    } catch (_error) {
        return err(["An error occurred while validating the split configuration."])
    }
}

/**
 * This function creates a new expense or updates an existing expense.
 * @param expense The expense object to create or update.
 */
async function createExpense(expense: CreateExpenseSchemaType): Promise<Result<Expense, string[]>> {
    try {
        const _auth = await auth()
        const userId = _auth.userId ?? undefined
        if (!userId) return err(["You must be logged in to create a group."])

        const parseResult = createExpenseSchema.safeParse(expense)
        if (!parseResult.success) {
            const data = parseResult.error.errors.map((error) => error.message)
            console.log(data, parseResult.error)
            return err(data)
        }

        const isValidSplitConfig = await validateSplitConfig(expense.split_config, expense)

        if (isValidSplitConfig.isErr()) return isValidSplitConfig
        const splitConfig = JSON.parse(expense.split_config) as {
            id: string
            user_id: string
            amount: number
        }[]

        // If expenseId is present, it means we are updating an existing expense
        if (expense.id) {
            const existingExpense = await prisma.expense.findUnique({
                where: { id: expense.id, group_id: expense.group_id },
            })
            if (!existingExpense) return err(["Expense not found."])

            const newExpense = await prisma.expense.update({
                where: { id: expense.id, group_id: expense.group_id },
                data: {
                    name: expense.name,
                    amount: expense.amount,
                    description: expense.description,
                    created_by: userId,
                    group_id: expense.group_id,
                    paid_by: expense.paid_by,
                    splits: {
                        deleteMany: { expense_id: expense.id },
                        create: splitConfig.map((s) => ({ user_id: s.user_id, amount: s.amount })),
                    },
                },
            })
            return ok(newExpense)
        }

        const group = await getGroupDetails(expense.group_id, userId)
        if (!group) return err(["You must be a member of the group to create an expense."])

        const newExpense = await prisma.expense.create({
            data: {
                name: expense.name,
                amount: expense.amount,
                description: expense.description,
                created_by: userId,
                group_id: expense.group_id,
                type: "EQUAL",
                paid_by: expense.paid_by,
                splits: {
                    create: splitConfig.map((s) => ({ user_id: s.user_id, amount: s.amount })),
                },
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
        .min(1, "Expense amount must be at least 1 Rupees."),
    description: z.string().min(1, "Expense description must be at least 1 character."),
    group_id: z.string({ message: "Group ID must be a string." }),
    paid_by: z.string(),
    split_config: z.string(),
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
    const expense = await createExpense(expenseBody)
    if (expense.isErr()) {
        return createParsableResultInterface(err(expense.error))
    }
    revalidatePath("/")
    revalidatePath(`/group/${expenseBody.group_id}`)
    return createParsableResultInterface(ok(["Expense created successfully"]))
}
