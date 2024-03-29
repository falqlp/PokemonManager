import mongoose, { Document, Schema } from "mongoose";
import PokemonStats, {
  IPokemonStats,
} from "../../models/PokemonModels/pokemonStats";
import { IPokemonBase } from "../pokemonBase/PokemonBase";
import { IMove } from "../move/Move";

export interface IPokemon extends Document {
  trainerId?: string;
  nickname?: string;
  currentHp?: number;
  basePokemon: IPokemonBase;
  level: number;
  exp: number;
  moves: IMove[];
  stats: IPokemonStats;
  ev?: IPokemonStats;
  iv?: IPokemonStats;
  happiness: number;
  age?: number;
  potential: number;
  trainingPourcentage: number;
  birthday?: Date;
  gameId: string;
  maxLevel: number;
  hatchingDate?: Date;
  hiddenPotential: string;
  shiny: boolean;
}

const pokemonSchema = new Schema<IPokemon>({
  trainerId: { type: String, required: false },
  nickname: { type: String, required: false },
  basePokemon: { type: mongoose.Schema.Types.ObjectId, ref: "PokemonBase" },
  level: { type: Number, required: true },
  exp: { type: Number, required: true },
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Move" }],
  stats: { type: PokemonStats.schema, required: true },
  ev: { type: PokemonStats.schema, required: true },
  iv: { type: PokemonStats.schema, required: true },
  happiness: { type: Number, required: true },
  age: { type: Number },
  potential: { type: Number, required: true },
  trainingPourcentage: { type: Number, required: true },
  birthday: { type: Date },
  gameId: { type: String, required: true },
  maxLevel: { type: Number, required: true },
  hatchingDate: { type: Date },
  hiddenPotential: { type: String, required: true },
  shiny: { type: Boolean },
});

const Pokemon = mongoose.model<IPokemon>("Pokemon", pokemonSchema);
export default Pokemon;
