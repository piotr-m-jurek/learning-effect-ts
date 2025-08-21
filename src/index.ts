import { Effect } from 'effect'

// TODO: wrap in a dependency
import dotenv from 'dotenv'
import { PokeApi} from './PokeApi.js'
import { PokemonCollection } from './PokemonCollection.js'
import { BuildPokeApiUrl } from './BuildPokeApiUrl.js'
dotenv.config({quiet: true})
// ====

const program = Effect.gen(function* () {
    const pokeApi = yield* PokeApi;
    return yield* pokeApi.getPokemon;
})

const runnable = program.pipe(
    Effect.provideService(PokeApi, PokeApi.Live),
    Effect.provideService(PokemonCollection, PokemonCollection.Live),
    Effect.provideServiceEffect(BuildPokeApiUrl, BuildPokeApiUrl.Live),
)

const main = runnable.pipe(
    Effect.catchTags({
        FetchError: () => Effect.succeed("There was a fetch error"),
        JsonError: () => Effect.succeed("There was a json error"),
        ResponseNotOk: () => Effect.succeed("Response returned not ok"),
        ParseError: (e) => Effect.succeed(`There was an error when parsing the structure: ${e.toString()}`)
    })
)

Effect.runPromise(main).then(console.log)
