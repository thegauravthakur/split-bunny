import { HeaderSkeleton } from "./header-skeleton"

export function AppSkeleton() {
    return (
        <>
            <HeaderSkeleton />
            <div className="flex-1 flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        </>
    )
}
