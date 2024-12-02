"use client"
import dynamic from "next/dynamic"
import { ReactNode } from "react"

const Drawer = dynamic(
    () => import("@/app/components/dialog-bottom-sheet/drawer").then((m) => m.Drawer),
    { ssr: true },
)

const Dialog = dynamic(
    () => import("@/app/components/dialog-bottom-sheet/dialog").then((m) => m.Dialog),
    { ssr: true },
)

export interface DialogBottomSheetProps {
    trigger: ReactNode
    closeElement?: ReactNode
    title?: ReactNode
    description?: ReactNode
    body: ReactNode
    modal?: boolean
    open?: boolean
    device?: "mobile" | "desktop"
    setOpen?: (open: boolean) => void
}

export function DialogBottomSheet(props: DialogBottomSheetProps) {
    if (props.device === "desktop") return <Dialog {...props} />
    return <Drawer {...props} />
}
