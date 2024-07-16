import CompleteRepository from "../../CompleteRepository";
import BattleParticipationEvent, {
  IBattleParticipationEvent,
} from "./BattleParticipationEvent";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../../EmptyPopulater";
import { SortOrder } from "mongoose";
import BattleEventQueriesUtilService, {
  IDamageEventQuery,
  IStatsByPokemon,
} from "../BattleEventQueriesUtilService";

@singleton()
export default class BattleParticipationEventRepository extends CompleteRepository<IBattleParticipationEvent> {
  constructor(
    populater: EmptyPopulater,
    private battleEventQueriesUtilService: BattleEventQueriesUtilService,
  ) {
    super(BattleParticipationEvent, populater);
  }

  public getPaticipation(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    return this.schema
      .aggregate<IStatsByPokemon>()
      .match(this.battleEventQueriesUtilService.getMatchStage(gameId, query))
      .unwind("$pokemonIds")
      .group({
        _id: "$pokemonIds",
        value: { $sum: 1 },
      })
      .sort({ value: sort ?? -1 });
  }
}
