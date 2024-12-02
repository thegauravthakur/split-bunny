"use client"
import { ReactNode } from "react"
import { Drawer } from "vaul"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface DialogBottomSheetProps {
    trigger: ReactNode
    closeElement?: ReactNode
    title?: ReactNode
    description?: ReactNode
    body: ReactNode
    modal?: boolean
    open?: boolean
    setOpen?: (open: boolean) => void
}

export function DialogBottomSheet({
    trigger,
    title,
    description,
    body,
    modal,
    open,
    setOpen,
    closeElement,
}: DialogBottomSheetProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop)
        return (
            <Dialog modal={modal} open={open} onOpenChange={setOpen}>
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
        <Drawer.Root>
            <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-white z-20 flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[10px]">
                    <div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
                        <Drawer.Handle />
                        <div className="text-center mt-4 mb-8">
                            {title ? (
                                <Drawer.Title className="text-lg font-semibold">
                                    {title}
                                </Drawer.Title>
                            ) : null}
                            {description ? (
                                <Drawer.Description className="text-muted-foreground">
                                    {description}
                                </Drawer.Description>
                            ) : null}
                        </div>
                        {body}
                        <Drawer.Close asChild>
                            <Button autoFocus className="w-full mt-2" variant="outline">
                                Close
                            </Button>
                        </Drawer.Close>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}
