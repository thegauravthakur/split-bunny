"use client"

import React, { ReactNode, useState } from "react"
import { LiaRupeeSignSolid } from "react-icons/lia"

import { DialogBottomSheet } from "@/app/components/dialog-bottom-sheet/dialog-bottom-sheet"
import { ExpenseWithSplits } from "@/app/group/[group_id]/(tabs)/expenses/page"
import { createExpenseAction } from "@/app/group/[group_id]/action"
import {
    createAmountSplitConfig,
    PersonWithAmount,
    SplitByAmountSection,
} from "@/app/group/[group_id]/components/split-by-amount-section"
import {
    createPercentageSplitConfig,
    PersonWithPercentage,
    SplitByPercentageSection,
} from "@/app/group/[group_id]/components/split-by-percentage-section"
import {
    createSplitConfig,
    People,
    SplitEquallySection,
} from "@/app/group/[group_id]/components/split-equally-section"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import { ClientForm, ClientFormButton } from "@/components/helpers/client-form"
import { Button } from "@/components/ui/button"
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

export type SplitType = "EQUAL" | "PERCENTAGE" | "AMOUNT"

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
    device: "mobile" | "desktop"
    userId: string
}

function getInitialPeople(members: Member[], expense?: ExpenseWithSplits): People[] {
    if (!expense) return members.map((member) => ({ ...member, isChecked: true }))
    return members.map((member) => ({
        ...member,
        isChecked: expense.splits.some((s) => s.user_id === member.id),
    }))
}

function getInitialPercentagePeople(
    members: Member[],
    expense?: ExpenseWithSplits
): PersonWithPercentage[] {
    if (!expense) {
        return members.map((member) => ({
            ...member,
            isChecked: true,
            percentage: 0,
        }))
    }
    // For existing expense, use stored percentage if available, otherwise calculate from amount
    return members.map((member) => {
        const split = expense.splits.find((s) => s.user_id === member.id)
        const percentage = split?.percentage
            ?? (split && expense.amount > 0 ? (split.amount / expense.amount) * 100 : 0)
        return {
            ...member,
            isChecked: Boolean(split),
            percentage: Number(percentage.toFixed(2)),
        }
    })
}

function getInitialAmountPeople(
    members: Member[],
    expense?: ExpenseWithSplits
): PersonWithAmount[] {
    if (!expense) {
        return members.map((member) => ({
            ...member,
            isChecked: true,
            customAmount: 0,
        }))
    }
    return members.map((member) => {
        const split = expense.splits.find((s) => s.user_id === member.id)
        return {
            ...member,
            isChecked: Boolean(split),
            customAmount: split?.amount ?? 0,
        }
    })
}

const SPLIT_TYPE_LABELS: Record<SplitType, string> = {
    EQUAL: "equally",
    PERCENTAGE: "by %",
    AMOUNT: "by amount",
}

