import type { PokemonBaseModel } from './pokemonBase.model';
import type { PokemonStatsModel } from './pokemonStats.model';
import { MoveModel } from '../move.model';

export interface PokemonModel {
  _id?: string;
  trainerId: string;
  nickname?: string;
  basePokemon: PokemonBaseModel;
  level: number;
  exp: number;
  moves?: MoveModel[];
  stats: PokemonStatsModel;
  ev?: PokemonStatsModel;
  iv?: PokemonStatsModel;
  shiny: boolean;
  currentHp?: number;
  maxLevel: number;
  hiddenPotential: string;
  hatchingDate?: Date;
  age: number;
  birthday: Date;
}
