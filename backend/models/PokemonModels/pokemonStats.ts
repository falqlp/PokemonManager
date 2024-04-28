import mongoose, { Schema } from "mongoose";

export interface IPokemonStats {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  spe: number;
}

const pokemonStatsSchema = new Schema<IPokemonStats>({
  hp: { type: Number, required: true },
  atk: { type: Number, required: true },
  def: { type: Number, required: true },
  spAtk: { type: Number, required: true },
  spDef: { type: Number, required: true },
  spe: { type: Number, required: true },
});

const PokemonStats = mongoose.model<IPokemonStats>(
  "PokemonStats",
  pokemonStatsSchema,
);
export default PokemonStats;
