import { Config, Data, Effect, Schema, } from 'effect'
import * as Errors from './errors.js'
import * as Schemas from './schemas.js'

// TODO: wrap in a dependency
import dotenv from 'dotenv'
dotenv.config({quiet: true})
// ====



const config = Config.string("BASE_URL")

const getPokemon = Effect.gen(function* () {
    const baseUrl = yield* config;

    const response = yield* Effect.tryPromise({
    try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
    catch: (e) => new Errors.FetchError({ message: Errors.makeError(e).message })
})

    if (!response.ok) {
        return yield* new Errors.ResponseNotOk()
    }

    const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new Errors.JsonError()
    })

    return yield* Schemas.decodePokemon(json)
})


const main = getPokemon.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.succeed("There was a json error"),
        ResponseNotOk: () => Effect.succeed("Response returned not ok"),
        ParseError: (e) => Effect.succeed(`There was an error when parsing the structure: ${e.toString()}`)
    })
)

Effect.runPromise(main).then(console.log)
