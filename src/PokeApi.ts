import * as Config from "effect/Config";
import * as ConfigError from "effect/ConfigError";
import * as Context from "effect/Context"
import * as Effect from "effect/Effect";

import * as Errors from "./errors.js";
import * as ParseResult from "effect/ParseResult";
import * as Schemas from "./schemas.js"
import { PokemonCollection } from "./PokemonCollection.js";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl.js";



export class PokeApi extends Context.Tag("PokeApi")<PokeApi, typeof make>() {
    static readonly Live = PokeApi.of(make)
}

const make = {
        getPokemon: Effect.gen(function* () {
            const pokemonCollection = yield* PokemonCollection;
            const buildPokeApiUrl = yield* BuildPokeApiUrl;

            const requestUrl = buildPokeApiUrl({
                name: pokemonCollection[0]
            })


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

