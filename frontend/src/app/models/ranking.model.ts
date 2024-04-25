export interface RankingModel {
  _id: string;
  class: string;
  name: string;
  wins: number;
  losses: number;
  winPercentage: number;
  ranking: number;
}
