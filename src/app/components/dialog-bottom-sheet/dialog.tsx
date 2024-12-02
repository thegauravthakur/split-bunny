"use client"

import { DialogBottomSheetProps } from "@/app/components/dialog-bottom-sheet/dialog-bottom-sheet"
import {
    Dialog as _Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function Dialog({
    modal,
    setOpen,
    trigger,
    title,
    description,
    body,
    open,
    closeElement,
}: DialogBottomSheetProps) {
    return (
        <_Dialog modal={modal} open={open} onOpenChange={setOpen}>
            <p>gaurav-apple</p>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    {title ? <DialogTitle>{title}</DialogTitle> : null}
                    {description ? <DialogDescription>{description}</DialogDescription> : null}
                </DialogHeader>
                {body}
            </DialogContent>
            {closeElement ? <DialogClose>{closeElement}</DialogClose> : null}
        </_Dialog>
    )
}
