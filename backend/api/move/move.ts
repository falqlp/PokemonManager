import mongoose, { Document, Schema } from "mongoose";

export interface IMove extends Document {
  id: number;
  name: string;
  type: string;
  category: string;
  accuracy: number;
  power?: number;
  effect?: string;
}

const moveSchema = new Schema<IMove>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  power: {
    type: Number,
  },
  effect: {
    type: String,
  },
});

const Move = mongoose.model<IMove>("Move", moveSchema);
export default Move;
