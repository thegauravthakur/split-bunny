"use client"

import { useClerk } from "@clerk/nextjs"
import { IoIosLogOut } from "react-icons/io"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
    const { signOut } = useClerk()

    return (
        <Button
            className="size-8"
            size="icon"
            variant="outline"
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
        >
            <IoIosLogOut />
        </Button>
    )
}
