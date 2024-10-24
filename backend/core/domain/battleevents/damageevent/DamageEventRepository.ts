import CompleteRepository from "../../CompleteRepository";
import DamageEvent, { IDamageEvent } from "./DamageEvent";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../../EmptyPopulater";
import { SortOrder } from "mongoose";
import BattleEventQueriesUtilService, {
  IDamageEventQuery,
  IStatsByPokemon,
} from "../BattleEventQueriesUtilService";

@singleton()
export default class DamageEventRepository extends CompleteRepository<IDamageEvent> {
  constructor(
    populater: EmptyPopulater,
    private battleEventQueriesUtilService: BattleEventQueriesUtilService,
  ) {
    super(DamageEvent, populater);
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
        _id: "$pokemonId",
        value: { $sum: "$value" },
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
        _id: "$onPokemonId",
        value: { $sum: "$value" },
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
        _id: "$pokemonId",
        value: {
          $sum: { $cond: { if: { $eq: ["$ko", true] }, then: 1, else: 0 } },
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
        _id: "$onPokemonId",
        value: {
          $sum: { $cond: { if: { $eq: ["$ko", true] }, then: 1, else: 0 } },
        },
      })
      .sort({ value: sort ?? -1 });
  }
}
