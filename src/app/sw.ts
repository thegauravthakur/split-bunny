import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig, SerwistPlugin } from "serwist"
import { NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist"

// Custom plugin that notifies clients when cache is updated
// Unlike BroadcastUpdatePlugin, this doesn't compare headers - it always notifies
const notifyCacheUpdatePlugin: SerwistPlugin = {
    cacheDidUpdate: async ({ request, oldResponse, newResponse }) => {
        // Only notify if there was a previous cached response (not first cache)
        if (oldResponse && newResponse) {
            console.log("[SW] Cache updated for:", request.url)

            // Notify all clients
            const clients = await self.clients.matchAll({ type: "window" })
            for (const client of clients) {
                client.postMessage({
                    type: "CACHE_UPDATED",
                    payload: {
                        url: request.url,
                        updatedAt: Date.now(),
                    },
                })
            }
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
