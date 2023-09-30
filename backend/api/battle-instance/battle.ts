import mongoose, { Document, Schema } from "mongoose";
import { ITrainer } from "../trainer/trainer";

export interface IBattleInstance extends Document {
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
