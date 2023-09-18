import mongoose, { Document, Schema } from "mongoose";
import { IBattleInstance } from "../battle-instance/battle";
import { ITrainer } from "../trainer/trainer";

export interface ICalendarEvent extends Document {
  date: Date;
  type: string;
  event: IBattleInstance;
  trainers: ITrainer[];
  partyId: string;
}

const CalendarEventSchema = new Schema<ICalendarEvent>({
  event: { type: Schema.Types.ObjectId, ref: "Battle" },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  trainers: [{ type: Schema.Types.ObjectId, ref: "Trainer" }],
  partyId: { type: String, required: true },
});

const CalendarEvent = mongoose.model<ICalendarEvent>(
  "CalendarEvent",
  CalendarEventSchema
);
export default CalendarEvent;
