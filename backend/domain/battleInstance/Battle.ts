import mongoose, { Schema } from "mongoose";
import { ITrainer } from "../trainer/Trainer";
import { MongoId } from "../MongoId";
import { ICompetition } from "../competiton/Competition";

export interface IBattleInstance extends MongoId {
  player: ITrainer;
  opponent: ITrainer;
  winner?: string;
  gameId: string;
  competition: ICompetition;
}

const battleSchema = new Schema<IBattleInstance>({
  player: {
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  opponent: {
    type: Schema.Types.ObjectId,
    ref: "Trainer",
    required: true,
  },
  competition: {
    type: Schema.Types.ObjectId,
    ref: "Competition",
    required: true,
  },
  winner: {
    type: String,
  },
  gameId: { type: String, required: true },
});

const Battle = mongoose.model<IBattleInstance>("Battle", battleSchema);
export default Battle;
