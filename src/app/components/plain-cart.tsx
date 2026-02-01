import { ReactNode } from "react"

import { Button } from "@/components/ui/button"

interface PlainCardProps {
    title: string
    description: string
    triggerElement?: ReactNode
}

/**
 * A simple cart with a title and a description.
 */
export function PlainCard({ title, description, triggerElement }: PlainCardProps) {
    return (
        <div className="border rounded-md shadow-xs p-4 flex flex-col justify-between gap-y-4 relative items-start text-base font-normal w-full">
            {triggerElement ? (
                <Button
                    asChild
                    className="absolute inset-0 h-full hover:bg-transparent"
                    variant="ghost"
                >
                    {triggerElement}
                </Button>
            ) : null}
            <h3 className="capitalize">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}
