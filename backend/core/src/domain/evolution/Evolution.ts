import mongoose, { Schema } from 'mongoose';
import { MongoId } from '../MongoId';

export interface IEvolution extends MongoId {
  evolutionMethod: string;
  minLevel?: number;
  pokemonId: number;
  evolveTo: number;
  minHappiness?: number;
}

const evolutionSchema = new Schema<IEvolution>({
  evolutionMethod: {
    type: String,
    required: true,
  },
  minLevel: {
    type: Number,
  },
  pokemonId: {
    type: Number,
    required: true,
  },
  evolveTo: {
    type: Number,
    required: true,
  },
  minHappiness: {
    type: Number,
  },
});

const Evolution = mongoose.model<IEvolution>('Evolution', evolutionSchema);
export default Evolution;
