"use client"
import { SignIn, useSignIn } from "@clerk/nextjs"
import { FullScreenSpinner } from "@/components/ui/full-screen-spinner"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
// import dynamic from "next/dynamic"

// const SignIn = dynamic(() => import("@clerk/nextjs").then((mod) => mod.SignIn), {})

export default function LoginPage() {
    const [showSignUp, setShowSignUp] = useState(false)
    const { isLoaded } = useSignIn()

    useEffect(() => {
        let timeout: number | undefined
        if (isLoaded) {
            const timeout = setTimeout(() => setShowSignUp(true), 500)
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
