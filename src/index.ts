import * as Effect from 'effect'

// TODO: wrap in a dependency
import dotenv from 'dotenv'
import { PokeApi} from './PokeApi.js'
dotenv.config({quiet: true})
// ====

const program = Effect.Effect.gen(function* () {
    const pokeApi = yield* PokeApi;
    return yield* pokeApi.getPokemon;
})

const runnable = program.pipe(Effect.Effect.provideService(PokeApi, PokeApi.Live))

const main = runnable.pipe(
    Effect.Effect.catchTags({
        FetchError: () => Effect.Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.Effect.succeed("There was a json error"),
        ResponseNotOk: () => Effect.Effect.succeed("Response returned not ok"),
        ParseError: (e) => Effect.Effect.succeed(`There was an error when parsing the structure: ${e.toString()}`)
    })
)

Effect.Effect.runPromise(main).then(console.log)
