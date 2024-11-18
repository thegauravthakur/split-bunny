import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"

import { LayoutProps } from "@/types/common"
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/app/components/header"

import "./globals.css"

export const metadata: Metadata = {
    title: "Split Bunny",
    description: "Split Bunny is an app that helps you split bills with your friends.",
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className="min-h-dvh flex flex-col">
                    <Header />
                    {children}
                    <Toaster />
                </body>
            </html>
        </ClerkProvider>
    )
}
