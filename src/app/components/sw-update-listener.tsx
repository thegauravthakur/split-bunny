"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export function SwUpdateListener() {
    useEffect(() => {
        if (typeof BroadcastChannel === "undefined") return

        const channel = new BroadcastChannel("serwist")

        channel.addEventListener("message", (event) => {
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
        })

        return () => channel.close()
    }, [])

    return null
}
