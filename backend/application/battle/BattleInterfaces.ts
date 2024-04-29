import { IPokemon } from "../../domain/pokemon/Pokemon";
import { IMove } from "../../domain/move/Move";

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
  attPokemon: IBattlePokemon;
  defPokemon: IBattlePokemon;
  move: IMove;
}
export interface IBattlePokemon extends IPokemon {
  moves: IMove[];
  dailyForm: number;
  currentHp: number;
  cumulatedSpeed: number;
  animation: string;
  moving: boolean;
}

export interface IBattleTrainer {
  name: string;
  class: string;
  _id: string;
  pokemons: IBattlePokemon[];
  defeat: boolean;
  isAI: boolean;
}
