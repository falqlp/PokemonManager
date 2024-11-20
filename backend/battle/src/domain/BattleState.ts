import { IBattleState } from '../application/battle/BattleInterfaces';
import mongoose, { Schema } from 'mongoose';

const battleStateSchema = new Schema<IBattleState>({
  _id: { type: String, required: true },
  opponent: { type: Schema.Types.Mixed, required: true },
  player: { type: Schema.Types.Mixed, required: true },
  battleOrder: [{ type: Schema.Types.Mixed, required: true }],
  damageEvents: [{ type: Schema.Types.Mixed, required: true }],
  battleParticipationEvents: [{ type: Schema.Types.Mixed, required: true }],
  damage: { type: Schema.Types.Mixed },
});

const BattleState = mongoose.model<IBattleState>(
  'BattleState',
  battleStateSchema,
);
export default BattleState;
