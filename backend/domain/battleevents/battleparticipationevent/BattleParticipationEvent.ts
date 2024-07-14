import mongoose, { Schema } from "mongoose";
import {
  battleEventIdentifierSchema,
  IBattleEventIdentifier,
} from "../BattleEventIdentifier";

export interface IBattleParticipationEvent extends IBattleEventIdentifier {
  pokemonIds: string[];
  trainerId: string;
}

const battleParticipationEventSchema = new Schema<IBattleParticipationEvent>({
  ...battleEventIdentifierSchema,
  pokemonIds: [{ type: String, required: true }],
  trainerId: { type: String, required: true },
});

const BattleParticipationEvent = mongoose.model<IBattleParticipationEvent>(
  "BattleParticipationEvent",
  battleParticipationEventSchema,
);
export default BattleParticipationEvent;
