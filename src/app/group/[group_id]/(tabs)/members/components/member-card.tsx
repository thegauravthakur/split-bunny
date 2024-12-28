import { formattedNumber } from "@/app/utils/words"
import { cn } from "@/lib/utils"

interface MemberWithBalance {
    name: string | null
    profile: string
    totalSpent: number
    balance: number
}

interface MemberCardProps {
    member: MemberWithBalance
}

export function MemberCard({ member }: MemberCardProps) {
    return (
        <div className="flex items-center gap-x-4 border shadow-sm p-3 rounded-lg">
            <img alt={member.name ?? ""} className="w-12 h-12 rounded-full" src={member.profile} />
            <div className="flex-1">
                <h6 className="font-semibold">{member.name}</h6>
                <p className="text-sm text-muted-foreground">
                    Spend: {formattedNumber(member.totalSpent)}
                </p>
            </div>
            <p
                className={cn(
                    "text-sm font-semibold",
                    member.balance > 0 ? "text-green-700" : "text-red-600",
                )}
            >
                {formattedNumber(member.balance)}
            </p>
        </div>
    )
}
