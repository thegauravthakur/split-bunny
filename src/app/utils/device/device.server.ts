import { headers } from "next/headers"
import { userAgent } from "next/server"

export async function getDevice(): Promise<"mobile" | "desktop"> {
    const _headers = await headers()
    const { device } = userAgent({ headers: _headers })
    return device.type === "mobile" ? "mobile" : "desktop"
}
