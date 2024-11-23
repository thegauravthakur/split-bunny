"use client"
import { SignIn, useSignIn } from "@clerk/nextjs"
import { useEffect, useState } from "react"

import { FullScreenSpinner } from "@/components/ui/full-screen-spinner"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const [showSignUp, setShowSignUp] = useState(false)
    const { isLoaded } = useSignIn()

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined
        if (isLoaded) {
            timeout = setTimeout(() => setShowSignUp(true), 500)
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [isLoaded])

    return (
        <main className="flex items-center justify-center flex-1">
            {!showSignUp && <FullScreenSpinner />}
            <span className={cn("w-full flex justify-center", !showSignUp && "invisible")}>
                <SignIn />
            </span>
        </main>
    )
}
