import mongoose, { Document, Schema } from "mongoose";
import { ITrainer } from "../trainer/Trainer";

export interface IGame extends Document {
  player: ITrainer;
  actualDate: Date;
  name: string;
}

const GameSchema = new Schema<IGame>({
  name: {
    type: String,
    required: true,
  },
  actualDate: { type: Date, required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
});

const Game = mongoose.model<IGame>("Game", GameSchema);
export default Game;
