import mongoose, { Document, Schema } from "mongoose";
import { IPokemon } from "../pokemon/pokemon";

export interface IPcStorageStorage {
  pokemon: IPokemon;
  position: number;
}

export interface IPcStorage extends Document {
  maxSize: number;
  storage: IPcStorageStorage[];
}

const PcStorageStorageSchema = new Schema<IPcStorageStorage>({
  pokemon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pokemon",
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
});

const pcStorageSchema = new Schema<IPcStorage>({
  maxSize: {
    type: Number,
    required: true,
  },
  storage: [PcStorageStorageSchema],
});

const PcStorage = mongoose.model<IPcStorage>("PcStorage", pcStorageSchema);
export default PcStorage;
