import { Injectable } from '@nestjs/common';
import { PeriodModel } from '../../models/PeriodModel';
import { IPokemon } from 'shared/models/pokemon/pokemon-models';

export interface IDamageEventQuery {
  competitionId?: string;
  period?: PeriodModel;
  division?: number;
  trainerIds?: string[];
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
    const matchStage: Record<string, unknown> = { gameId };
    if (query) {
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
          $gte: query.period.startDate,
          $lt: query.period.endDate,
        };
      }
    }
    return matchStage;
  }
}
