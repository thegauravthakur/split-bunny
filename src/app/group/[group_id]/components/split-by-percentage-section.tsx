import React from "react"
import { LuPercent } from "react-icons/lu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PersonWithPercentage {
    name: string
    isChecked: boolean
    id: string
    image: string
    percentage: number
}

interface SplitByPercentageSectionProps {
    amount: number
    people: PersonWithPercentage[]
    userId: string
    setPeople: (people: PersonWithPercentage[]) => void
}

/**
 * Creates split config from percentage allocations.
 * Converts percentages to actual amounts using paise-based math for precision.
 * Distributes any rounding remainder to maintain exact total.
 */
export function createPercentageSplitConfig(people: PersonWithPercentage[], totalAmount: number) {
    const participants = people.filter((p) => p.isChecked && p.percentage > 0)
    if (participants.length === 0 || totalAmount === 0) return []

    const totalPaise = Math.round(totalAmount * 100)

    // Calculate each person's amount in paise based on their percentage
    const rawAmounts = participants.map((p) => ({
        user_id: p.id,
        paise: Math.floor((p.percentage / 100) * totalPaise),
        percentage: p.percentage,
    }))

    // Calculate remainder due to rounding
    const allocatedPaise = rawAmounts.reduce((sum, r) => sum + r.paise, 0)
    let remainderPaise = totalPaise - allocatedPaise

    // Distribute remainder to participants with highest percentage first
    const sorted = [...rawAmounts].sort((a, b) => b.percentage - a.percentage)
    for (const item of sorted) {
        if (remainderPaise <= 0) break
        item.paise += 1
        remainderPaise -= 1
    }

    return rawAmounts.map((r) => ({
        user_id: r.user_id,
        amount: r.paise / 100,
        percentage: r.percentage,
    }))
}

export function SplitByPercentageSection({
    amount,
    people,
    setPeople,
    userId,
}: SplitByPercentageSectionProps) {
    const selectedPeople = people.filter((p) => p.isChecked)
    const totalPercentage = selectedPeople.reduce((sum, p) => sum + p.percentage, 0)
    const percentageLeft = 100 - totalPercentage
    const isValid = Math.abs(percentageLeft) <= 0.01
    const splitConfig = createPercentageSplitConfig(people, amount)

    function handlePercentageChange(personId: string, value: number) {
        const newPeople = people.map((p) => (p.id === personId ? { ...p, percentage: value } : p))
        setPeople(newPeople)
    }

    function handleCheckedChange(personId: string, checked: boolean) {
        const newPeople = people.map((p) =>
            p.id === personId
                ? { ...p, isChecked: checked, percentage: checked ? p.percentage : 0 }
                : p,
        )
        setPeople(newPeople)
    }

    return (
        <div>
            <ul className="flex flex-col gap-4">
                {people.map((person) => {
                    const personSplit = splitConfig.find((s) => s.user_id === person.id)
                    const calculatedAmount = personSplit?.amount ?? 0

                    return (
                        <li key={person.id} className="h-9">
                            <div className="text-sm grid grid-cols-[32px_1fr_80px_max-content] items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={person.image} />
                                    <AvatarFallback>{person.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="select-none truncate">
                                        {person.id === userId ? "You" : person.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {person.isChecked
                                            ? `₹${calculatedAmount.toFixed(2)}`
                                            : "\u00A0"}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={0.01}
                                        value={person.percentage || ""}
                                        placeholder="0"
                                        disabled={!person.isChecked}
                                        className="h-8 pr-7 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        onChange={(e) =>
                                            handlePercentageChange(
                                                person.id,
                                                Number(e.target.value) || 0,
                                            )
                                        }
                                    />
                                    <LuPercent className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                </div>
                                <label className="flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer -m-3">
                                    <Checkbox
                                        checked={person.isChecked}
                                        onCheckedChange={(checked) =>
                                            handleCheckedChange(person.id, Boolean(checked))
                                        }
                                    />
                                </label>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className="mt-4 border-t pt-4">
                {selectedPeople.length === 0 ? (
                    <p className="text-sm text-center text-destructive">
                        Select at least one person
                    </p>
                ) : (
                    <div className="text-sm text-center flex flex-col items-center">
                        <span
                            className={cn(!isValid ? "text-destructive" : "text-muted-foreground")}
                        >
                            {totalPercentage.toFixed(2)}% of 100%
                        </span>
                        <span
                            className={cn(
                                "text-xs",
                                Math.abs(percentageLeft) > 0.01
                                    ? "text-destructive"
                                    : "text-muted-foreground",
                            )}
                        >
                            {percentageLeft.toFixed(2)}% left
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
