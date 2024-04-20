import mongoose, { Document, Schema } from "mongoose";
import { IPokemon } from "../../api/pokemon/Pokemon";
import { IPcStorage } from "../../api/pcStorage/PcStorage";
import { ITrainingCamp } from "../../api/trainingCamp/TrainingCamp";
import { INursery } from "../../api/nursery/Nursery";

export interface ITrainer extends Document {
  name: string;
  class?: string;
  pokemons: IPokemon[];
  pcStorage: IPcStorage;
  trainingCamp: ITrainingCamp;
  nursery: INursery;
  gameId: string;
  berries: number;
  monney: number;
}

const trainerSchema = new Schema<ITrainer>({
  name: { type: String, required: true },
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
  class: { type: String },
  berries: { type: Number, required: true },
  monney: { type: Number, required: true },
});

const Trainer = mongoose.model<ITrainer>("Trainer", trainerSchema);
export default Trainer;
