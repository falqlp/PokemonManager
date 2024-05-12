import mongoose, { Schema } from "mongoose";
import { MongoId } from "../MongoId";
import { ITournament } from "./tournament/Tournament";

export enum CompetitionType {
  CHAMPIONSHIP = "CHAMPIONSHIP",
  TOURNAMENT = "TOURNAMENT",
  FRIENDLY = "FRIENDLY",
}

interface BaseCompetition extends MongoId {
  startDate?: Date;
  endDate?: Date;
  name: string;
  type: CompetitionType;
  gameId: string;
}

export interface ITournamentCompetition extends BaseCompetition {
  type: CompetitionType.TOURNAMENT;
  tournament: ITournament;
}

interface NonTournamentCompetition extends BaseCompetition {
  type: Exclude<CompetitionType, CompetitionType.TOURNAMENT>;
}

export type ICompetition = ITournamentCompetition | NonTournamentCompetition;

const CompetitionSchema = new Schema<ICompetition>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  gameId: { type: String, required: true },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: function (): boolean {
      return this.type === CompetitionType.TOURNAMENT;
    },
  },
});

const Competition = mongoose.model<ICompetition>(
  "Competition",
  CompetitionSchema,
);
export default Competition;
