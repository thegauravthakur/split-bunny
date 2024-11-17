import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { err, ok, Result } from "neverthrow"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function safeJSONParse<T>(data: string) {
    try {
        return ok(JSON.parse(data) as T)
    } catch (error) {
        return err(["An error occurred while parsing the response to JSON."])
    }
}
