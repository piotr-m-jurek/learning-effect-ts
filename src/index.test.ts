import { afterAll, beforeAll, beforeEach, expect, it } from "vitest"
import { server } from "../test/node.js"
import { Effect, Layer } from "effect"
import { PokeApi } from "./PokeApi.js"
import { mockPokemon } from "../test/handlers.js"
import { TestConfigProviderLayer } from "./Config.js"

beforeAll(() => {
    server.listen()
})
beforeEach(() => {
    server.resetHandlers()
})
afterAll(() => {
    server.close()
})




const program = Effect.gen(function* () {
    const pokeApi = yield* PokeApi;
    return yield* pokeApi.getPokemon
})

const MainLayer = PokeApi.Default.pipe(Layer.provide(TestConfigProviderLayer))

const main = program.pipe(Effect.provide(MainLayer))
it("returns a valid pokemon", async () => {
    const response = await Effect.runPromise(main)

    expect(response).toEqual(mockPokemon)
})
