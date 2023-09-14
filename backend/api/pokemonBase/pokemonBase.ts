import mongoose, { Document, Schema } from "mongoose";
import PokemonStats, {
  IPokemonStats,
} from "../../models/PokemonModels/pokemonStats";

export interface IPokemonBase extends Document {
  id: number;
  name: string;
  types: string[];
  baseStats: IPokemonStats;
  legendary?: boolean;
  mythical?: boolean;
  baby?: boolean;
  genderRate?: number;
  captureRate: number;
  baseHappiness: number;
  base: boolean;
}

const pokemonBaseSchema = new Schema<IPokemonBase>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  types: [{ type: String }],
  baseStats: { type: PokemonStats.schema, required: true },
  legendary: { type: Boolean },
  mythical: { type: Boolean },
  baby: { type: Boolean },
  genderRate: { type: Number },
  captureRate: { type: Number, required: true },
  baseHappiness: { type: Number, required: true },
  base: { type: Boolean, required: true },
});

const PokemonBase = mongoose.model<IPokemonBase>(
  "PokemonBase",
  pokemonBaseSchema
);
export default PokemonBase;
