import { Injectable } from '@nestjs/common';
import { Model, RootFilterQuery, SortOrder } from 'mongoose';
import BattleEventQueriesUtilService, {
  IDamageEventQuery,
  IStatsByPokemon,
} from '../battle-event-queries-util.service';
import { InjectModel } from '@nestjs/mongoose';
import CompleteRepository from 'shared/common/domain/CompleteRepository';
import { EmptyPopulater } from 'shared/common';
import { IDamageEvent } from 'shared/models';
import DamageEvent from './DamageEvent';

@Injectable()
export default class DamageEventRepository extends CompleteRepository<IDamageEvent> {
  constructor(
    populater: EmptyPopulater,
    private battleEventQueriesUtilService: BattleEventQueriesUtilService,
    @InjectModel(DamageEvent.modelName)
    protected override readonly schema: Model<IDamageEvent>,
  ) {
    super(schema, populater);
  }

  public getTotalDamage(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    return this.schema
      .aggregate<IStatsByPokemon>()
      .match(this.battleEventQueriesUtilService.getMatchStage(gameId, query))
      .group({
        _id: '$pokemonId',
        value: { $sum: '$value' },
      })
      .sort({ value: sort ?? -1 });
  }

  public getTotalDamageReceived(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    return this.schema
      .aggregate<IStatsByPokemon>()
      .match(
        this.battleEventQueriesUtilService.getMatchStage(gameId, query, true),
      )
      .group({
        _id: '$onPokemonId',
        value: { $sum: '$value' },
      })
      .sort({ value: sort ?? -1 });
  }

  public getTotalKo(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    return this.schema
      .aggregate<IStatsByPokemon>()
      .match(this.battleEventQueriesUtilService.getMatchStage(gameId, query))
      .group({
        _id: '$pokemonId',
        value: {
          $sum: { $cond: { if: { $eq: ['$ko', true] }, then: 1, else: 0 } },
        },
      })
      .sort({ value: sort ?? -1 });
  }

  public getTotalKoReceived(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    return this.schema
      .aggregate<IStatsByPokemon>()
      .match(
        this.battleEventQueriesUtilService.getMatchStage(gameId, query, true),
      )
      .group({
        _id: '$onPokemonId',
        value: {
          $sum: { $cond: { if: { $eq: ['$ko', true] }, then: 1, else: 0 } },
        },
      })
      .sort({ value: sort ?? -1 });
  }

  public async deleteMany(
    filter: RootFilterQuery<IDamageEvent>,
  ): Promise<void> {
    await this.schema.deleteMany(filter);
  }
}
