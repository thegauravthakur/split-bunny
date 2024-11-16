"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { ClerkAPIResponseError } from "@clerk/clerk-js"

export interface GenericFormActionResponse {
    hasErrors: boolean
    errors?: string[]
}

export async function loginUserAction(formData: FormData): Promise<GenericFormActionResponse> {
    const response: GenericFormActionResponse = { hasErrors: false }

    try {
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const client = await clerkClient()
        await client.users.createUser({ emailAddress: [email], password })
    } catch (error: unknown) {
        const clerkError = error as ClerkAPIResponseError
        const errors = clerkError?.errors?.map((error) => error.message)
        const defaultError = ["An error occurred. Please try again."]
        response.hasErrors = true
        response.errors = errors ?? defaultError
    }

    return response
}
