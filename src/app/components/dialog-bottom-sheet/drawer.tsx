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
    hideCloseButton,
}: DialogBottomSheetProps) {
    return (
        <_Drawer.Root open={open} onOpenChange={setOpen}>
            <_Drawer.Trigger asChild>{trigger}</_Drawer.Trigger>
            <_Drawer.Portal>
                <_Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <_Drawer.Content className="bg-white z-20 flex flex-col fixed bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[10px]">
                    <div className="max-w-md w-full mx-auto flex flex-col max-h-full">
                        {/* Fixed header */}
                        <div className="p-4 pb-0 border-t rounded-t-xl">
                            <_Drawer.Handle />
                            <div className="text-center mt-4 mb-4">
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
                        </div>
                        {/* Scrollable body */}
                        <div
                            className={`flex-1 overflow-auto px-4 ${hideCloseButton ? "pb-4" : ""}`}
                        >
                            {body}
                        </div>
                        {/* Fixed footer */}
                        {!hideCloseButton && (
                            <div className="p-4 pt-2">
                                <_Drawer.Close asChild>
                                    <Button className="w-full" variant="outline">
                                        Close
                                    </Button>
                                </_Drawer.Close>
                            </div>
                        )}
                    </div>
                </_Drawer.Content>
            </_Drawer.Portal>
        </_Drawer.Root>
    )
}
