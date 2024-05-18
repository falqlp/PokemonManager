import { PlayerModel } from './player.model';

export interface GameModel {
  actualDate?: Date;
  players: PlayerModel[];
  name: string;
  _id?: string;
}
