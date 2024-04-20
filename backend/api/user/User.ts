import mongoose, { Document, Schema } from "mongoose";
import { IGame } from "../../domain/game/Game";
import { entitySchema, IEntity } from "../Entity";

export interface IUser extends Document, IEntity {
  username: string;
  password: string;
  games?: IGame[];
}

const userSchema = new Schema<IUser>({
  ...entitySchema,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
