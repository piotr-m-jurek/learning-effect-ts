import { Effect, Layer, ManagedRuntime, Runtime } from 'effect'
import { PokeApi} from './PokeApi.js'
import { LiveConfigProviderLayer } from './Config.js';

const program = Effect.gen(function* () {
    const pokeApi = yield* PokeApi;
    return yield* pokeApi.getPokemon;
})

const MainLayer = Layer
    .mergeAll(PokeApi.Default)
    .pipe(Layer.provide(LiveConfigProviderLayer))

const PokemonRuntime = ManagedRuntime.make(MainLayer)

const runnable = program.pipe(Effect.provide(MainLayer))

const main = runnable.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.succeed("There was a json error"),
        ResponseNotOk: () => Effect.succeed("Response returned not ok"),
        ParseError: (e) => Effect.succeed(`There was an error when parsing the structure: ${e.toString()}`)
    })
)

PokemonRuntime.runPromise(main).then(console.log)
