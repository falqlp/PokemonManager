import mongoose, { Document, Schema } from "mongoose";

export interface IMoveLearning extends Document {
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
  "MoveLearning",
  moveLearningSchema,
);
export default MoveLearning;
