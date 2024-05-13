import mongoose, { Schema } from "mongoose";
import { MongoId } from "../MongoId";
import { ITournament } from "./tournament/Tournament";
import { ITrainer } from "../trainer/Trainer";

export enum CompetitionType {
  CHAMPIONSHIP = "CHAMPIONSHIP",
  TOURNAMENT = "TOURNAMENT",
  FRIENDLY = "FRIENDLY",
  GROUPS = "GROUPS",
}

interface BaseCompetition extends MongoId {
  startDate?: Date;
  endDate?: Date;
  name: string;
  type: CompetitionType;
  gameId: string;
  division?: number;
}

export interface ITournamentCompetition extends BaseCompetition {
  type: CompetitionType.TOURNAMENT;
  tournament: ITournament;
  division: number;
}

export interface IGroupsCompetition extends BaseCompetition {
  type: CompetitionType.GROUPS;
  groups: ITrainer[][];
  division: number;
}

interface BasicCompetition extends BaseCompetition {
  type: CompetitionType.CHAMPIONSHIP | CompetitionType.FRIENDLY;
}

export type ICompetition =
  | ITournamentCompetition
  | BasicCompetition
  | IGroupsCompetition;

const CompetitionSchema = new Schema<ICompetition>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  gameId: { type: String, required: true },
  division: { type: Number },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: function (): boolean {
      return this.type === CompetitionType.TOURNAMENT;
    },
  },
  groups: [
    [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        required: function (): boolean {
          return this.type === CompetitionType.GROUPS;
        },
      },
    ],
  ],
});

const Competition = mongoose.model<ICompetition>(
  "Competition",
  CompetitionSchema,
);
export default Competition;
