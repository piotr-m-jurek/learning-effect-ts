import { Data, Effect, Schema, } from 'effect'

// TODO: wrap in a dependency
import dotenv from 'dotenv'
dotenv.config({quiet: true})
// ====

class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
    id: Schema.Number,
    order: Schema.Number,
    name: Schema.String,
    height: Schema.Number,
    weight: Schema.Number,
}) {
    public get formatHeight(): string {
        return `${this.height} cm`
    }
}

const decodePokemon = Schema.decodeUnknown(Pokemon)


class FetchError extends Data.TaggedError("FetchError")<{message?: string}> {}
class JsonError extends Data.TaggedError("JsonError") {}
class ResponseNotOk extends Data.TaggedError("ResponseNotOk") {}

const makeError = (e: unknown) => e instanceof Error ? e : new Error(String(e))

const fetchRequest = Effect.tryPromise({
    try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
    catch: (e) => new FetchError({ message: makeError(e).message })
})

const jsonResponse = (response: Response) => 
    Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError()
    })

const program = Effect.gen(function* () {
    const response = yield* fetchRequest;

    if (!response.ok) {
        return yield* new ResponseNotOk()
    }

    const json = yield* jsonResponse(response)

    return yield* decodePokemon(json)
})


const main = program.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.succeed("There was a json error"),
        ResponseNotOk: () => Effect.succeed("Response returned not ok"),
        ParseError: (e) => Effect.succeed(`There was an error when parsing the structure: ${e.toString()}`)
    })
)

Effect.runPromise(main).then(console.log)
