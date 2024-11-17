import { err, ok, Result } from "neverthrow"

type ResultInterface<T, K> = { value: T } | { error: K }

export function createParsableResultInterface<T, K>(result: Result<T, K>): ResultInterface<T, K> {
    return { ...result }
}

export function parseResultInterfaceFromObject<T, K>(data: ResultInterface<T, K>): Result<T, K> {
    if ("error" in data) return err(data.error)
    return ok(data.value)
}
