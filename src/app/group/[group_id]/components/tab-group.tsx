"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

import { tabs } from "@/app/group/[group_id]/[[...tab]]/constants"
import { cn } from "@/lib/utils"

interface TabGroupProps {
    group_id: string
}
export function TabGroup({ group_id }: TabGroupProps) {
    const { tab } = useParams()
    const [activeTab] = tab ?? ["expenses"]

    return (
        <ul className="flex items-center gap-x-2 mt-6">
            {tabs.map((tab = "expenses") => (
                <li key={tab}>
                    <Link
                        className={cn(
                            "text-sm border px-4 py-1.5 rounded-xl hover:bg-primary-foreground hover:border-primary transition-colors duration-200 capitalize",
                            activeTab === tab && "bg-primary-foreground border-primary",
                        )}
                        href={`/group/${group_id}/${tab}`}
                    >
                        {tab}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
