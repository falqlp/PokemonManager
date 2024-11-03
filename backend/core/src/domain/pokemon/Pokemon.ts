import mongoose, { Schema } from 'mongoose';
import { IPokemon } from 'shared/models/pokemon/pokemon-models';

const pokemonSchema = new Schema<IPokemon>({
  trainerId: { type: String, required: false },
  nickname: { type: String, required: false },
  basePokemon: { type: mongoose.Schema.Types.ObjectId, ref: 'PokemonBase' },
  level: { type: Number, required: true },
  exp: { type: Number, required: true },
  moves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Move' }],
  stats: { type: Schema.Types.Mixed, required: true },
  ev: { type: Schema.Types.Mixed, required: true },
  iv: { type: Schema.Types.Mixed, required: true },
  happiness: { type: Number, required: true },
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
  battleStrategy: [{ type: Number }],
  gender: { type: String, required: true },
});

const Pokemon = mongoose.model<IPokemon>('Pokemon', pokemonSchema);
export default Pokemon;
