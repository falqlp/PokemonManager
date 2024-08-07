import { singleton } from "tsyringe";
import { PeriodModel } from "../../models/PeriodModel";
import { IPokemon } from "../pokemon/Pokemon";

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

@singleton()
export default class BattleEventQueriesUtilService {
  getMatchStage(gameId: string, query?: IDamageEventQuery): any {
    const matchStage: any = { gameId };

    if (query?.competitionId) {
      matchStage.competitionId = query.competitionId;
    }
    if (query?.trainerIds.length !== 0) {
      matchStage.trainerId = { $in: query.trainerIds };
    }
    if (query?.division) {
      matchStage.division = query.division;
    }
    if (query?.period) {
      matchStage.date = {
        $gte: query.period.startDate,
        $lt: query.period.endDate,
      };
    }
    return matchStage;
  }
}
