import { Console, Effect } from 'effect'

const fetchRequest = Effect.promise(
    () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
)
const jsonRespnse =(response: Response) =>Effect.promise(() =>    response.json())
const main = Effect.flatMap(
    fetchRequest,
    jsonRespnse
)


Effect.runPromise(main).then(console.log)
