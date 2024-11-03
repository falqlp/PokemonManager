import mongoose, { Schema } from 'mongoose';
import { ITrainer } from '../trainer/Trainer';
import { MongoId } from 'shared/common/domain/MongoId';
import { ICompetition } from '../competiton/Competition';

export type IWinner = 'opponent' | 'player';

export interface IBattleInstance extends MongoId {
  player: ITrainer;
  opponent: ITrainer;
  winner?: IWinner;
  gameId: string;
  competition: ICompetition;
}

const battleSchema = new Schema<IBattleInstance>({
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
  competition: {
    type: Schema.Types.ObjectId,
    ref: 'Competition',
    required: true,
  },
  winner: {
    type: String,
  },
  gameId: { type: String, required: true },
});

const Battle = mongoose.model<IBattleInstance>('Battle', battleSchema);
export default Battle;
