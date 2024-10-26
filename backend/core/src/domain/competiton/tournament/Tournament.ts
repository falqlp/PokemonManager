import mongoose, { Schema } from 'mongoose';
import { MongoId } from '../../MongoId';
import { IBattleSerie } from './battleSerie/BattleSerie';

export interface ITournamentStep {
  startDate: Date;
  endDate: Date;
  battleSeries: IBattleSerie[];
}

export interface ITournament extends MongoId {
  nbStep: number;
  tournamentSteps: ITournamentStep[];
  gameId: string;
  competitionId: string;
}
const TournamentStepSchema = new Schema<ITournamentStep>({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  battleSeries: [
    {
      type: Schema.Types.ObjectId,
      ref: 'BattleSerie',
    },
  ],
});

const tournamentSchema = new Schema<ITournament>({
  nbStep: { type: Number, required: true },
  tournamentSteps: [TournamentStepSchema],
  gameId: { type: String, required: true },
  competitionId: { type: String, required: true },
});

const Tournament = mongoose.model<ITournament>('Tournament', tournamentSchema);
export default Tournament;
