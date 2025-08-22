import {HttpResponse, http} from "msw"
import type {Pokemon} from "../src/schemas.js"

export const mockPokemon: Pokemon = {
    id: 1, 
    height: 10,
    weight: 20,
    order: 1,
    name: "MockPokemon"
}

export const handlers = [
    http.get("http://localhost:3000/api/v2/pokemon/*", () => 
        HttpResponse.json(mockPokemon))

]
