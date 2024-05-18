import { TrainerModel } from './TrainersModels/trainer.model';

export interface PlayerModel {
  userId: string;
  trainer?: TrainerModel;
  playingTime: number;
}
