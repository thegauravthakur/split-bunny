"use client"

import { useEffect } from "react"
import { toast } from "sonner"

// Track if we've already seen the first cache update (initial population)
// Using sessionStorage so it persists across navigations but resets on new tab
const SEEN_FIRST_UPDATE_KEY = "sw-seen-first-update"

export function SwUpdateListener() {
    useEffect(() => {
        if (typeof BroadcastChannel === "undefined") return

        const channel = new BroadcastChannel("sw-updates")

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "CACHE_UPDATED") {
                // Skip the first update (initial cache population)
                if (!sessionStorage.getItem(SEEN_FIRST_UPDATE_KEY)) {
                    sessionStorage.setItem(SEEN_FIRST_UPDATE_KEY, "true")
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

        channel.addEventListener("message", handleMessage)
        return () => {
            channel.removeEventListener("message", handleMessage)
            channel.close()
        }
    }, [])

    return null
}
