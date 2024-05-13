import { CompetitionType } from './competition.model';
import { RankingModel, SerieRankingModel } from './ranking.model';

interface BaseCompetitionHistory {
  _id: string;
  season: number;
  type: CompetitionType;
  gameId: string;
  name: string;
}

export interface TournamentCompetitionHistoryModel
  extends BaseCompetitionHistory {
  type: CompetitionType.TOURNAMENT;
  tournament: SerieRankingModel[][];
}

interface NonTournamentCompetitionHistory extends BaseCompetitionHistory {
  type: Exclude<CompetitionType, CompetitionType.TOURNAMENT>;
  ranking: RankingModel[];
}

export type CompetitionHistoryModel =
  | TournamentCompetitionHistoryModel
  | NonTournamentCompetitionHistory;
