import * as Config from "effect/Config";
import * as ConfigError from "effect/ConfigError";
import * as Context from "effect/Context"
import * as Effect from "effect/Effect";

import * as Errors from "./errors.js";
import * as ParseResult from "effect/ParseResult";
import * as Schemas from "./schemas.js"


export interface PokeApiImpl {
    readonly getPokemon: Effect.Effect<
        Schemas.Pokemon,
        Errors.FetchError | Errors.JsonError | Errors.ResponseNotOk | ParseResult.ParseError | ConfigError.ConfigError
    >;
}

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
    static readonly Live = PokeApi.of({
        getPokemon: Effect.gen(function* () {
            const baseUrl = yield* Config.string("BASE_URL");

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
    })
}

