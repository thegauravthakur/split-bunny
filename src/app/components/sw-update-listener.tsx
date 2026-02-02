"use client"

import { useEffect } from "react"
import { toast } from "sonner"

// Ignore cache updates within the first few seconds of app startup
// to avoid showing toast on initial cache population
const STARTUP_GRACE_PERIOD_MS = 5000

// Module-level timestamp set once when JS loads (not on each component mount)
const appStartTime = typeof window !== "undefined" ? Date.now() : 0

export function SwUpdateListener() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "CACHE_UPDATED") {
                const elapsed = Date.now() - appStartTime
                if (elapsed < STARTUP_GRACE_PERIOD_MS) {
                    return
                }

                toast("New content available", {
                    description: "Tap to refresh and see the latest updates",
                    action: {
                        label: "Refresh",
                        onClick: () => window.location.reload(),
                    },
                    duration: 10000,
                })
            }
        }

        navigator.serviceWorker.addEventListener("message", handleMessage)
        return () => navigator.serviceWorker.removeEventListener("message", handleMessage)
    }, [])

    return null
}
