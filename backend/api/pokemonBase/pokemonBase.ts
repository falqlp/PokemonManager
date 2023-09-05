import mongoose, { Document, Schema } from "mongoose";
import PokemonStats from "../../models/PokemonModels/pokemonStats";

interface IPokemonBase extends Document {
  id: number;
  name: string;
  types: string[];
  baseStats: typeof PokemonStats.schema;
}

const pokemonBaseSchema = new Schema<IPokemonBase>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  types: [{ type: String }],
  baseStats: { type: PokemonStats.schema, required: true },
});

const PokemonBase = mongoose.model<IPokemonBase>(
  "PokemonBase",
  pokemonBaseSchema
);
export default PokemonBase;
