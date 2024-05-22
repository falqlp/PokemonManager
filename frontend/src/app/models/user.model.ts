import { GameModel } from './game.model';
export enum Languages {
  FR = 'fr-FR',
  EN = 'en-EN',
}

export interface UserModel {
  username: string;
  password?: string;
  _id?: string;
  games?: GameModel[];
  email: string;
  verified: boolean;
  subscribeToNewsletter: boolean;
  lang: Languages;
  friends: UserModel[];
  friendRequest: UserModel[];
  hasReadNews?: boolean;
}
