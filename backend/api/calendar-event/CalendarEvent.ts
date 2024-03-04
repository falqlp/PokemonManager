import mongoose, { Document, Schema } from "mongoose";
import { IBattleInstance } from "../battle-instance/Battle";
import { ITrainer } from "../trainer/Trainer";

export type CalendarEventEvent =
  | "Battle"
  | "GenerateNurseryEggs"
  | "NurseryFirstSelectionDeadline"
  | "NurseryLastSelectionDeadline";

export interface ICalendarEvent extends Document {
  date: Date;
  type: CalendarEventEvent;
  event?: IBattleInstance;
  trainers: ITrainer[];
  gameId: string;
}

const CalendarEventSchema = new Schema<ICalendarEvent>({
  event: { type: Schema.Types.ObjectId, ref: "Battle" },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  trainers: [{ type: Schema.Types.ObjectId, ref: "Trainer" }],
  gameId: { type: String, required: true },
});

const CalendarEvent = mongoose.model<ICalendarEvent>(
  "CalendarEvent",
  CalendarEventSchema
);
export default CalendarEvent;
