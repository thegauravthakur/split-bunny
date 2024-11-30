"use client"

import React, { ReactNode, useState } from "react"
import { LiaRupeeSignSolid } from "react-icons/lia"

import { ExpenseWithSplits } from "@/app/group/[group_id]/[[...tab]]/page"
import { createExpenseAction } from "@/app/group/[group_id]/action"
import {
    createSplitConfig,
    People,
    SplitEquallySection,
} from "@/app/group/[group_id]/components/split-equally-section"
import { ClientForm, ClientFormButton } from "@/components/helpers/client-form"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

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
            isChecked: expense.splits.some((s) => s.user_id === member.id),
        }))
    })
    const splitConfig = createSplitConfig(people, amount)
    const isUpdateOperation = Boolean(expense)

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
                        defaultValue={expense?.name}
                        id="expense-name"
                        name="name"
                        placeholder="Coffee"
                        type="text"
                    />
                    <div className="flex items-center gap-x-2">
                        <Label htmlFor="expense-amount">Amount </Label>
                        <div className="flex items-center gap-x-2 text-sm flex-1">
                            <Select defaultValue={userId ?? members[0]?.id} name="paid_by">
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
                                        required
                                        className="mt-2"
                                        placeholder="Enter amount"
                                        startIcon={LiaRupeeSignSolid}
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                    />
                                    <Tabs className="mt-4 w-full" defaultValue="account">
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
                                        <TabsContent className="mt-4" value="account">
                                            <SplitEquallySection
                                                amount={amount}
                                                people={people}
                                                setPeople={setPeople}
                                            />
                                        </TabsContent>
                                        <TabsContent
                                            className="text-sm text-muted-foreground text-center"
                                            value="percentage"
                                        >
                                            coming soon
                                        </TabsContent>
                                        <TabsContent
                                            className="text-sm text-muted-foreground text-center"
                                            value="amount"
                                        >
                                            coming soon
                                        </TabsContent>
                                    </Tabs>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Input
                        required
                        id="expense-amount"
                        min={1}
                        name="amount"
                        placeholder="100"
                        startIcon={LiaRupeeSignSolid}
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <Label htmlFor="expense-description">Description</Label>
                    <Textarea
                        required
                        defaultValue={expense?.description}
                        id="expense-description"
                        name="description"
                        placeholder="Coffee"
                        rows={4}
                    />
                    <input name="group_id" type="hidden" value={groupId} />
                    <input name="split_config" type="hidden" value={JSON.stringify(splitConfig)} />
                    {isUpdateOperation ? (
                        <>
                            <input name="id" type="hidden" value={expense?.id} />
                        </>
                    ) : null}
                    <ClientFormButton className="mt-6">Create Expense</ClientFormButton>
                </ClientForm>
            </DialogContent>
        </Dialog>
    )
}
