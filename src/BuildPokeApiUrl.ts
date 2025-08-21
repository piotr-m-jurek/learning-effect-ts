import { Context, Effect, Layer } from "effect"
import { PokeApiUrl } from "./PokeApiUrl.js"

export class BuildPokeApiUrl extends Context.Tag("BuildPokeApiUrl")<
    BuildPokeApiUrl,
    (props: {name: string}) => string
>() {
    static readonly Live = Layer.effect(
        this,
        Effect.gen(function* () {
            const url = yield* PokeApiUrl;
            return BuildPokeApiUrl.of(({name}) => `${url}/${name}`)
        })
    ).pipe(
        Layer.provide(PokeApiUrl.Live)
    )

};
