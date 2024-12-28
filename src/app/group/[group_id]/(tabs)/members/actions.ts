"use server"

import { err, ok } from "neverthrow"
import { z } from "zod"

import { createParsableResultInterface } from "@/app/utils/result"

const addNewMemberSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.string({ message: "Invalid email address" }).email("Invalid email address."),
})

export async function addNewMember(formData: FormData) {
    const data = Object.fromEntries(formData.entries())
    const email = formData.get("email") as string
    console.log("DATA", data, email)
    const parseResult = addNewMemberSchema.safeParse(data)
    if (!parseResult.success) {
        const data = parseResult.error.errors.map((error) => error.message)
        return createParsableResultInterface(err(data))
    }
    return createParsableResultInterface(ok(["Member added successfully"]))
}
