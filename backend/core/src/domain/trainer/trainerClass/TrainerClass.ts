import mongoose, { Schema } from 'mongoose';
import { Gender } from '../../Gender';
import { MongoId } from 'shared/common/domain/MongoId';

export interface ITrainerClass extends MongoId {
  class: string;
  gender: Gender[];
}

const trainerClassSchema = new Schema<ITrainerClass>({
  class: { type: String, required: true, unique: true },
  gender: [{ type: String, required: true }],
});

const TrainerClass = mongoose.model<ITrainerClass>(
  'trainerClass',
  trainerClassSchema,
);
export default TrainerClass;
