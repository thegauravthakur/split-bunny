import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Home() {
    return (
        <div className={cn("min-h-dvh flex items-center justify-center flex-col gap-4")}>
            <h1 className="text-2xl font-semibold">Hello World, Split Bunny!</h1>
            <Button>Get Started</Button>
        </div>
    )
}
