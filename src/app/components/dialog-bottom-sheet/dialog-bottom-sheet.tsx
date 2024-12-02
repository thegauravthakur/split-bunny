import { ReactNode } from "react"

import { DialogBottomSheetWrapper } from "@/app/components/dialog-bottom-sheet/dialog-bottom-sheet-wrapper"
import { getDevice } from "@/app/utils/device/device.server"

export interface DialogBottomSheetProps {
    trigger: ReactNode
    closeElement?: ReactNode
    title?: ReactNode
    description?: ReactNode
    body: ReactNode
    modal?: boolean
    open?: boolean
    setOpen?: (open: boolean) => void
}

export async function DialogBottomSheet(props: DialogBottomSheetProps) {
    const device = await getDevice()
    return <DialogBottomSheetWrapper device={device} {...props} />
}
