"use client"
import React, { ReactNode, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ClientForm, ClientFormButton } from "@/components/helpers/client-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createExpenseAction } from "@/app/group/[group_id]/action"
import { Expense } from "@prisma/client"

interface NewExpenseButtonProps {
    groupId: string
    expense?: Expense
    children: ReactNode
}

export function NewExpenseButton({ groupId, expense, children }: NewExpenseButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const isUpdateOperation = Boolean(expense)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Create a new expense</DialogTitle>
                    <DialogDescription>
                        Create a new expense and start splitting bills
                    </DialogDescription>
                </DialogHeader>
                <ClientForm
                    action={createExpenseAction}
                    className="flex flex-col gap-y-4"
                    onSubmitSuccess={() => setIsOpen(false)}
                >
                    <Label htmlFor="expense-name">Expense name</Label>
                    <Input
                        required
                        type="text"
                        id="expense-name"
                        placeholder="Coffee"
                        name="name"
                        defaultValue={expense?.name}
                    />
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input
                        required
                        type="number"
                        id="expense-amount"
                        placeholder="100"
                        name="amount"
                        defaultValue={expense?.amount}
                    />
                    <Label htmlFor="expense-description">Description</Label>
                    <Textarea
                        rows={4}
                        required
                        id="expense-description"
                        placeholder="Coffee"
                        name="description"
                        defaultValue={expense?.description}
                    />
                    <Input type="hidden" name="group_id" value={groupId} />
                    {isUpdateOperation ? (
                        <Input type="hidden" name="id" value={expense?.id} />
                    ) : null}
                    <ClientFormButton className="mt-6">Create Expense</ClientFormButton>
                </ClientForm>
            </DialogContent>
        </Dialog>
    )
}
