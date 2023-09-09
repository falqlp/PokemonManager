import { BattleModel } from './Battle.model';

export interface CalendarEventModel {
  date: Date;
  type: string;
  event: BattleModel;
}
