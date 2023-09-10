import mongoose, { Document, Schema } from "mongoose";
import { IParty } from "../api/party/party";

interface IUser extends Document {
  username: string;
  password: string;
  parties?: IParty[];
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Party" }],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
