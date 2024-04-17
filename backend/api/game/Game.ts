import mongoose, { Document, Schema } from "mongoose";
import { ITrainer } from "../../domain/trainer/Trainer";
import { entitySchema, IEntity } from "../Entity";

export interface IGame extends Document, IEntity {
  player: ITrainer;
  actualDate: Date;
  name: string;
}

const GameSchema = new Schema<IGame>({
  ...entitySchema,
  name: {
    type: String,
    required: true,
  },
  actualDate: { type: Date, required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
});

const Game = mongoose.model<IGame>("Game", GameSchema);
export default Game;
