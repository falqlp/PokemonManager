import { TrainerModel } from './TrainersModels/trainer.model';

export interface BattleModel {
  player: TrainerModel;
  opponent: TrainerModel;
  _id?: string;
}
