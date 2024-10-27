import { MongoId } from 'shared/common/domain/MongoId';
import { IUser } from '../User';
import mongoose, { Schema } from 'mongoose';

export interface IPasswordRequest extends MongoId {
  expirationDate: Date;
  user: IUser;
}

const passwordRequestSchema = new Schema<IPasswordRequest>({
  expirationDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const PasswordRequest = mongoose.model<IPasswordRequest>(
  'PasswordRequest',
  passwordRequestSchema,
);
export default PasswordRequest;
