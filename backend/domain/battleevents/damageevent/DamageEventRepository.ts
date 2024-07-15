import CompleteRepository from "../../CompleteRepository";
import DamageEvent, { IDamageEvent } from "./DamageEvent";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../../EmptyPopulater";
import { PeriodModel } from "../../../models/PeriodModel";
import { SortOrder } from "mongoose";

export interface IDamageEventQuery {
  competitionId?: string;
  period?: PeriodModel;
  trainerId?: string;
}

@singleton()
export default class DamageEventRepository extends CompleteRepository<IDamageEvent> {
  constructor(populater: EmptyPopulater) {
    super(DamageEvent, populater);
  }

  private getMatchStage(gameId: string, query?: IDamageEventQuery): any {
    const matchStage: any = { gameId };

    if (query?.competitionId) {
      matchStage.competitionId = query.competitionId;
    }
    if (query?.trainerId) {
      matchStage.trainerId = query.trainerId;
    }
    if (query?.period) {
      matchStage.date = {
        $gte: query.period.startDate,
        $lt: query.period.endDate,
      };
    }
    return matchStage;
  }

  public getTotalDamageByPokemon(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<{ pokemonId: string; totalDamage: number }[]> {
    return this.schema
      .aggregate<{ pokemonId: string; totalDamage: number }>()
      .match(this.getMatchStage(gameId, query))
      .group({
        _id: "$pokemonId",
        totalDamage: { $sum: "$value" },
      })
      .sort({ totalDamage: sort ?? -1 });
  }

  public getTotalDamageReceivedByPokemon(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<{ _id: string; totalDamage: number }[]> {
    return this.schema
      .aggregate<{ _id: string; totalDamage: number }>()
      .match(this.getMatchStage(gameId, query))
      .group({
        _id: "$onPokemonId",
        totalDamage: { $sum: "$value" },
      })
      .sort({ totalDamage: sort ?? -1 });
  }

  public getTotalKoOtherPokemonByPokemon(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<{ _id: string; ko: number }[]> {
    return this.schema
      .aggregate<{ _id: string; ko: number }>()
      .match(this.getMatchStage(gameId, query))
      .group({
        _id: "$pokemonId",
        ko: {
          $sum: { $cond: { if: { $eq: ["$ko", true] }, then: 1, else: 0 } },
        },
      })
      .sort({ ko: sort ?? -1 });
  }

  public getTotalKoByPokemon(
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<{ _id: string; ko: number }[]> {
    return this.schema
      .aggregate<{ _id: string; ko: number }>()
      .match(this.getMatchStage(gameId, query))
      .group({
        _id: "$onPokemonId",
        ko: {
          $sum: { $cond: { if: { $eq: ["$ko", true] }, then: 1, else: 0 } },
        },
      })
      .sort({ ko: sort ?? -1 });
  }
}
