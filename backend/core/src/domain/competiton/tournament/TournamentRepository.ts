import { Injectable } from '@nestjs/common';
import Tournament, { ITournament } from './Tournament';
import TournamentPopulater from './TournamentPopulater';
import CompleteRepository from '../../CompleteRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export default class TournamentRepository extends CompleteRepository<ITournament> {
  constructor(
    protected tournamentPopulater: TournamentPopulater,
    @InjectModel(Tournament.modelName)
    protected override readonly schema: Model<ITournament>,
  ) {
    super(schema, tournamentPopulater);
  }

  public async getUpdateTournaments(
    targetDate: Date,
    gameId: string,
  ): Promise<ITournament[]> {
    const tournamentsAggregation = this.schema
      .aggregate<ITournament>()
      .match({
        tournamentSteps: { $exists: true, $ne: [] },
        gameId: gameId.toString(),
      })
      .addFields({
        lastStep: { $arrayElemAt: ['$tournamentSteps', -1] },
      })
      .match({ 'lastStep.endDate': targetDate });
    return this.schema.populate(
      await tournamentsAggregation.exec(),
      this.tournamentPopulater.populate(),
    );
  }
}
