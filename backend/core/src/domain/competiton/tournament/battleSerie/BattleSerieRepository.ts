import { Injectable } from '@nestjs/common';
import BattleSerie, { IBattleSerie } from './BattleSerie';
import BattleSeriePopulater from './BattleSeriePopulater';
import CompleteRepository from '../../../CompleteRepository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export default class BattleSerieRepository extends CompleteRepository<IBattleSerie> {
  constructor(
    battleSeriePopulater: BattleSeriePopulater,
    @InjectModel(BattleSerie.modelName)
    protected override readonly schema: Model<IBattleSerie>,
  ) {
    super(schema, battleSeriePopulater);
  }
}
