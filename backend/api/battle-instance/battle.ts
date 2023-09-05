import mongoose, { Document, Schema } from "mongoose";

interface IBattle extends Document {
  player: Schema.Types.ObjectId;
  opponent: Schema.Types.ObjectId;
  winner?: string;
}

const battleSchema = new Schema<IBattle>({
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
});

const Battle = mongoose.model<IBattle>("Battle", battleSchema);
export default Battle;
