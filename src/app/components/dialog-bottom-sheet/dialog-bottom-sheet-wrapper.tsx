"use client"

import dynamic from "next/dynamic"

import { DialogBottomSheetProps } from "@/app/components/dialog-bottom-sheet/dialog-bottom-sheet"

const Drawer = dynamic(
    () => import("@/app/components/dialog-bottom-sheet/drawer").then((m) => m.Drawer),
    { ssr: true },
)

const Dialog = dynamic(
    () => import("@/app/components/dialog-bottom-sheet/dialog").then((m) => m.Dialog),
    { ssr: true },
)

export function DialogBottomSheetWrapper(
    props: DialogBottomSheetProps & { device: "mobile" | "desktop" },
) {
    if (props.device === "desktop") return <Dialog {...props} />
    return <Drawer {...props} />
}
