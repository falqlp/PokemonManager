import mongoose, { Schema } from 'mongoose';
import { MongoId } from 'shared/common/domain/MongoId';
import { Gender } from 'shared/models/utils/utils-models';

export interface ITrainerName extends MongoId {
  name: string;
  gender: Gender[];
}

const trainerNameSchema = new Schema<ITrainerName>({
  name: { type: String, required: true, unique: true },
  gender: [{ type: String, required: true }],
});

const TrainerName = mongoose.model<ITrainerName>(
  'TrainerName',
  trainerNameSchema,
);
export default TrainerName;
