import { TrainerModel } from './TrainersModels/trainer.model';

export interface PartyModel {
  actualDate: Date;
  player: TrainerModel;
  name: string;
}
