import mongoose, { Schema } from "mongoose";
import { ITrainer } from "../trainer/Trainer";
import { MongoId } from "../MongoId";

export interface IBattleInstance extends MongoId {
  player: ITrainer;
  opponent: ITrainer;
  winner?: string;
  gameId: string;
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
  winner: {
    type: String,
  },
  gameId: { type: String, required: true },
});

const Battle = mongoose.model<IBattleInstance>("Battle", battleSchema);
export default Battle;
