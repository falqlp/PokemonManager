import mongoose, { Document, Schema } from "mongoose";
import { ITrainer } from "../trainer/trainer";

export interface IParty extends Document {
  player: ITrainer;
  actualDate: Date;
  name: string;
}

const PartySchema = new Schema<IParty>({
  name: {
    type: String,
    required: true,
  },
  actualDate: { type: Date, required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer" },
});

const Party = mongoose.model<IParty>("Party", PartySchema);
export default Party;
