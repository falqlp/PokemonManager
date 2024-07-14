import mongoose, { Schema } from "mongoose";
import { MongoId } from "../MongoId";

export interface IDamageEvent extends MongoId {
  battleId: string;
  pokemonId: string;
  value: number;
  onPokemonId: string;
  date: Date;
}

const damageEventSchema = new Schema<IDamageEvent>({
  date: { type: Date, required: true },
  battleId: { type: String, required: true },
  onPokemonId: { type: String, required: true },
  value: { type: Number, required: true },
  pokemonId: { type: String, required: true },
});

const DamageEvent = mongoose.model<IDamageEvent>(
  "DamageEvent",
  damageEventSchema,
);
export default DamageEvent;
