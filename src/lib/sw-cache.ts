export function clearPagesCache() {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" })
    }
}

/**
 * Fetches a page in the background to update the SW cache.
 * This is useful for updating the cache after client-side navigation,
 * since Next.js client navigation doesn't go through the service worker.
 */
export function refreshPageCache(url: string = "/") {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        // Fetch with cache: "reload" to bypass browser cache and hit the network
        // The SW will intercept this and update its cache via stale-while-revalidate
        fetch(url, {
            cache: "reload",
            headers: {
                // Signal this is a cache refresh, not a user navigation
                "X-Cache-Refresh": "true",
            },
        }).catch(() => {
            // Silently ignore errors - this is a background optimization
        })
    }
}
