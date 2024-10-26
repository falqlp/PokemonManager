import mongoose, { Schema } from 'mongoose';
import { MongoId } from '../../../MongoId';
import { IBattleInstance } from '../../../battleInstance/Battle';
import { ITrainer } from '../../../trainer/Trainer';

export enum SerieTypes {
  BO1 = 1,
  BO3 = 3,
  BO5 = 5,
  BO7 = 7,
}

export interface IBattleSerie extends MongoId {
  maxBattle: SerieTypes;
  gameId: string;
  player: ITrainer;
  opponent: ITrainer;
  battles: IBattleInstance[];
}

export const battleSerieSchema = new Schema<IBattleSerie>({
  maxBattle: { type: Number, required: true },
  gameId: { type: String, required: true },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  opponent: {
    type: Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  battles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Battle',
    },
  ],
});

const BattleSerie = mongoose.model<IBattleSerie>(
  'BattleSerie',
  battleSerieSchema,
);
export default BattleSerie;
