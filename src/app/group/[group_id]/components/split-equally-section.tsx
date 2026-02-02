import React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

interface SplitEquallySectionProps {
    amount: number
    people: People[]
    userId: string
    setPeople: (people: People[]) => void
}

export interface People {
    name: string
    isChecked: boolean
    id: string
    image: string
}

/**
 * Creates a fair split configuration that ensures the sum equals the total amount exactly.
 * Distributes remainder cents to the first N participants to avoid rounding loss.
 * Example: ₹100 split 3 ways = ₹33.34 + ₹33.33 + ₹33.33 = ₹100.00
 */
export function createSplitConfig(people: People[], amount: number) {
    const participants = people.filter((p) => p.isChecked)
    if (participants.length === 0 || amount === 0) return []

    // Convert to paise (cents) for precise integer math
    const totalPaise = Math.round(amount * 100)
    const basePaise = Math.floor(totalPaise / participants.length)
    const remainderPaise = totalPaise - basePaise * participants.length

    return participants.map((p, i) => ({
        user_id: p.id,
        // Distribute remainder paise to first N people
        amount: (basePaise + (i < remainderPaise ? 1 : 0)) / 100,
    }))
}

export function SplitEquallySection({
    amount,
    people,
    setPeople,
    userId,
}: SplitEquallySectionProps) {
    const selectedPeople = people.filter((p) => p.isChecked)
    const splitConfig = createSplitConfig(people, amount)

    // Get the per-person amounts from the actual split config for accurate display
    const perPersonAmounts = splitConfig.map((s) => s.amount)
    const displayAmount =
        perPersonAmounts.length > 0
            ? perPersonAmounts[0] // Show the base amount (first person might have +1 paise)
            : 0

    return (
        <div>
            <ul className="flex flex-col gap-4">
                {people.map((person) => (
                    <li key={person.id} className="h-9">
                        <label className="text-sm grid grid-cols-[32px_1fr_max-content] items-center gap-4 cursor-pointer">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={person.image} />
                                <AvatarFallback>{person.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="select-none pointer-events-none">
                                {person.id === userId ? "You" : person.name}
                            </span>
                            <Checkbox
                                checked={person.isChecked}
                                onCheckedChange={(checked) => {
                                    const newPeople = [...people]
                                    const targetIndex = newPeople.findIndex(
                                        (p) => p.id === person.id,
                                    )
                                    if (targetIndex === -1) return
                                    newPeople[targetIndex] = {
                                        ...person,
                                        isChecked: Boolean(checked),
                                    }
                                    setPeople(newPeople)
                                }}
                            />
                        </label>
                    </li>
                ))}
            </ul>
            <div className="mt-4 border-t pt-4">
                {selectedPeople.length === 0 ? (
                    <p className="text-sm text-center text-destructive">
                        Select at least one person
                    </p>
                ) : (
                    <p className="text-sm flex flex-col items-center">
                        <span>₹{displayAmount.toFixed(2)}/person</span>
                        <span className="text-xs text-muted-foreground">
                            ({selectedPeople.length}{" "}
                            {selectedPeople.length === 1 ? "person" : "people"})
                        </span>
                    </p>
                )}
            </div>
        </div>
    )
}
