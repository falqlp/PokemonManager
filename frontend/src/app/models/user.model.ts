import { GameModel } from './party.model';

export interface UserModel {
  username: string;
  password?: string;
  _id?: string;
  games?: GameModel[];
}
