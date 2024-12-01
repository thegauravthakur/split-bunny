"use client"

import { useClerk } from "@clerk/nextjs"
import { ReactNode, useState } from "react"
import { CgSpinner } from "react-icons/cg"

import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LogoutButtonProps extends ButtonProps {
    children: ReactNode
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { signOut } = useClerk()

    async function handleLogout() {
        try {
            setIsLoading(true)
            await signOut({ redirectUrl: "/sign-in" })
            setIsLoading(false)
        } catch (_error) {
            setIsLoading(false)
        }
    }

    return (
        <Button
            disabled={props.disabled || isLoading}
            onClick={handleLogout}
            {...props}
            className={cn(props.className, isLoading && "justify-center")}
        >
            {isLoading ? <CgSpinner className="animate-spin" /> : children}
        </Button>
    )
}
