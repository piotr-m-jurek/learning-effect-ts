import { Console, Effect } from 'effect'

const fetchRequest = () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")

const jsonRespnse = (response: Response) =>  response.json()
const main = async () => {
    const response = await fetchRequest()
    const json = await jsonRespnse(response)

    return json
}

main().then(console.log)
