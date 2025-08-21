import * as Context from "effect/Context"
import * as Effect from "effect/Effect";

import * as Errors from "./errors.js";
import * as Schemas from "./schemas.js"
import { PokemonCollection } from "./PokemonCollection.js";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl.js";
import { Layer } from "effect";



const make = Effect.gen(function* () {
    const pokemonCollection = yield* PokemonCollection;
    const buildPokeApiUrl = yield* BuildPokeApiUrl;

    return {
        getPokemon: Effect.gen(function* () {

            const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] })

            const response = yield* Effect.tryPromise({
                try: () => fetch(requestUrl),
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
    }
})



export class PokeApi extends Context.Tag("PokeApi")<
    PokeApi,
    Effect.Effect.Success<typeof make>
>() {
    static readonly Live = Layer.effect(this, make).pipe(
        Layer.provide(
            Layer.mergeAll(PokemonCollection.Default, BuildPokeApiUrl.Live)
        )

    )

    static readonly Mock = Layer.succeed(
        this,
        PokeApi.of({
            getPokemon: Effect.succeed({
                id: 1,
                height: 10,
                weight: 10,
                name: "my-name",
                order: 1,
            }),
        })
    )

}
