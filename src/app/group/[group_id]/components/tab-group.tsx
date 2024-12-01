"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

import { tabs } from "@/app/group/[group_id]/(tabs)/constants"
import { cn } from "@/lib/utils"

interface TabGroupProps {
    group_id: string
}

export function TabGroup({ group_id }: TabGroupProps) {
    const pathname = usePathname()
    const activeTab = pathname.split(group_id).at(1)?.replace("/", "")

    return (
        <ul className="flex items-center gap-x-2 mt-6">
            {tabs.map((tab = "expenses") => (
                <li key={tab} className="flex-1 md:flex-initial">
                    <Link
                        replace
                        className={cn(
                            "text-sm border px-4 inline-block w-full text-center py-1.5 rounded-xl hover:bg-primary-foreground hover:border-primary transition-colors duration-200 capitalize",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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
