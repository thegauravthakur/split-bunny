import React from "react"

import { Checkbox } from "@/components/ui/checkbox"

interface SplitEquallySectionProps {
    amount: number
    people: People[]
    setPeople: (people: People[]) => void
}

export interface People {
    name: string
    isChecked: boolean
    id: string
    image: string
}

export function createSplitConfig(people: People[], amount: number) {
    if (amount === 0) return []
    const participants = people.filter((p) => p.isChecked)
    return participants.map((p) => ({
        user_id: p.id,
        amount: amount / participants.length,
    }))
}

export function SplitEquallySection({ amount, people, setPeople }: SplitEquallySectionProps) {
    const selectedPeople = people.filter((p) => p.isChecked)

    return (
        <div>
            <ul className="flex flex-col gap-4">
                {people.map((person) => (
                    <li key={person.name}>
                        <label className="text-sm grid grid-cols-[32px_1fr_max-content] items-center gap-4">
                            <img
                                alt=""
                                className="h-8 w-8 rounded-full"
                                height={32}
                                src={person.image}
                                width={32}
                            />
                            <span className="select-none pointer-events-none">{person.name}</span>
                            <Checkbox
                                checked={person.isChecked}
                                onCheckedChange={(checked) => {
                                    const newPeople = [...people]
                                    const targetIndex = newPeople.findIndex(
                                        (p) => p.name === person.name,
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
            <p className="text-sm mt-4 flex flex-col items-center border-t pt-4">
                <span>₹{safeNumber(amount / selectedPeople.length)}/person</span>
                <span className="text-xs text-muted-foreground">
                    ({selectedPeople.length} people)
                </span>
            </p>
        </div>
    )
}

function safeNumber(num: number) {
    if (num === Infinity) return 0
    return Math.round((num + Number.EPSILON) * 100) / 100
}
