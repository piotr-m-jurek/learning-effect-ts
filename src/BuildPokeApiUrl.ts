import {  Effect } from "effect"
import { PokeApiUrl } from "./PokeApiUrl.js"

export class BuildPokeApiUrl extends Effect.Service<BuildPokeApiUrl>()(
    "BuildPokeApiUrl",
    {
        effect: Effect.gen(function* () {
            const url = yield* PokeApiUrl;
            return ({ name }: { name: string }) => `${url}/${name}`
        }),
        dependencies: [PokeApiUrl.Live]
    }
) {}
