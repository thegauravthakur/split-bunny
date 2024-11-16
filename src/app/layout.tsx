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
                    {children}
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    )
}
