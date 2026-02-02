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
        console.log("[refreshPageCache] Fetching:", url)
        // Fetch with proper headers so SW recognizes it as an HTML page request
        fetch(url, {
            cache: "no-cache", // Bypass browser cache, hit network
            headers: {
                Accept: "text/html", // Signal we want HTML
            },
        })
            .then((res) => {
                console.log("[refreshPageCache] Response:", res.status, res.ok)
            })
            .catch((err) => {
                console.log("[refreshPageCache] Error:", err)
            })
    } else {
        console.log("[refreshPageCache] No SW controller available")
    }
}
