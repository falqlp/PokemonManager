export enum CompetitionType {
  CHAMPIONSHIP = 'CHAMPIONSHIP',
  TOURNAMENT = 'TOURNAMENT',
  FRIENDLY = 'FRIENDLY',
}

export interface CompetitionModel {
  _id?: string;
  startDate?: Date;
  endDate?: Date;
  name: string;
  type: CompetitionType;
  gameId: string;
}
