import { defaultCache } from "@serwist/next/worker"
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist"
import { BroadcastUpdatePlugin, NetworkFirst, Serwist, StaleWhileRevalidate } from "serwist"

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
        {
            matcher: ({ request, url }) =>
                request.destination === "document" && url.pathname === "/",
            handler: new StaleWhileRevalidate({
                cacheName: "pages-cache",
                plugins: [
                    new BroadcastUpdatePlugin({
                        headersToCheck: ["content-length", "etag", "last-modified"],
                    }),
                ],
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
