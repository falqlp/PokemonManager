import mongoose, { Document, Schema } from "mongoose";
import PokemonStats from "../../models/PokemonModels/pokemonStats";

interface IPokemon extends Document {
  trainerId?: string;
  nickname?: string;
  basePokemon: mongoose.Types.ObjectId;
  level: number;
  exp: number;
  expMax: number;
  moves: mongoose.Types.ObjectId[];
  stats: typeof PokemonStats.schema;
  ev: typeof PokemonStats.schema;
  iv: typeof PokemonStats.schema;
}

const pokemonSchema = new Schema<IPokemon>({
  trainerId: { type: String, required: false },
  nickname: { type: String, required: false },
  basePokemon: { type: mongoose.Schema.Types.ObjectId, ref: "PokemonBase" },
  level: { type: Number, required: true },
  exp: { type: Number, required: true },
  expMax: { type: Number, required: true },
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Move" }],
  stats: { type: PokemonStats.schema, required: true },
  ev: { type: PokemonStats.schema, required: true },
  iv: { type: PokemonStats.schema, required: true },
});

const Pokemon = mongoose.model<IPokemon>("Pokemon", pokemonSchema);
export default Pokemon;
