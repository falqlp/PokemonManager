import { IPokemon } from 'shared/models/pokemon/pokemon-models';
import { IMove } from 'shared/models/move/mode-model';
import { Effectiveness } from 'shared/models';

export interface IBattlePokemon extends IPokemon {
  dailyForm: number;
  currentHp: number;
  cumulatedSpeed: number;
  animation: string;
  moving: boolean;
  reload: number;
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
  isAI: boolean;
}

export interface IBattleState {
  _id?: string;
  player: IBattleTrainer;
  opponent: IBattleTrainer;
  battleOrder: IBattlePokemon[];
  damage?: IDamage;
}
