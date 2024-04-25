import { TrainerModel } from './TrainersModels/trainer.model';
import { CompetitionModel } from './competition.model';

export interface BattleModel {
  player: TrainerModel;
  opponent: TrainerModel;
  competition: CompetitionModel;
  _id?: string;
  winner?: 'player' | 'opponent';
}
