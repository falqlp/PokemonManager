import { MongoId } from 'shared/common';

export type Effectiveness =
  | 'IMMUNE'
  | 'NOT_VERY_EFFECTIVE'
  | 'EFFECTIVE'
  | 'SUPER_EFFECTIVE';

export interface IBattleEventIdentifier extends MongoId {
  battleId?: string;
  competitionId?: string;
  date?: Date;
  gameId?: string;
  division?: number;
}

export interface IBattleParticipationEvent extends IBattleEventIdentifier {
  pokemonIds: string[];
  trainerId: string;
}

export interface IDamageEvent extends IBattleEventIdentifier {
  value: number;
  ko?: boolean;
  critical: boolean;
  effectiveness: Effectiveness;
  missed: boolean;
  moveId: string;
  pokemonId: string;
  trainerId: string;
  onPokemonId: string;
  onTrainerId: string;
}
