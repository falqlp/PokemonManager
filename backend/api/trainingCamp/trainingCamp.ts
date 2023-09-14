import mongoose, { Document, Schema } from "mongoose";

export interface ITrainingCamp extends Document {
  level: number;
}

const TrainingCampSchema = new Schema<ITrainingCamp>({
  level: { type: Number, required: true },
});

const TrainingCamp = mongoose.model<ITrainingCamp>(
  "TrainingCamp",
  TrainingCampSchema
);
export default TrainingCamp;
