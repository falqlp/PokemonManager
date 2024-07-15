import { MongoId } from "../MongoId";

export interface IBattleEventIdentifier extends MongoId {
  battleId?: string;
  competitionId?: string;
  date?: Date;
}
export const battleEventIdentifierSchema = {
  date: { type: Date, required: true },
  battleId: { type: String, required: true },
  competitionId: { type: String, required: true },
};
