import mongoose, { Schema } from 'mongoose';
import { IPokemon } from '../pokemon/Pokemon';
import { IPcStorage } from './pcStorage/PcStorage';
import { ITrainingCamp } from './trainingCamp/TrainingCamp';
import { INursery } from './nursery/Nursery';
import { MongoId } from '../MongoId';
import { ICompetition } from '../competiton/Competition';

export interface ITrainer extends MongoId {
  name: string;
  class?: string;
  pokemons: IPokemon[];
  pcStorage: IPcStorage;
  trainingCamp: ITrainingCamp;
  nursery: INursery;
  gameId: string;
  berries: number;
  monney: number;
  competitions: ICompetition[];
  division?: number;
}

const trainerSchema = new Schema<ITrainer>({
  name: { type: String, required: true },
  pokemons: [{ type: Schema.Types.ObjectId, ref: 'Pokemon' }],
  competitions: [{ type: Schema.Types.ObjectId, ref: 'Competition' }],
  pcStorage: {
    type: Schema.Types.ObjectId,
    ref: 'PcStorage',
    required: true,
  },
  trainingCamp: {
    type: Schema.Types.ObjectId,
    ref: 'TrainingCamp',
    required: true,
  },
  nursery: { type: Schema.Types.ObjectId, ref: 'Nursery', required: true },
  gameId: { type: String, required: true },
  class: { type: String },
  berries: { type: Number, required: true },
  monney: { type: Number, required: true },
  division: { type: Number },
});

const Trainer = mongoose.model<ITrainer>('Trainer', trainerSchema);
export default Trainer;
