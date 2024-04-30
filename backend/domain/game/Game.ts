import mongoose, { Schema } from "mongoose";
import { ITrainer } from "../trainer/Trainer";
import { entitySchema, IEntity } from "../Entity";
import { MongoId } from "../MongoId";

export interface IGame extends MongoId, IEntity {
  player: ITrainer;
  actualDate: Date;
  name: string;
  playingTime: number;
}

const GameSchema = new Schema<IGame>({
  ...entitySchema,
  name: {
    type: String,
    required: true,
  },
  actualDate: { type: Date, required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
  playingTime: { type: Number },
});

const Game = mongoose.model<IGame>("Game", GameSchema);
export default Game;
