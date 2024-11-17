"use client"

import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
import { IoIosLogOut } from "react-icons/io"

export function LogoutButton() {
    const { signOut } = useClerk()

    return (
        <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
        >
            <IoIosLogOut />
        </Button>
    )
}
