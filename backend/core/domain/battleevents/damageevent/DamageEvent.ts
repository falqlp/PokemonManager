import mongoose, { Schema } from "mongoose";
import {
  battleEventIdentifierSchema,
  IBattleEventIdentifier,
} from "../BattleEventIdentifier";
import { Effectiveness } from "../../../application/battle/BattleInterfaces";

export interface IDamageEvent extends IBattleEventIdentifier {
  value: number;
  ko?: boolean;
  critical: boolean;
  effectiveness: Effectiveness;
  missed: boolean;
  moveId: string;
  pokemonId: string;
  trainerId: string;
  onPokemonId: string;
  onTrainerId: string;
}

const damageEventSchema = new Schema<IDamageEvent>({
  ...battleEventIdentifierSchema,
  value: { type: Number, required: true },
  ko: { type: Boolean },
  critical: { type: Boolean, required: true },
  missed: { type: Boolean, required: true },
  effectiveness: { type: String, required: true },
  pokemonId: { type: String, required: true },
  trainerId: { type: String, required: true },
  onPokemonId: { type: String, required: true },
  onTrainerId: { type: String, required: true },
});

const DamageEvent = mongoose.model<IDamageEvent>(
  "DamageEvent",
  damageEventSchema,
);
export default DamageEvent;
