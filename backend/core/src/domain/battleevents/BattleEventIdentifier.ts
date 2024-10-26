import { MongoId } from "../MongoId";

export interface IBattleEventIdentifier extends MongoId {
  battleId?: string;
  competitionId?: string;
  date?: Date;
  gameId?: string;
  division?: number;
}
export const battleEventIdentifierSchema = {
  gameId: { type: String, required: true },
  date: { type: Date, required: true },
  battleId: { type: String, required: true },
  competitionId: { type: String, required: true },
  division: { type: Number, required: true },
};
