"use client"
import { Button } from "@/components/ui/button"
import { IoIosAdd } from "react-icons/io"
import React, { useState } from "react"
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

interface NewExpenseButtonProps {
    groupId: string
}

export function NewExpenseButton({ groupId }: NewExpenseButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="[&_svg]:size-6">
                    <IoIosAdd />
                    <span>New Expense</span>
                </Button>
            </DialogTrigger>
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
                    />
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input
                        required
                        type="number"
                        id="expense-amount"
                        placeholder="100"
                        name="amount"
                    />
                    <Label htmlFor="expense-description">Description</Label>
                    <Textarea
                        rows={4}
                        required
                        id="expense-description"
                        placeholder="Coffee"
                        name="description"
                    />
                    <Input type="hidden" name="group_id" value={groupId} />
                    <ClientFormButton className="mt-6">Create Expense</ClientFormButton>
                </ClientForm>
            </DialogContent>
        </Dialog>
    )
}
