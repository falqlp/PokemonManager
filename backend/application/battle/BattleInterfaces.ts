import { IPokemon } from "../../domain/pokemon/Pokemon";
import { IAnimation, IMove } from "../../domain/move/Move";

export type Effectiveness =
  | "IMMUNE"
  | "NOT_VERY_EFFECTIVE"
  | "EFFECTIVE"
  | "SUPER_EFFECTIVE";

export interface IDamage {
  damage: number;
  critical: boolean;
  effectiveness: Effectiveness;
  missed: boolean;
  animation: IAnimation;
}

export interface ITrainerAutorizations {
  pokemonCooldown: number;
  moveCooldown: number;
  updateCooldown: number;
}

export interface IBattleMove extends IMove {
  used: boolean;
}
export interface IBattlePokemon extends IPokemon {
  moves: IBattleMove[];
  dailyForm: number;
  currentHp: number;
}

export interface IDecision {
  pokemon: IBattlePokemon;
  move: IBattleMove;
}

export interface IBattleTrainer {
  name: string;
  class: string;
  _id: string;
  pokemons: IBattlePokemon[];
  selectedMove: IBattleMove;
  damage: IDamage;
  decision: IDecision;
  updateDecision: boolean;
  autorizations: ITrainerAutorizations;
  defeat: boolean;
  onKo: boolean;
  isAI: boolean;
}
