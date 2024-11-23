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
import { Button } from "@/components/ui/button"
import { LiaRupeeSignSolid } from "react-icons/lia"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    createSplitConfig,
    People,
    SplitEquallySection,
} from "@/app/group/[group_id]/components/split-equally-section"
import { ExpenseWithSplits } from "@/app/group/[group_id]/page"

export interface Member {
    name: string
    id: string
    image: string
}

interface NewExpenseButtonProps {
    groupId: string
    expense?: ExpenseWithSplits
    children: ReactNode
    members: Member[]
    userId: string
}

export function NewExpenseButton({
    groupId,
    expense,
    children,
    members,
    userId,
}: NewExpenseButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [amount, setAmount] = useState(expense?.amount ?? 0)
    const [people, setPeople] = useState<People[]>(() => {
        if (!expense) return members.map((member) => ({ ...member, isChecked: true }))
        return members.map((member) => ({
            ...member,
            isChecked: expense.splits.some((s) => s.payee === member.id),
        }))
    })
    const splitConfig = createSplitConfig(people, amount)
    const isUpdateOperation = Boolean(expense)

    console.log(expense)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>
                        {isUpdateOperation ? "Edit Expense" : "Create a new expense"}
                    </DialogTitle>
                    <DialogDescription>
                        {!isUpdateOperation
                            ? "Create a new expense and start splitting bills"
                            : "Edit the expense details"}
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
                    <div className="flex items-center gap-x-2">
                        <Label htmlFor="expense-amount">Amount </Label>
                        <div className="flex items-center gap-x-2 text-sm flex-1">
                            <Select defaultValue={userId ?? members[0]?.id} name="payee">
                                <SelectTrigger className="[&_svg]:hidden bg-secondary text-xs px-3 h-8 w-max font-medium shadow-none border-transparent">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {members.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                            {member.id === userId ? "You" : member.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="min-w-min">paid to be split</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="sm" variant="secondary">
                                        equally
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Label>Amount</Label>
                                    <Input
                                        startIcon={LiaRupeeSignSolid}
                                        className="mt-2"
                                        required
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                    />
                                    <Tabs defaultValue="account" className="mt-4 w-full">
                                        <TabsList className="w-full">
                                            <TabsTrigger className="flex-1" value="account">
                                                Equal
                                            </TabsTrigger>
                                            <TabsTrigger className="flex-1" value="percentage">
                                                Percentage
                                            </TabsTrigger>
                                            <TabsTrigger className="flex-1" value="amount">
                                                Amount
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="account" className="mt-4">
                                            <SplitEquallySection
                                                setPeople={setPeople}
                                                people={people}
                                                amount={amount}
                                            />
                                        </TabsContent>
                                        <TabsContent value="percentage" className="">
                                            coming soon
                                        </TabsContent>
                                        <TabsContent value="amount">coming soon</TabsContent>
                                    </Tabs>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Input
                        startIcon={LiaRupeeSignSolid}
                        required
                        type="number"
                        id="expense-amount"
                        placeholder="100"
                        name="amount"
                        value={amount}
                        min={1}
                        onChange={(e) => setAmount(Number(e.target.value))}
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
                    <input type="hidden" name="group_id" value={groupId} />
                    <input type="hidden" name="split_config" value={JSON.stringify(splitConfig)} />
                    {isUpdateOperation ? (
                        <input type="hidden" name="id" value={expense?.id} />
                    ) : null}
                    <ClientFormButton className="mt-6">Create Expense</ClientFormButton>
                </ClientForm>
            </DialogContent>
        </Dialog>
    )
}
