import mongoose, { Document, Schema } from "mongoose";
import PokemonStats, {
  IPokemonStats,
} from "../../models/PokemonModels/pokemonStats";
import { IPokemonBase } from "../pokemonBase/pokemonBase";
import { IMove } from "../move/move";

export interface IPokemon extends Document {
  trainerId?: string;
  nickname?: string;
  currentHp?: number;
  basePokemon: IPokemonBase;
  level: number;
  exp: number;
  expMax: number;
  moves: IMove[];
  stats: IPokemonStats;
  ev: IPokemonStats;
  iv: IPokemonStats;
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