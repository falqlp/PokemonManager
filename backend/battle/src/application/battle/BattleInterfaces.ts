import { IMove } from 'shared/models/move/mode-model';
import {
  Effectiveness,
  IBattleParticipationEvent,
  IDamageEvent,
  IPokemonBase,
  IPokemonStats,
} from 'shared/models';
import { MongoId } from 'shared/common';

export interface IBattlePokemon extends MongoId {
  dailyForm: number;
  currentHp: number;
  cumulatedSpeed: number;
  animation?: string;
  moving?: boolean;
  reload: number;
  stats: IPokemonStats;
  moves: IMove[];
  trainerId: string;
  strategy: number[];
  battleStrategy?: number[];
  level: number;
  basePokemon: IPokemonBase;
}

export enum BattleDamageInfo {
  RELOAD = 'RELOAD',
}
export interface IDamage {
  damage: number;
  critical: boolean;
  effectiveness: Effectiveness;
  missed: boolean;
  attPokemon: IBattlePokemon;
  defPokemon: IBattlePokemon;
  move: IMove;
  info?: BattleDamageInfo;
}

export interface IBattleTrainer {
  name: string;
  class: string;
  _id: string;
  pokemons: IBattlePokemon[];
  defeat: boolean;
}

export interface IBattleState {
  _id?: string;
  player: IBattleTrainer;
  opponent: IBattleTrainer;
  battleOrder: IBattlePokemon[];
  damage?: IDamage;
  damageEvents: IDamageEvent[];
  battleParticipationEvents: IBattleParticipationEvent[];
}
