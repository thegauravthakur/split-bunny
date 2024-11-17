import { err, ok, Result } from "neverthrow"
import { safeJSONParse } from "@/lib/utils"

/**
 * For the simplicity sake, every server action response that we want to consume on client end
 * should be in the given structure. `Result<SuccessMessage[], ErrorMessage[]>`
 */
type ServerSerializableStructure = Result<string[], string[]>

/**
 * Object structure should always remain the same
 * @param result - Result object that you want to pass to the client
 */
export function createServerStreameableResponse(result: ServerSerializableStructure) {
    return JSON.stringify(result)
}

export function parseServerStringToResultInterface(data: string): ServerSerializableStructure {
    const response = safeJSONParse<Record<string, unknown>>(data)

    if (response.isErr())
        return err(["An error occurred while parsing the response to the result interface."])

    const result = response.value as Record<string, unknown>
    if (result.error) return err(result.error as string[])
    if (result.value) return ok(result.value as string[])

    return err(["An error occurred while parsing the response to the result interface."])
}
