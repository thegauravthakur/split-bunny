import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface InfoCardProps {
    title: string
    subTitle: string
    description: string
}

export function InfoCard({ title, subTitle, description }: InfoCardProps) {
    return (
        <Card>
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2")}>
                <CardTitle className={cn("text-sm font-medium")}>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold")}>{subTitle}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
