"use client"
import { ReactNode } from "react"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

interface DialogBottomSheetProps {
    trigger: ReactNode
    closeElement?: ReactNode
    title?: ReactNode
    description?: ReactNode
    body: ReactNode
    modal?: boolean
}

export function DialogBottomSheet({
    trigger,
    title,
    description,
    body,
    modal,
    closeElement,
}: DialogBottomSheetProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop)
        return (
            <Dialog modal={modal}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        {title ? <DialogTitle>{title}</DialogTitle> : null}
                        {description ? <DialogDescription>{description}</DialogDescription> : null}
                    </DialogHeader>
                    {body}
                </DialogContent>
                {closeElement ? <DialogClose>{closeElement}</DialogClose> : null}
            </Dialog>
        )

    return (
        <Drawer autoFocus modal={modal}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent className="px-2 pb-4">
                <DrawerHeader className="">
                    {title ? <DrawerTitle>{title}</DrawerTitle> : null}
                    {description ? <DrawerDescription>{description}</DrawerDescription> : null}
                </DrawerHeader>
                {body}
            </DrawerContent>
            {closeElement ? <DrawerClose>{closeElement}</DrawerClose> : null}
        </Drawer>
    )
}
