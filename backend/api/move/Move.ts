import mongoose, { Document, Schema } from "mongoose";
import { PokemonType } from "../../models/Types/Types";

export interface IMove extends Document {
  id: number;
  name: string;
  type: PokemonType;
  category: string;
  accuracy: number;
  power?: number;
  effect?: string;
  animation: IAnimation;
}

export interface IAnimation {
  opponent: string;
  player: string;
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
  animation: { opponent: { type: String }, player: { type: String } },
});

const Move = mongoose.model<IMove>("Move", moveSchema);
export default Move;
