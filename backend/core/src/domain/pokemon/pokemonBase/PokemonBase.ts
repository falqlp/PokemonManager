import mongoose, { Schema } from 'mongoose';
import PokemonStats from '../../../models/PokemonModels/pokemonStats';
import { IPokemonBase } from 'shared/models/pokemon/pokemon-models';

const pokemonBaseSchema = new Schema<IPokemonBase>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  types: [{ type: String }],
  baseStats: { type: PokemonStats.schema, required: true },
  legendary: { type: Boolean },
  mythical: { type: Boolean },
  ultraBeast: { type: Boolean },
  paradox: { type: Boolean },
  baby: { type: Boolean },
  genderRate: { type: Number },
  captureRate: { type: Number, required: true },
  baseHappiness: { type: Number, required: true },
  base: { type: Boolean, required: true },
});

const PokemonBase = mongoose.model<IPokemonBase>(
  'PokemonBase',
  pokemonBaseSchema,
);
export default PokemonBase;
