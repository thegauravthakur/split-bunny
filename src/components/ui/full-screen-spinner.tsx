export function FullScreenSpinner() {
    return (
        <span className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></span>
        </span>
    )
}
