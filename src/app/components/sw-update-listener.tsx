"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

// Ignore cache updates within the first few seconds of page load
// to avoid showing toast on initial cache population
const STARTUP_GRACE_PERIOD_MS = 5000

export function SwUpdateListener() {
    const mountedAtRef = useRef<number>(Date.now())

    useEffect(() => {
        if (!("serviceWorker" in navigator)) return

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "CACHE_UPDATED") {
                const elapsed = Date.now() - mountedAtRef.current
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
