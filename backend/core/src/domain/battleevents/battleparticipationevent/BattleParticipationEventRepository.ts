import CompleteRepository from 'shared/common/domain/CompleteRepository';
import BattleParticipationEvent, {
  IBattleParticipationEvent,
} from './BattleParticipationEvent';
import { Injectable } from '@nestjs/common';
import { EmptyPopulater } from 'shared/common/domain/EmptyPopulater';
import { Model, SortOrder } from 'mongoose';
import BattleEventQueriesUtilService, {
  IDamageEventQuery,
  IStatsByPokemon,
} from '../BattleEventQueriesUtilService';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export default class BattleParticipationEventRepository extends CompleteRepository<IBattleParticipationEvent> {
  constructor(
    populater: EmptyPopulater,
    private battleEventQueriesUtilService: BattleEventQueriesUtilService,
    @InjectModel(BattleParticipationEvent.modelName)
    protected override readonly schema: Model<IBattleParticipationEvent>,
  ) {
    super(schema, populater);
  }

  public getPaticipation(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    return this.schema
      .aggregate<IStatsByPokemon>()
      .match(this.battleEventQueriesUtilService.getMatchStage(gameId, query))
      .unwind('$pokemonIds')
      .group({
        _id: '$pokemonIds',
        value: { $sum: 1 },
      })
      .sort({ value: sort ?? -1 });
  }
}
