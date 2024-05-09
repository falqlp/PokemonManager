export interface RankingBaseModel {
  _id: string;
  class: string;
  name: string;
  wins: number;
}

export interface RankingModel extends RankingBaseModel {
  losses: number;
  winPercentage: number;
  ranking: number;
}

export interface SerieRankingModel {
  player: RankingBaseModel;
  opponent: RankingBaseModel;
  winner?: string;
}
