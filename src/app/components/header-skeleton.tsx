import { MdOutlineCallSplit } from "react-icons/md"

export function HeaderSkeleton() {
    return (
        <header className="flex items-center justify-between border-b px-2 md:px-4 text-sm h-12 md:h-14 shadow-xs">
            <h1 className="font-bold text-base md:text-lg flex items-center gap-2">
                <MdOutlineCallSplit className="size-5 md:size-6" />
                <span>Split Bunny</span>
            </h1>
            <div className="size-7 md:size-8 rounded-full bg-gray-200 animate-pulse" />
        </header>
    )
}
