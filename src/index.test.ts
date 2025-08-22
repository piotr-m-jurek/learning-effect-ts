import { afterAll, beforeAll, beforeEach } from "vitest"
import { server } from "../test/node"


beforeAll(() => {
    server.listen()
})

beforeEach(() => {
	server.resetHandlers()

})
afterAll(() => {
    server.close()
})