export function NewExpenseButton({
    groupId,
    expense,
    children,
    members,
    device,
    userId,
}: NewExpenseButtonProps) {
    // Use server-provided device as initial value to avoid hydration mismatch
    const isDesktop = useMediaQuery("(min-width: 768px)", {
        defaultValue: device === "desktop",
        initializeWithValue: false,
    })
    const [isOpen, setIsOpen] = useState(false)
    const [splitSheetOpen, setSplitSheetOpen] = useState(false)
    const [amount, setAmount] = useState(expense?.amount ?? 0)
    const [splitType, setSplitType] = useState<SplitType>(expense?.type ?? "EQUAL")

    // State for each split type
    const [equalPeople, setEqualPeople] = useState<People[]>(() =>
        getInitialPeople(members, expense)
    )
    const [percentagePeople, setPercentagePeople] = useState<PersonWithPercentage[]>(() =>
        getInitialPercentagePeople(members, expense)
    )
    const [amountPeople, setAmountPeople] = useState<PersonWithAmount[]>(() =>
        getInitialAmountPeople(members, expense)
    )

    // Compute the split config based on current split type
    const splitConfig = (() => {
        switch (splitType) {
            case "EQUAL":
                return createSplitConfig(equalPeople, amount)
            case "PERCENTAGE":
                return createPercentageSplitConfig(percentagePeople, amount)
            case "AMOUNT":
                return createAmountSplitConfig(amountPeople)
        }
    })()

    // Validation for each split type
    const isValidSplit = (() => {
        switch (splitType) {
            case "EQUAL":
                return equalPeople.some((p) => p.isChecked)
            case "PERCENTAGE": {
                const selected = percentagePeople.filter((p) => p.isChecked)
                const total = selected.reduce((sum, p) => sum + p.percentage, 0)
                return selected.length > 0 && Math.abs(total - 100) <= 0.01
            }
            case "AMOUNT": {
                const selected = amountPeople.filter((p) => p.isChecked)
                const allocated = selected.reduce((sum, p) => sum + p.customAmount, 0)
                return amount > 0 && selected.length > 0 && Math.abs(allocated - amount) <= 0.01
            }
        }
    })()

    const isUpdateOperation = Boolean(expense)

    // Reset form state when modal opens
    function handleOpenChange(open: boolean) {
        if (open) {
            setAmount(expense?.amount ?? 0)
            setSplitType(expense?.type ?? "EQUAL")
            setEqualPeople(getInitialPeople(members, expense))
            setPercentagePeople(getInitialPercentagePeople(members, expense))
            setAmountPeople(getInitialAmountPeople(members, expense))
        }
        setIsOpen(open)
    }

    function handleTabChange(value: string) {
        setSplitType(value as SplitType)
    }

    return (
        <DialogBottomSheet
            modal
            body={
                <ClientForm
                    action={createExpenseAction}
                    className="flex flex-col gap-y-4"
                    onSubmitSuccess={() => setIsOpen(false)}
                >
                    <Label htmlFor="expense-name">Expense name</Label>
                    <Input
                        required
                        className="text-base"
                        defaultValue={expense?.name}
                        id="expense-name"
                        name="name"
                        placeholder="Coffee"
                        type="text"
                    />
                    <div className="flex items-center gap-x-2">
                        <Label htmlFor="expense-amount">Amount </Label>
                        <div className="flex items-center gap-x-2 text-sm flex-1">
                            <Select defaultValue={expense?.paid_by ?? userId ?? members[0]?.id} name="paid_by">
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
                            {isDesktop ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button size="sm" variant="secondary">
                                            {SPLIT_TYPE_LABELS[splitType]}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <Label>Amount</Label>
                                        <Input
                                            required
                                            selectAllOnFocus
                                            className="mt-2"
                                            placeholder="Enter amount"
                                            startIcon={LiaRupeeSignSolid}
                                            type="number"
                                            value={amount || ""}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                        />
                                        <Tabs
                                            className="mt-4 w-full"
                                            value={splitType}
                                            onValueChange={handleTabChange}
                                        >
                                            <TabsList className="w-full">
                                                <TabsTrigger className="flex-1" value="EQUAL">
                                                    Equal
                                                </TabsTrigger>
                                                <TabsTrigger className="flex-1" value="PERCENTAGE">
                                                    Percentage
                                                </TabsTrigger>
                                                <TabsTrigger className="flex-1" value="AMOUNT">
                                                    Amount
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent className="mt-4" value="EQUAL">
                                                <SplitEquallySection
                                                    amount={amount}
                                                    people={equalPeople}
                                                    setPeople={setEqualPeople}
                                                    userId={userId}
                                                />
                                            </TabsContent>
                                            <TabsContent className="mt-4" value="PERCENTAGE">
                                                <SplitByPercentageSection
                                                    amount={amount}
                                                    people={percentagePeople}
                                                    setPeople={setPercentagePeople}
                                                    userId={userId}
                                                />
                                            </TabsContent>
                                            <TabsContent className="mt-4" value="AMOUNT">
                                                <SplitByAmountSection
                                                    totalAmount={amount}
                                                    people={amountPeople}
                                                    setPeople={setAmountPeople}
                                                    userId={userId}
                                                />
                                            </TabsContent>
                                        </Tabs>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <DialogBottomSheet
                                    hideCloseButton
                                    device="mobile"
                                    open={splitSheetOpen}
                                    setOpen={setSplitSheetOpen}
                                    trigger={
                                        <Button size="sm" variant="secondary">
                                            {SPLIT_TYPE_LABELS[splitType]}
                                        </Button>
                                    }
                                    title="Split Options"
                                    description="Choose how to split this expense"
                                    body={
                                        <>
                                            <Label>Amount</Label>
                                            <Input
                                                required
                                                selectAllOnFocus
                                                className="mt-2"
                                                placeholder="Enter amount"
                                                startIcon={LiaRupeeSignSolid}
                                                type="number"
                                                value={amount || ""}
                                                onChange={(e) => setAmount(Number(e.target.value))}
                                            />
                                            <Tabs
                                                className="mt-4 w-full"
                                                value={splitType}
                                                onValueChange={handleTabChange}
                                            >
                                                <TabsList className="w-full">
                                                    <TabsTrigger className="flex-1" value="EQUAL">
                                                        Equal
                                                    </TabsTrigger>
                                                    <TabsTrigger className="flex-1" value="PERCENTAGE">
                                                        Percentage
                                                    </TabsTrigger>
                                                    <TabsTrigger className="flex-1" value="AMOUNT">
                                                        Amount
                                                    </TabsTrigger>
                                                </TabsList>
                                                <TabsContent className="mt-4" value="EQUAL">
                                                    <SplitEquallySection
                                                        amount={amount}
                                                        people={equalPeople}
                                                        setPeople={setEqualPeople}
                                                        userId={userId}
                                                    />
                                                </TabsContent>
                                                <TabsContent className="mt-4" value="PERCENTAGE">
                                                    <SplitByPercentageSection
                                                        amount={amount}
                                                        people={percentagePeople}
                                                        setPeople={setPercentagePeople}
                                                        userId={userId}
                                                    />
                                                </TabsContent>
                                                <TabsContent className="mt-4" value="AMOUNT">
                                                    <SplitByAmountSection
                                                        totalAmount={amount}
                                                        people={amountPeople}
                                                        setPeople={setAmountPeople}
                                                        userId={userId}
                                                    />
                                                </TabsContent>
                                            </Tabs>
                                        </>
                                    }
                                />
                            )}
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
                        value={amount || ""}
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
                    <input name="split_type" type="hidden" value={splitType} />
                    {isUpdateOperation ? (
                        <>
                            <input name="id" type="hidden" value={expense?.id} />
                        </>
                    ) : null}
                    <ClientFormButton className="mt-6" disabled={!isValidSplit}>
                        {isUpdateOperation ? "Update Expense" : "Create Expense"}
                    </ClientFormButton>
                </ClientForm>
            }
            description={
                isUpdateOperation
                    ? "Edit the expense details"
                    : "Create a new expense and start splitting bills"
            }
            device={device}
            open={isOpen}
            setOpen={handleOpenChange}
            title={isUpdateOperation ? "Edit Expense" : "Create a new expense"}
            trigger={children}
        />
    )
}
