import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig, SerwistPlugin } from "serwist"
import { NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist"

const CONTENT_HASH_HEADER = "x-sw-content-hash"

const toHex = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")

const hashBody = async (buffer: ArrayBuffer) => {
    const digest = await crypto.subtle.digest("SHA-256", buffer)
    return toHex(digest)
}

const getContentHash = async (response: Response) => {
    const existing = response.headers.get(CONTENT_HASH_HEADER)
    if (existing) return existing

    try {
        const body = await response.clone().arrayBuffer()
        return await hashBody(body)
    } catch (err) {
        console.log("[SW] Error hashing cached response:", err)
        return null
    }
}

const broadcastCacheUpdate = async (payload: {
    updatedURL: string
    contentHash: string
    updatedAt: number
}) => {
    const clients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    })
    for (const client of clients) {
        client.postMessage({
            type: "CACHE_UPDATED",
            meta: "serwist-broadcast-update",
            payload,
        })
    }
}

// Custom plugin that adds a stable content hash and notifies clients on change
const notifyCacheUpdatePlugin: SerwistPlugin = {
    cacheWillUpdate: async ({ request, response }) => {
        if (!response || response.status !== 200) return null

        const wantsHtml =
            request.destination === "document" ||
            request.headers.get("Accept")?.includes("text/html")

        if (!wantsHtml) return response

        try {
            const body = await response.clone().arrayBuffer()
            const contentHash = await hashBody(body)

            const headers = new Headers(response.headers)
            headers.set(CONTENT_HASH_HEADER, contentHash)
            // Body is decoded bytes; ensure we don't lie about encoding/length.
            headers.delete("content-encoding")
            headers.delete("content-length")

            return new Response(body, {
                status: response.status,
                statusText: response.statusText,
                headers,
            })
        } catch (err) {
            console.log("[SW] Error hashing HTML response:", err)
            return response
        }
    },
    cacheDidUpdate: async ({ request, oldResponse, newResponse }) => {
        if (!oldResponse || !newResponse) return

        try {
            const [oldHash, newHash] = await Promise.all([
                getContentHash(oldResponse),
                getContentHash(newResponse),
            ])

            if (!oldHash || !newHash || oldHash === newHash) return

            await broadcastCacheUpdate({
                updatedURL: request.url,
                contentHash: newHash,
                updatedAt: Date.now(),
            })
        } catch (err) {
            console.log("[SW] Error comparing responses:", err)
        }
    },
}

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
    }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // Home page - stale-while-revalidate for instant load
        // Match any request to "/" (navigation or fetch)
        {
            matcher: ({ request, url }) => {
                const isHomePage = url.pathname === "/"
                // Accept document requests OR requests that want HTML
                const wantsHtml =
                    request.destination === "document" ||
                    request.headers.get("Accept")?.includes("text/html")
                const shouldHandle = isHomePage && wantsHtml
                if (isHomePage) {
                    console.log("[SW] Home page request:", {
                        destination: request.destination,
                        accept: request.headers.get("Accept"),
                        shouldHandle,
                    })
                }
                return shouldHandle
            },
            handler: new StaleWhileRevalidate({
                cacheName: "pages-cache",
                plugins: [notifyCacheUpdatePlugin],
            }),
        },
        // Other document routes - network first with fallback
        {
            matcher: ({ request }) => request.destination === "document",
            handler: new NetworkFirst({
                cacheName: "pages-cache",
                networkTimeoutSeconds: 3,
            }),
        },
        // Default cache for assets (fonts, images, static files)
        ...defaultCache,
    ],
    fallbacks: {
        entries: [
            {
                url: "/~offline",
                matcher: ({ request }) => request.destination === "document",
            },
        ],
    },
})

// Listen for cache clear message from client (used on logout)
self.addEventListener("message", (event) => {
    if (event.data?.type === "CLEAR_CACHE") {
        caches.delete("pages-cache")
    }
})

serwist.addEventListeners()
