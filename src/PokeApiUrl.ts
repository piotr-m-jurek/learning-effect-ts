import { Config, Context, Effect, Layer } from "effect";
import { Env } from "./Env.js";


const make = Effect.gen(function* () {
    yield* Env;
    const baseUrl = yield* Config.string("BASE_URL")
    return PokeApiUrl.of(`${baseUrl}/api/v2/pokemon`)
})

export class PokeApiUrl extends Context.Tag("PokeApiUrl")<
    PokeApiUrl,
    string
> () {
    static readonly Live = Layer.effect(
        this,
        make
    ).pipe(Layer.provide(Env.Live))
}
