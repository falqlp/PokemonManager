import mongoose, { Schema } from 'mongoose';
import { MongoId } from 'shared/common/domain/MongoId';

export interface IMoveLearning extends MongoId {
  learnMethod: string;
  levelLearnAt?: number;
  pokemonId: number;
  moveId: string;
}

const moveLearningSchema = new Schema<IMoveLearning>({
  learnMethod: {
    type: String,
    required: true,
  },
  levelLearnAt: {
    type: Number,
  },
  pokemonId: {
    type: Number,
    required: true,
  },
  moveId: {
    type: String,
    required: true,
  },
});

const MoveLearning = mongoose.model<IMoveLearning>(
  'MoveLearning',
  moveLearningSchema,
);
export default MoveLearning;
