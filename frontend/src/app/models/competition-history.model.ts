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

export interface GroupsCompetitionHistoryModel extends BaseCompetitionHistory {
  type: CompetitionType.GROUPS;
  groups: RankingModel[][];
}

interface NonTournamentCompetitionHistory extends BaseCompetitionHistory {
  type: CompetitionType.CHAMPIONSHIP;
  ranking: RankingModel[];
}

export type CompetitionHistoryModel =
  | TournamentCompetitionHistoryModel
  | GroupsCompetitionHistoryModel
  | NonTournamentCompetitionHistory;
