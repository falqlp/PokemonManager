import BattleParticipationEvent from './BattleParticipationEvent';
import { Injectable } from '@nestjs/common';
import { Model, RootFilterQuery, SortOrder } from 'mongoose';
import BattleEventQueriesUtilService, {
  IDamageEventQuery,
  IStatsByPokemon,
} from '../battle-event-queries-util.service';
import { InjectModel } from '@nestjs/mongoose';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import { EmptyPopulater } from 'shared/common';
import { IBattleParticipationEvent } from 'shared/models';

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
      .match(
        this.battleEventQueriesUtilService.getMatchStageBattleParticipation(
          gameId,
          query,
        ),
      )
      .unwind('$pokemonIds')
      .group({
        _id: '$pokemonIds',
        value: { $sum: 1 },
      })
      .sort({ value: sort ?? -1 });
  }

  public async deleteMany(
    filter: RootFilterQuery<IBattleParticipationEvent>,
  ): Promise<void> {
    await this.schema.deleteMany(filter);
  }
}
