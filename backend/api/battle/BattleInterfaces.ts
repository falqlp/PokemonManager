import { IPokemon } from "../pokemon/Pokemon";
import { IAnimation, IMove } from "../move/Move";

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

export interface IDecision {
  pokemon: IPokemon;
  move: IMove;
}

export interface ITrainerAutorizations {
  pokemonCooldown: number;
  moveCooldown: number;
  updateCooldown: number;
}

export interface IBattleTrainer {
  name: string;
  _id: string;
  pokemons: IPokemon[];
  selectedMove: IMove;
  damage: IDamage;
  decision: IDecision;
  updateDecision: boolean;
  autorizations: ITrainerAutorizations;
  defeat: boolean;
  onKo: boolean;
  isAI: boolean;
}
