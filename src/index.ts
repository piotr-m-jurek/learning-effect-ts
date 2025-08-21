import { Console, Effect, } from 'effect'

const fetchRequest = Effect.tryPromise(
    () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"))

const jsonRespnse = (response: Response) => 
    Effect.tryPromise(() => response.json())

const main = fetchRequest.pipe(
    Effect.flatMap(jsonRespnse),
    Effect.catchTag("UnknownException", () => Effect.succeed(
        () => Console.log("FAILED ON UNKNOWN EXEPTION"))
    )
)


Effect.runPromise(main)
