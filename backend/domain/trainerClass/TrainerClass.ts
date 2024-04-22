import mongoose, { Document, Schema } from "mongoose";
import { Gender } from "../Gender";

export interface ITrainerClass extends Document {
  class: string;
  gender: Gender[];
}

const trainerClassSchema = new Schema<ITrainerClass>({
  class: { type: String, required: true, unique: true },
  gender: [{ type: String, required: true }],
});

const TrainerClass = mongoose.model<ITrainerClass>(
  "trainerClass",
  trainerClassSchema,
);
export default TrainerClass;
