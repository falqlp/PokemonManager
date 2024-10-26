import mongoose, { Schema } from 'mongoose';
import { MongoId } from '../../MongoId';

export interface ITrainingCamp extends MongoId {
  level: number;
  gameId: string;
}

const TrainingCampSchema = new Schema<ITrainingCamp>({
  level: { type: Number, required: true },
  gameId: { type: String, required: true },
});

const TrainingCamp = mongoose.model<ITrainingCamp>(
  'TrainingCamp',
  TrainingCampSchema,
);
export default TrainingCamp;
