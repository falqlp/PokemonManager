import mongoose, { Schema } from "mongoose";
import {
  battleEventIdentifierSchema,
  IBattleEventIdentifier,
} from "../BattleEventIdentifier";

export interface IKoEvent extends IBattleEventIdentifier {
  koPokemonId: string;
  koTrainerId: string;
  attPokemonId: string;
  attTrainerId: string;
}

const koEventSchema = new Schema<IKoEvent>({
  ...battleEventIdentifierSchema,
  koPokemonId: { type: String, required: true },
  koTrainerId: { type: String, required: true },
  attPokemonId: { type: String, required: true },
  attTrainerId: { type: String, required: true },
});

const KoEvent = mongoose.model<IKoEvent>("KoEvent", koEventSchema);
export default KoEvent;
