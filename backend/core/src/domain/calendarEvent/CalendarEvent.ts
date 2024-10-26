import mongoose, { Schema } from 'mongoose';
import { IBattleInstance } from '../battleInstance/Battle';
import { ITrainer } from '../trainer/Trainer';
import { entitySchema, IEntity } from '../Entity';
import { MongoId } from '../MongoId';

export enum CalendarEventEvent {
  BATTLE = 'BATTLE',
  GENERATE_NURSERY_EGGS = 'GENERATE_NURSERY_EGGS',
  NURSERY_FIRST_SELECTION_DEADLINE = 'NURSERY_FIRST_SELECTION_DEADLINE',
  NURSERY_LAST_SELECTION_DEADLINE = 'NURSERY_LAST_SELECTION_DEADLINE',
}

export interface ICalendarEvent extends MongoId, IEntity {
  date: Date;
  type: CalendarEventEvent;
  event?: IBattleInstance;
  trainers: ITrainer[];
  gameId: string;
}

const CalendarEventSchema = new Schema<ICalendarEvent>({
  ...entitySchema,
  event: { type: Schema.Types.ObjectId, ref: 'Battle' },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  trainers: [{ type: Schema.Types.ObjectId, ref: 'Trainer' }],
  gameId: { type: String, required: true },
});

const CalendarEvent = mongoose.model<ICalendarEvent>(
  'CalendarEvent',
  CalendarEventSchema,
);
export default CalendarEvent;
