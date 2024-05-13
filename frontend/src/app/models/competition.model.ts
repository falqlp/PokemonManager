import { TrainerModel } from './TrainersModels/trainer.model';

export enum CompetitionType {
  CHAMPIONSHIP = 'CHAMPIONSHIP',
  TOURNAMENT = 'TOURNAMENT',
  FRIENDLY = 'FRIENDLY',
  GROUPS = 'GROUPS',
}

interface BaseCompetition {
  _id?: string;
  startDate?: Date;
  endDate?: Date;
  name: string;
  type: CompetitionType;
  gameId: string;
  division?: number;
}

export interface TournamentCompetitionModel extends BaseCompetition {
  type: CompetitionType.TOURNAMENT;
  tournament: TournamentCompetitionModel;
  division: number;
}

export interface GroupsCompetitionModel extends BaseCompetition {
  type: CompetitionType.GROUPS;
  groups: TrainerModel[][];
  division: number;
}

interface BasicCompetitionModel extends BaseCompetition {
  type: CompetitionType.CHAMPIONSHIP | CompetitionType.FRIENDLY;
}

export type CompetitionModel =
  | TournamentCompetitionModel
  | BasicCompetitionModel
  | GroupsCompetitionModel;
