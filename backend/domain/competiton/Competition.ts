import mongoose, { Schema } from "mongoose";
import { MongoId } from "../MongoId";

export enum CompetitionType {
  CHAMPIONSHIP = "CHAMPIONSHIP",
  TOURNAMENT = "TOURNAMENT",
  FRIENDLY = "FRIENDLY",
}

export interface ICompetition extends MongoId {
  startDate?: Date;
  endDate?: Date;
  name: string;
  type: CompetitionType;
  gameId: string;
}

const CompetitionSchema = new Schema<ICompetition>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  gameId: { type: String, required: true },
});

const Competition = mongoose.model<ICompetition>(
  "Competition",
  CompetitionSchema,
);
export default Competition;
