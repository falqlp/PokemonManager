import mongoose, { Schema } from "mongoose";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";
import { IPokemonBase } from "../pokemonBase/PokemonBase";
import { IMove } from "../move/Move";
import { MongoId } from "../MongoId";
import { Gender } from "../Gender";
export enum PokemonNature {
  HARDY = "HARDY",
  LONELY = "LONELY",
  BRAVE = "BRAVE",
  ADAMANT = "ADAMANT",
  NAUGHTY = "NAUGHTY",
  BOLD = "BOLD",
  DOCILE = "DOCILE",
  RELAXED = "RELAXED",
  IMPISH = "IMPISH",
  LAX = "LAX",
  TIMID = "TIMID",
  HASTY = "HASTY",
  SERIOUS = "SERIOUS",
  JOLLY = "JOLLY",
  NAIVE = "NAIVE",
  MODEST = "MODEST",
  MILD = "MILD",
  QUIET = "QUIET",
  BASHFUL = "BASHFUL",
  RASH = "RASH",
  CALM = "CALM",
  GENTLE = "GENTLE",
  SASSY = "SASSY",
  CAREFUL = "CAREFUL",
  QUIRKY = "QUIRKY",
}

export interface IPokemon extends MongoId {
  trainerId?: string;
  nickname?: string;
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
  trainingPercentage: number;
  birthday?: Date;
  gameId: string;
  maxLevel: number;
  hatchingDate?: Date;
  hiddenPotential: string;
  shiny: boolean;
  nature: PokemonNature;
  strategy: number[];
  gender: Gender;
}

const pokemonSchema = new Schema<IPokemon>({
  trainerId: { type: String, required: false },
  nickname: { type: String, required: false },
  basePokemon: { type: mongoose.Schema.Types.ObjectId, ref: "PokemonBase" },
  level: { type: Number, required: true },
  exp: { type: Number, required: true },
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Move" }],
  stats: { type: Schema.Types.Mixed, required: true },
  ev: { type: Schema.Types.Mixed, required: true },
  iv: { type: Schema.Types.Mixed, required: true },
  happiness: { type: Number, required: true },
  age: { type: Number },
  potential: { type: Number, required: true },
  trainingPercentage: { type: Number, required: true },
  birthday: { type: Date },
  gameId: { type: String, required: true },
  maxLevel: { type: Number, required: true },
  hatchingDate: { type: Date },
  hiddenPotential: { type: String, required: true },
  shiny: { type: Boolean },
  nature: { type: String, required: true },
  strategy: [{ type: Number }],
  gender: { type: String, required: true },
});

const Pokemon = mongoose.model<IPokemon>("Pokemon", pokemonSchema);
export default Pokemon;
