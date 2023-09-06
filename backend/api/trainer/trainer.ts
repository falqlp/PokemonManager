import mongoose, { Document, Schema } from "mongoose";
import { IPokemon } from "../pokemon/pokemon";
import { IPcStorage } from "../pcStorage/pcStorage";

export interface ITrainer extends Document {
  name: string;
  pokemons: IPokemon[];
  pcStorage: IPcStorage;
}

const trainerSchema = new Schema<ITrainer>({
  name: { type: String, required: true, unique: true },
  pokemons: [{ type: Schema.Types.ObjectId, ref: "Pokemon" }],
  pcStorage: {
    type: Schema.Types.ObjectId,
    ref: "PcStorage",
    required: true,
  },
});

const Trainer = mongoose.model<ITrainer>("Trainer", trainerSchema);
export default Trainer;
