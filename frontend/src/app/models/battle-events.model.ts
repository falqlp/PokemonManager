import { PokemonModel } from './PokemonModels/pokemon.model';

export enum BattleEventQueryType {
  TOTAL_DAMAGE = 'TOTAL_DAMAGE',
  TOTAL_DAMAGE_RECEIVED = 'TOTAL_DAMAGE_RECEIVED',
  TOTAL_KO = 'TOTAL_KO',
  TOTAL_KO_RECEIVED = 'TOTAL_KO_RECEIVED',
  BATTLE_PARTICIPATION = 'BATTLE_PARTICIPATION',
}

export interface PeriodModel {
  startDate: Date;
  endDate: Date;
}

export interface DamageEventQueryModel {
  competitionId?: string;
  period?: PeriodModel;
  trainerId?: string;
}

export type SortOrder = -1 | 1;

export interface StatsByPokemonModel {
  _id: string;
  value: number;
  pokemon?: PokemonModel;
  trainer?: {
    name: string;
    class: string;
    _id: string;
    color: string;
  };
}
