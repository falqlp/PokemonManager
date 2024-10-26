import Populater from '../Populater';
import { Model, PopulateOptions } from 'mongoose';
import TrainerPopulater from '../trainer/TrainerPopulater';
import { Injectable } from '@nestjs/common';
import Competition, { ICompetition } from '../competiton/Competition';
import { InjectModel } from '@nestjs/mongoose';
import Battle, { IBattleInstance } from './Battle';

@Injectable()
export class BattleInstancePopulater extends Populater<IBattleInstance> {
  constructor(
    protected trainerPopulater: TrainerPopulater,
    @InjectModel(Battle.modelName)
    public readonly schema: Model<IBattleInstance>,
    @InjectModel(Competition.modelName)
    private readonly competition: Model<ICompetition>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: 'player',
        model: this.trainerPopulater.schema,
        populate: this.trainerPopulater.populate(),
      },
      {
        path: 'opponent',
        model: this.trainerPopulater.schema,
        populate: this.trainerPopulater.populate(),
      },
      {
        path: 'competition',
        model: this.competition,
      },
    ];
  }
}
