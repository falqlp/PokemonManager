import { BattleModel } from './Battle.model';
import { TrainerModel } from './TrainersModels/trainer.model';

export type CalendarEventEvent =
  | 'Battle'
  | 'GenerateNurseryEggs'
  | 'NurseryFirstSelectionDeadline'
  | 'NurseryLastSelectionDeadline';

export interface CalendarEventModel {
  date: Date;
  type: CalendarEventEvent;
  event?: BattleModel;
  trainers: TrainerModel[];
}
