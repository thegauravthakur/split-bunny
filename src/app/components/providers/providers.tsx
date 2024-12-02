import { ReactNode } from "react"

import { DeviceProvider } from "@/app/components/providers/device-provider"
import { getDevice } from "@/app/utils/device/device.server"

interface ProvidersProps {
    children: ReactNode
}

export async function Providers({ children }: ProvidersProps) {
    const device = await getDevice()
    console.log("outer-device", device)
    return <DeviceProvider device={device}>{children}</DeviceProvider>
}
