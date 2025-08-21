import { Console, Data, Effect, } from 'effect'

class FetchError extends Data.TaggedError("FetchError")<{message?: string}> {}
class JsonError extends Data.TaggedError("JsonError") {}
class ResponseNotOk extends Data.TaggedError("ResponseNotOk") {}

const makeError = (e: unknown) => e instanceof Error ? e : new Error(String(e))

const fetchRequest = Effect.tryPromise({
    try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
    catch: (e) => new FetchError({ message: makeError(e).message })
})

const jsonRespnse = (response: Response) => 
    Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError()
    })

const main = fetchRequest.pipe(
    Effect.filterOrFail(
        response => response.ok,
        () => new ResponseNotOk()
    ),
    Effect.flatMap(jsonRespnse),
    Effect.catchTags({
        FetchError: () => Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.succeed("There was a json error"),
        ResponseNotOk: () => Effect.succeed("Response returned not ok")
    })
)


Effect.runPromise(main).then(console.log)
