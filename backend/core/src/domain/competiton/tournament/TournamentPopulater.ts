import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import BattleSeriePopulater from './battleSerie/BattleSeriePopulater';
import { InjectModel } from '@nestjs/mongoose';
import Tournament, { ITournament } from './Tournament';

@Injectable()
export default class TournamentPopulater extends Populater<ITournament> {
  constructor(
    protected battleSeriePopulater: BattleSeriePopulater,
    @InjectModel(Tournament.modelName)
    public readonly schema: Model<ITournament>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: 'tournamentSteps',
      populate: {
        path: 'battleSeries',
        model: this.battleSeriePopulater.schema,
        populate: this.battleSeriePopulater.populate(),
      },
    };
  }
}
