export const battleEventIdentifierSchema = {
  gameId: { type: String, required: true },
  date: { type: Date, required: true },
  battleId: { type: String, required: true },
  competitionId: { type: String, required: true },
  division: { type: Number, required: true },
};
