
import dotenv from 'dotenv'
import { Context, Effect, Layer } from 'effect'

export class Env extends Context.Tag("Env")<Env, void> () {
    static readonly Live = Layer.effect(
        this,
        Effect.sync(() => {
            dotenv.config({quiet: true})
        })
    )
}
