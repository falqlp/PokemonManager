import { GameModel } from './game.model';

export interface UserModel {
  username: string;
  password?: string;
  _id?: string;
  games?: GameModel[];
  email: string;
  verified: boolean;
  subscribeToNewsletter: boolean;
}
