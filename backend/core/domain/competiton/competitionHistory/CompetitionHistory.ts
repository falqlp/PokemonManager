import { MongoId } from "../../MongoId";
import { CompetitionType } from "../Competition";
import {
  IRankingBase,
  ISerieRanking,
  ITrainerRanking,
} from "../../../application/battleInstance/BattleInstanceService";
import mongoose, { Schema } from "mongoose";

interface BaseCompetitionHistory extends MongoId {
  season: number;
  type: CompetitionType;
  gameId: string;
  name: string;
  division: number;
}

export interface ITournamentCompetitionHistory extends BaseCompetitionHistory {
  type: CompetitionType.TOURNAMENT;
  tournament: ISerieRanking[][];
}

export interface IGroupsCompetitionHistory extends BaseCompetitionHistory {
  type: CompetitionType.GROUPS;
  groups: ITrainerRanking[][];
}

interface NonTournamentCompetitionHistory extends BaseCompetitionHistory {
  type: CompetitionType.CHAMPIONSHIP;
  ranking: ITrainerRanking[];
}

export type ICompetitionHistory =
  | ITournamentCompetitionHistory
  | IGroupsCompetitionHistory
  | NonTournamentCompetitionHistory;

const RankingBaseSchemaBase = {
  name: { type: String, required: true },
  wins: { type: Number, required: true },
  class: { type: String },
  _id: { type: String, required: true },
};
const RankingBaseSchema = new Schema<IRankingBase>(RankingBaseSchemaBase);
const SerieRankingSchema = new Schema<ISerieRanking>({
  winner: { type: String },
  player: { type: RankingBaseSchema, required: true },
  opponent: { type: RankingBaseSchema, required: true },
});
const TrainerRankingSchema = new Schema<ITrainerRanking>({
  ...RankingBaseSchemaBase,
  losses: { type: Number, required: true },
  winPercentage: { type: Number, required: true },
  ranking: { type: Number, required: true },
});

const CompetitionHistorySchema = new Schema<ICompetitionHistory>({
  type: { type: String, required: true },
  season: { type: Number, required: true },
  gameId: { type: String, required: true },
  name: { type: String, required: true },
  division: { type: Number, required: true },
  ranking: {
    type: [TrainerRankingSchema],
    required: function (): boolean {
      return this.type === CompetitionType.CHAMPIONSHIP;
    },
  },
  groups: {
    type: [[TrainerRankingSchema]],
    required: function (): boolean {
      return this.type === CompetitionType.GROUPS;
    },
  },
  tournament: {
    type: [[SerieRankingSchema]],
    required: function (): boolean {
      return this.type === CompetitionType.TOURNAMENT;
    },
  },
});

const CompetitionHistory = mongoose.model<ICompetitionHistory>(
  "CompetitionHistory",
  CompetitionHistorySchema,
);
export default CompetitionHistory;
