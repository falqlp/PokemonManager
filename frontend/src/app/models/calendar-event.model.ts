import { BattleModel } from './Battle.model';
import { TrainerModel } from './TrainersModels/trainer.model';
export enum CalendarEventEvent {
  BATTLE = 'BATTLE',
  GENERATE_NURSERY_EGGS = 'GENERATE_NURSERY_EGGS',
  NURSERY_FIRST_SELECTION_DEADLINE = 'NURSERY_FIRST_SELECTION_DEADLINE',
  NURSERY_LAST_SELECTION_DEADLINE = 'NURSERY_LAST_SELECTION_DEADLINE',
}

export interface CalendarEventModel {
  date: Date;
  type: CalendarEventEvent;
  event?: BattleModel;
  trainers: TrainerModel[];
}
