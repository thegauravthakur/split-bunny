import { SignUp } from "@clerk/nextjs"

export default function LoginPage() {
    return (
        <main className="min-h-dvh flex items-center justify-center">
            <SignUp />
        </main>
    )
}
