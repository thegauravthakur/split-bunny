import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css"
import { LayoutProps } from "@/types/common"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
    title: "Split Bunny",
    description: "Split Bunny is an app that helps you split bills with your friends.",
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="">
                    <header className="flex items-center border-b px-4 py-3 text-sm">
                        <h1>Split Bunny</h1>
                        <ul className="flex-1 flex gap-x-4 justify-center">
                            <li>Home</li>
                            <li>Groups</li>
                            <li>Settings</li>
                        </ul>
                        <div className="flex gap-x-4">
                            <button>Sign in</button>
                            <button>Sign up</button>
                        </div>
                    </header>
                    {children}
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    )
}
