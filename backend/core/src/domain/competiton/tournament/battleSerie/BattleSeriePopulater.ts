import Populater from 'shared/common/domain/Populater';
import { Model, PopulateOptions } from 'mongoose';
import { Injectable } from '@nestjs/common';
import TrainerPopulater from '../../../trainer/TrainerPopulater';
import { BattleInstancePopulater } from '../../../battleInstance/BattleInstancePopulater';
import { InjectModel } from '@nestjs/mongoose';
import BattleSerie, { IBattleSerie } from './BattleSerie';

@Injectable()
export default class BattleSeriePopulater extends Populater<IBattleSerie> {
  constructor(
    protected trainerPopulater: TrainerPopulater,
    protected battleInstancePopulater: BattleInstancePopulater,
    @InjectModel(BattleSerie.modelName)
    public readonly schema: Model<IBattleSerie>,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: 'battles',
        model: this.battleInstancePopulater.schema,
        populate: this.battleInstancePopulater.populate(),
      },
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
    ];
  }
}
