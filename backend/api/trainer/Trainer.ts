import mongoose, { Document, Schema } from "mongoose";
import { IPokemon } from "../pokemon/Pokemon";
import { IPcStorage } from "../pcStorage/PcStorage";
import { ITrainingCamp } from "../trainingCamp/TrainingCamp";
import { INursery } from "../nursery/Nursery";

export interface ITrainer extends Document {
  name: string;
  pokemons: IPokemon[];
  pcStorage: IPcStorage;
  trainingCamp: ITrainingCamp;
  nursery: INursery;
  gameId: string;
}

const trainerSchema = new Schema<ITrainer>({
  name: { type: String, required: true, unique: true },
  pokemons: [{ type: Schema.Types.ObjectId, ref: "Pokemon" }],
  pcStorage: {
    type: Schema.Types.ObjectId,
    ref: "PcStorage",
    required: true,
  },
  trainingCamp: {
    type: Schema.Types.ObjectId,
    ref: "TrainingCamp",
    required: true,
  },
  nursery: { type: Schema.Types.ObjectId, ref: "Nursery", required: true },
  gameId: { type: String, required: true },
});

const Trainer = mongoose.model<ITrainer>("Trainer", trainerSchema);
export default Trainer;
