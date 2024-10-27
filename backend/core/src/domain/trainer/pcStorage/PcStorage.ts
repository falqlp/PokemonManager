import mongoose, { Schema } from 'mongoose';
import { IPokemon } from '../../pokemon/Pokemon';
import { MongoId } from 'shared/common/domain/MongoId';

export interface IPcStorageStorage {
  pokemon: IPokemon;
  position: number;
}

export interface IPcStorage extends MongoId {
  maxSize: number;
  storage: IPcStorageStorage[];
  gameId: string;
}

const PcStorageStorageSchema = new Schema<IPcStorageStorage>({
  pokemon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pokemon',
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
  gameId: { type: String, required: true },
});

const PcStorage = mongoose.model<IPcStorage>('PcStorage', pcStorageSchema);
export default PcStorage;
