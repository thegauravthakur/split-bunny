"use client"

import { useEffect } from "react"

import { refreshPageCache } from "@/lib/sw-cache"

export function HomeCacheRefresher() {
    useEffect(() => {
        // Small delay to not compete with initial page resources
        const timer = setTimeout(() => {
            console.log("[HomeCacheRefresher] Triggering cache refresh...")
            refreshPageCache("/")
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return null
}
