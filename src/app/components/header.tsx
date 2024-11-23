import Link from "next/link"

import { LogoutButton } from "@/app/components/logout-button"

export function Header() {
    return (
        <header className="flex items-center border-b px-4 py-3 text-sm">
            <h1 className="font-bold">
                <Link href={"/"}>Split Bunny</Link>
            </h1>
            <ul className="flex-1 flex gap-x-4 justify-center">
                <li>Groups</li>
                <li>Activity</li>
                <li>Settings</li>
            </ul>
            <div className="flex gap-x-4">
                <LogoutButton />
            </div>
        </header>
    )
}
