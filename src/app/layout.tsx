import "./globals.css"

import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"

import { Header } from "@/app/components/header"
import { Toaster } from "@/components/ui/sonner"
import { LayoutProps } from "@/types/common"

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
