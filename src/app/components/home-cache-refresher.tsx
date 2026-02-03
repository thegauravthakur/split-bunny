"use client"

import { useEffect } from "react"

import { refreshPageCache } from "@/lib/sw-cache"

export function HomeCacheRefresher() {
    useEffect(() => {
        const REVALIDATE_INTERVAL_MS = 5 * 60 * 1000

        // Small delay to not compete with initial page resources
        const timer = setTimeout(() => {
            console.log("[HomeCacheRefresher] Triggering cache refresh...")
            refreshPageCache("/")
        }, 1000)

        const interval = setInterval(() => {
            if (document.visibilityState !== "visible") return
            console.log("[HomeCacheRefresher] Background revalidate...")
            refreshPageCache("/")
        }, REVALIDATE_INTERVAL_MS)

        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [])

    return null
}
