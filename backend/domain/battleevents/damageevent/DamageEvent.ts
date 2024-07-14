import mongoose, { Schema } from "mongoose";
import {
  battleEventIdentifierSchema,
  IBattleEventIdentifier,
} from "../BattleEventIdentifier";

export interface IDamageEvent extends IBattleEventIdentifier {
  pokemonId: string;
  trainerId: string;
  value: number;
  onPokemonId: string;
  onTrainerId: string;
}

const damageEventSchema = new Schema<IDamageEvent>({
  ...battleEventIdentifierSchema,
  value: { type: Number, required: true },
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
