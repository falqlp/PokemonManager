import Battle, { IBattleInstance } from './Battle';
import CompleteRepository from '../CompleteRepository';
import { Injectable } from '@nestjs/common';
import { BattleInstancePopulater } from './BattleInstancePopulater';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
class BattleInstanceRepository extends CompleteRepository<IBattleInstance> {
  constructor(
    populater: BattleInstancePopulater,
    @InjectModel(Battle.modelName)
    protected override readonly schema: Model<IBattleInstance>,
  ) {
    super(schema, populater);
  }

  public insertManyWithoutMapAndPopulate(
    dtos: IBattleInstance[],
  ): Promise<IBattleInstance[]> {
    return this.schema.insertMany(dtos);
  }
}

export default BattleInstanceRepository;
