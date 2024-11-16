import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
    return (
        <main className="min-h-dvh flex items-center justify-center">
            <SignIn />
        </main>
    )
}
