import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import { EmptyPopulater } from 'shared/common';
import { IBattleState } from '../application/battle/BattleInterfaces';
import BattleState from './BattleState';

@Injectable()
export default class BattleStateRepository extends CompleteRepository<IBattleState> {
  constructor(
    populater: EmptyPopulater,
    @InjectModel(BattleState.modelName)
    protected override readonly schema: Model<IBattleState>,
  ) {
    super(schema, populater);
  }

  public async set(
    id: string,
    battleState: IBattleState,
  ): Promise<IBattleState> {
    if (await this.schema.findById(id).exec()) {
      return this.update(id, battleState);
    }
    return this.create(battleState);
  }
}
