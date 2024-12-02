"use client"

import { Context, createContext, ReactNode } from "react"

interface DeviceProviderProps {
    device: "mobile" | "desktop"
    children: ReactNode
}

type Device = "mobile" | "desktop"

function makeQueryClient(value: null | Device = null) {
    return createContext<null | "mobile" | "desktop">(value)
}

let deviceContext: Context<"mobile" | "desktop" | null>

export function getDeviceContext(value: null | Device = null) {
    if (typeof window === "undefined") {
        return makeQueryClient(value)
    } else {
        if (!deviceContext) deviceContext = makeQueryClient(value)
        return deviceContext
    }
}

export function DeviceProvider({ device, children }: DeviceProviderProps) {
    const DeviceContext = getDeviceContext(device)
    return <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
}
