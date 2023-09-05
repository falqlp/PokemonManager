import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  trainerId?: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  trainerId: { type: String },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
