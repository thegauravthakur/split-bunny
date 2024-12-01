"use client"

import { SignUp, useSignIn } from "@clerk/nextjs"
import { useEffect, useState } from "react"

import { FullScreenSpinner } from "@/components/ui/full-screen-spinner"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const [showSignUp, setShowSignUp] = useState(false)
    const { isLoaded } = useSignIn()

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>
        if (isLoaded) {
            timeout = setTimeout(() => setShowSignUp(true), 200)
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [isLoaded])

    return (
        <main className="flex items-center justify-center flex-1">
            {!showSignUp && <FullScreenSpinner />}
            <span className={cn("w-full flex justify-center mt-6", !showSignUp && "invisible")}>
                <SignUp />
            </span>
        </main>
    )
}
