import mongoose, { Document, Schema } from "mongoose";
import { IGame } from "../game/Game";

export interface IUser extends Document {
  username: string;
  password: string;
  games?: IGame[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
