import mongoose, { Document, Schema } from "mongoose";
import { Gender } from "../Gender";

export interface ITrainerName extends Document {
  name: string;
  gender: Gender[];
}

const trainerNameSchema = new Schema<ITrainerName>({
  name: { type: String, required: true, unique: true },
  gender: [{ type: String, required: true }],
});

const TrainerName = mongoose.model<ITrainerName>(
  "TrainerName",
  trainerNameSchema
);
export default TrainerName;
