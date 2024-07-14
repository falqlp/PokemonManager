import { MongoId } from "../MongoId";
import { Schema } from "mongoose";

export interface IBattleEventIdentifier extends MongoId {
  battleId: string;
  competitionId: string;
  date: Date;
}
export const battleEventIdentifierSchema = new Schema<IBattleEventIdentifier>({
  date: { type: Date, required: true },
  battleId: { type: String, required: true },
  competitionId: { type: String, required: true },
});
