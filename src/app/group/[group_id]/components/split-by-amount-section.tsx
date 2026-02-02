import React from "react"
import { LiaRupeeSignSolid } from "react-icons/lia"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface PersonWithAmount {
    name: string
    isChecked: boolean
    id: string
    image: string
    customAmount: number
}

interface SplitByAmountSectionProps {
    totalAmount: number
    people: PersonWithAmount[]
    userId: string
    setPeople: (people: PersonWithAmount[]) => void
}

/**
 * Creates split config from custom amount allocations.
 * Each person's amount is taken directly from their input.
 */
export function createAmountSplitConfig(people: PersonWithAmount[]) {
    const participants = people.filter((p) => p.isChecked && p.customAmount > 0)
    if (participants.length === 0) return []

    return participants.map((p) => ({
        user_id: p.id,
        amount: p.customAmount,
    }))
}

export function SplitByAmountSection({
    totalAmount,
    people,
    setPeople,
    userId,
}: SplitByAmountSectionProps) {
    const selectedPeople = people.filter((p) => p.isChecked)
    const allocatedAmount = selectedPeople.reduce((sum, p) => sum + p.customAmount, 0)
    const remainingAmount = totalAmount - allocatedAmount
    const isValid = Math.abs(remainingAmount) <= 0.01

    function handleAmountChange(personId: string, value: number) {
        const newPeople = people.map((p) =>
            p.id === personId ? { ...p, customAmount: value } : p
        )
        setPeople(newPeople)
    }

    function handleCheckedChange(personId: string, checked: boolean) {
        const newPeople = people.map((p) =>
            p.id === personId
                ? { ...p, isChecked: checked, customAmount: checked ? p.customAmount : 0 }
                : p
        )
        setPeople(newPeople)
    }

    return (
        <div>
            <ul className="flex flex-col gap-4">
                {people.map((person) => (
                    <li key={person.id}>
                        <div className="text-sm grid grid-cols-[32px_1fr_100px_max-content] items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={person.image} />
                                <AvatarFallback>{person.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="select-none truncate">
                                {person.id === userId ? "You" : person.name}
                            </span>
                            <Input
                                type="number"
                                min={0}
                                step={0.01}
                                value={person.customAmount || ""}
                                placeholder="0.00"
                                disabled={!person.isChecked}
                                startIcon={LiaRupeeSignSolid}
                                className="h-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                onChange={(e) =>
                                    handleAmountChange(
                                        person.id,
                                        Number(e.target.value) || 0
                                    )
                                }
                            />
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
                ))}
            </ul>
            <div className="mt-4 border-t pt-4">
                {selectedPeople.length === 0 ? (
                    <p className="text-sm text-center text-destructive">
                        Select at least one person
                    </p>
                ) : (
                    <div className="text-sm text-center flex flex-col items-center">
                        <span className={cn(!isValid ? "text-destructive" : "text-muted-foreground")}>
                            ₹{allocatedAmount.toFixed(2)} of ₹{totalAmount.toFixed(2)}
                        </span>
                        <span className={cn(
                            "text-xs",
                            Math.abs(remainingAmount) > 0.01 ? "text-destructive" : "text-muted-foreground"
                        )}>
                            ₹{remainingAmount.toFixed(2)} left
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
