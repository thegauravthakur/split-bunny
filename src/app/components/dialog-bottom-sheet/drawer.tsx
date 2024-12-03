"use client"
import { Drawer as _Drawer } from "vaul"

import { DialogBottomSheetProps } from "@/app/components/dialog-bottom-sheet/dialog-bottom-sheet"
import { Button } from "@/components/ui/button"

export function Drawer({
    title,
    description,
    body,
    trigger,
    open,
    setOpen,
}: DialogBottomSheetProps) {
    return (
        <_Drawer.Root open={open} onOpenChange={setOpen}>
            <_Drawer.Trigger asChild>{trigger}</_Drawer.Trigger>
            <_Drawer.Portal>
                <_Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <_Drawer.Content className="bg-white z-20 flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[10px]">
                    <div className="max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
                        <_Drawer.Handle />
                        <div className="text-center mt-4 mb-8">
                            {title ? (
                                <_Drawer.Title className="text-lg font-semibold">
                                    {title}
                                </_Drawer.Title>
                            ) : null}
                            {description ? (
                                <_Drawer.Description className="text-muted-foreground">
                                    {description}
                                </_Drawer.Description>
                            ) : null}
                        </div>
                        {body}
                        <_Drawer.Close asChild>
                            <Button autoFocus className="w-full mt-2" variant="outline">
                                Close
                            </Button>
                        </_Drawer.Close>
                    </div>
                </_Drawer.Content>
            </_Drawer.Portal>
        </_Drawer.Root>
    )
}
