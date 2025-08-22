import { Effect, Layer } from 'effect'
import { PokeApi} from './PokeApi.js'

// TODO: wrap in a dependency
// import dotenv from 'dotenv'
// dotenv.config({quiet: true})
// ====

const program = Effect.gen(function* () {
    const pokeApi = yield* PokeApi;
    return yield* pokeApi.getPokemon;
})


const MainLayer = Layer.mergeAll(PokeApi.Default)
const runnable = program.pipe(Effect.provide(MainLayer))

// const MockLayer = Layer.mergeAll(PokeApi.Mock)
// const runnable = program.pipe(Effect.provide(MockLayer))


const main = runnable.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.succeed("There was a json error"),
        ResponseNotOk: () => Effect.succeed("Response returned not ok"),
        ParseError: (e) => Effect.succeed(`There was an error when parsing the structure: ${e.toString()}`)
    })
)

Effect.runPromise(main).then(console.log)
