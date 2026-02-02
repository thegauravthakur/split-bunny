import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig, SerwistPlugin } from "serwist"
import { NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist"

// Custom plugin that notifies clients only when content actually changes
const notifyCacheUpdatePlugin: SerwistPlugin = {
    cacheDidUpdate: async ({ request, oldResponse, newResponse }) => {
        // Only compare if there was a previous cached response
        if (!oldResponse || !newResponse) return

        try {
            // Compare actual content (clone responses since body can only be read once)
            const [oldText, newText] = await Promise.all([
                oldResponse.clone().text(),
                newResponse.clone().text(),
            ])

            // Only notify if content actually changed
            if (oldText !== newText) {
                console.log("[SW] Content changed for:", request.url)

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
            } else {
                console.log("[SW] Content unchanged for:", request.url)
            }
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
