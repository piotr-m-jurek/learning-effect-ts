import * as Data from 'effect/Data'

export class FetchError extends Data.TaggedError("FetchError")<{message?: string}> {}
export class JsonError extends Data.TaggedError("JsonError") {}
export class ResponseNotOk extends Data.TaggedError("ResponseNotOk") {}

export const makeError = (e: unknown) => e instanceof Error ? e : new Error(String(e))
