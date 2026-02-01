import { formattedNumber } from "@/app/utils/words"
import { cn } from "@/lib/utils"

interface MemberWithBalance {
    id: string
    name: string | null
    profile: string | null
    totalSpent: number
    balance: number
    isInvited?: boolean
    email?: string
}

interface MemberCardProps {
    member: MemberWithBalance
}

export function MemberCard({ member }: MemberCardProps) {
    return (
        <div className="flex items-center gap-x-4 border shadow-xs p-3 rounded-lg">
            {member.profile ? (
                <img
                    alt={member.name ?? ""}
                    className="w-12 h-12 rounded-full object-cover"
                    src={member.profile}
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-semibold text-muted-foreground">
                    {member.name?.[0]?.toUpperCase() ?? "?"}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h6 className="font-semibold truncate">{member.name}</h6>
                    {member.isInvited && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                            Invited
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                    {member.isInvited && member.email
                        ? member.email
                        : `Spend: ${formattedNumber(member.totalSpent)}`}
                </p>
            </div>
            <p
                className={cn(
                    "text-sm font-semibold shrink-0",
                    member.balance > 0
                        ? "text-green-700"
                        : member.balance < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                )}
            >
                {formattedNumber(member.balance)}
            </p>
        </div>
    )
}
