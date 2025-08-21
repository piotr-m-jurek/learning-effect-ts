import { Console, Data, Effect, } from 'effect'

class FetchError extends Data.TaggedError("FetchError") {}
class JsonError extends Data.TaggedError("JsonError") {}

const fetchRequest = Effect.tryPromise({
    try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
    catch: () => new FetchError()
})

const jsonRespnse = (response: Response) => 
    Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError()
    })

const main = fetchRequest.pipe(
    Effect.filterOrFail(
        response => response.ok,
        () => new FetchError()
    ),
    Effect.flatMap(jsonRespnse),
    Effect.catchTags({
        FetchError: () => Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.succeed("There was a json error")
    })
)


Effect.runPromise(main).then(console.log)
