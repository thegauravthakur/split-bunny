"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function SwUpdateListener() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return

        const handleMessage = (event: MessageEvent) => {
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
