import { Injectable } from '@nestjs/common';
import { IPokemon, PeriodModel } from 'shared/models';

export interface IDamageEventQuery {
  competitionId?: string;
  period?: PeriodModel;
  division?: number;
  trainerIds?: string[];
  pokemonIds?: string[];
}
export interface IStatsByPokemon {
  _id: string;
  value: number;
  pokemon?: IPokemon;
  trainer?: {
    name: string;
    class: string;
    _id: string;
    color: string;
  };
}

@Injectable()
export default class BattleEventQueriesUtilService {
  public getMatchStage(
    gameId: string,
    query?: IDamageEventQuery,
    on?: boolean,
  ): Record<string, unknown> {
    let matchStage: Record<string, unknown> = { gameId };
    if (query) {
      matchStage = this.matchStageBase(query, matchStage, on);
      if (query.pokemonIds) {
        if (on) {
          matchStage.onPokemonId = { $in: query.pokemonIds };
        } else {
          matchStage.pokemonId = { $in: query.pokemonIds };
        }
      }
    }
    return matchStage;
  }

  private matchStageBase(
    query: IDamageEventQuery,
    matchStage: Record<string, unknown>,
    on: boolean,
  ): Record<string, unknown> {
    if (query.competitionId) {
      matchStage.competitionId = query.competitionId;
    }
    if (query.trainerIds && query.trainerIds.length !== 0) {
      if (on) {
        matchStage.onTrainerId = { $in: query.trainerIds };
      } else {
        matchStage.trainerId = { $in: query.trainerIds };
      }
    }
    if (query.division) {
      matchStage.division = query.division;
    }
    if (query.period) {
      matchStage.date = {
        $gte: new Date(query.period.startDate),
        $lt: new Date(query.period.endDate),
      };
    }
    return matchStage;
  }

  public getMatchStageBattleParticipation(
    gameId: string,
    query?: IDamageEventQuery,
    on?: boolean,
  ): Record<string, unknown> {
    let matchStage: Record<string, unknown> = { gameId };
    if (query) {
      matchStage = this.matchStageBase(query, matchStage, on);
      if (query.pokemonIds) {
        if (on) {
          matchStage.onPokemonId = { $in: query.pokemonIds };
        } else {
          matchStage.pokemonIds = { $in: query.pokemonIds };
        }
      }
    }
    return matchStage;
  }
}
