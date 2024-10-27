import mongoose, { Schema } from 'mongoose';
import { ITrainer } from '../trainer/Trainer';
import { entitySchema, IEntity } from 'shared/common/domain/Entity';
import { MongoId } from 'shared/common/domain/MongoId';

export interface IPlayer {
  userId: string;
  trainer?: ITrainer;
  playingTime: number;
}

export interface IGame extends MongoId, IEntity {
  actualDate: Date;
  players: IPlayer[];
  name: string;
}

const PlayerSchema = new Schema<IPlayer>({
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  userId: { type: String, required: true },
  playingTime: { type: Number },
});

const GameSchema = new Schema<IGame>({
  ...entitySchema,
  name: {
    type: String,
    required: true,
  },
  actualDate: { type: Date, required: true },
  players: [PlayerSchema],
});

const Game = mongoose.model<IGame>('Game', GameSchema);
export default Game;
