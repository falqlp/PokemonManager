import mongoose, { Schema } from 'mongoose';
import { battleEventIdentifierSchema } from '../BattleEventIdentifier';
import { IBattleParticipationEvent } from 'shared/models';

const battleParticipationEventSchema = new Schema<IBattleParticipationEvent>({
  ...battleEventIdentifierSchema,
  pokemonIds: [{ type: String, required: true }],
  trainerId: { type: String, required: true },
});

const BattleParticipationEvent = mongoose.model<IBattleParticipationEvent>(
  'BattleParticipationEvent',
  battleParticipationEventSchema,
);
export default BattleParticipationEvent;
