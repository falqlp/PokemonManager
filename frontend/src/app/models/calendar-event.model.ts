import { BattleModel } from './Battle.model';
import { TrainerModel } from './TrainersModels/trainer.model';

export type CalendarEventEvent =
  | 'Battle'
  | 'GenerateNurseryEggs'
  | 'NurseryFirstSelectionDeadline'
  | 'NurserySecondSelectionDeadline';

export interface CalendarEventModel {
  date: Date;
  type: CalendarEventEvent;
  event?: BattleModel;
  trainers: TrainerModel[];
}
