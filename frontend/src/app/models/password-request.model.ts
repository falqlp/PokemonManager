import { UserModel } from './user.model';

export interface PasswordRequestModel {
  user: UserModel;
  expirationDate: Date;
}
