"use client"

import { useEffect } from "react"
import { toast } from "sonner"

const LAST_SEEN_HASH_KEY = "sw-last-content-hash"

export function SwUpdateListener() {
    useEffect(() => {
        if (!("serviceWorker" in navigator)) return

        const handleMessage = (event: MessageEvent) => {
            const data = event.data
            if (!data || data.type !== "CACHE_UPDATED") return
            if (data.meta && data.meta !== "serwist-broadcast-update") return

            const payload = data.payload ?? {}
            const updatedURL: string | undefined =
                payload.updatedURL || payload.url

            if (!updatedURL) return

            const pathname = new URL(
                updatedURL,
                window.location.origin
            ).pathname

            if (pathname !== "/") return

            const contentHash: string | undefined = payload.contentHash
            if (contentHash) {
                const lastSeen = sessionStorage.getItem(LAST_SEEN_HASH_KEY)
                if (lastSeen === contentHash) return
                sessionStorage.setItem(LAST_SEEN_HASH_KEY, contentHash)
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

        navigator.serviceWorker.addEventListener("message", handleMessage)
        return () => {
            navigator.serviceWorker?.removeEventListener(
                "message",
                handleMessage
            )
        }
    }, [])

    return null
}
