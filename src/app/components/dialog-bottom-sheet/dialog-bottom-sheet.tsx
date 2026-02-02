"use client"
import dynamic from "next/dynamic"
import { createContext, ReactNode, useState } from "react"

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
    hideCloseButton?: boolean
    /** Renders an action element (e.g., Done button) on the right side of the header. When provided, title/description become left-aligned. */
    headerRightAction?: ReactNode
}

export const DialogBottomSheetContext = createContext({
    open: false,
    setOpen: (_open: boolean) => {},
})

export function DialogBottomSheet(props: DialogBottomSheetProps) {
    const [_open, setOpen] = useState(false)
    const open = props.open ?? _open

    function handleOpen(open: boolean) {
        setOpen(open)
        if (props.setOpen) props.setOpen(open)
    }

    if (props.device === "desktop")
        return (
            <DialogBottomSheetContext.Provider value={{ open, setOpen }}>
                <Dialog open={open} setOpen={handleOpen} {...props} />
            </DialogBottomSheetContext.Provider>
        )
    return (
        <DialogBottomSheetContext.Provider value={{ open, setOpen }}>
            <Drawer open={open} setOpen={handleOpen} {...props} />
        </DialogBottomSheetContext.Provider>
    )
}
