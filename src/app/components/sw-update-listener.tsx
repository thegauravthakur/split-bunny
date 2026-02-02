"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function SwUpdateListener() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) {
            console.log("[SwUpdateListener] No serviceWorker support")
            return
        }

        console.log("[SwUpdateListener] Listening for SW messages...")

        const handleMessage = (event: MessageEvent) => {
            console.log("[SwUpdateListener] Received message:", event.data)
            if (event.data?.type === "CACHE_UPDATED") {
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

        return () => {
            navigator.serviceWorker.removeEventListener("message", handleMessage)
        }
    }, [])

    return null
}
