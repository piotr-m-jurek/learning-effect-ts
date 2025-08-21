import * as Schema from 'effect/Schema'

export class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
    id: Schema.Number,
    order: Schema.Number,
    name: Schema.String,
    height: Schema.Number,
    weight: Schema.Number,
}) {
    public get formatHeight(): string {
        return `${this.height} cm`
    }
}

export const decodePokemon = Schema.decodeUnknown(Pokemon)

