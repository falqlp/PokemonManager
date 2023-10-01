import { TrainerModel } from './TrainersModels/trainer.model';

export interface GameModel {
  actualDate?: Date;
  player: TrainerModel;
  name: string;
  _id?: string;
}
