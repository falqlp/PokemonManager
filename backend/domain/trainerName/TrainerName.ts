import mongoose, { Schema } from "mongoose";
import { Gender } from "../Gender";
import { MongoId } from "../MongoId";

export interface ITrainerName extends MongoId {
  name: string;
  gender: Gender[];
}

const trainerNameSchema = new Schema<ITrainerName>({
  name: { type: String, required: true, unique: true },
  gender: [{ type: String, required: true }],
});

const TrainerName = mongoose.model<ITrainerName>(
  "TrainerName",
  trainerNameSchema,
);
export default TrainerName;
