import { PokemonBaseModel } from './pokemonBase.model';
import { PokemonStatsModel } from './pokemonStats.model';

export interface PokemonModel {
  _id?: string;
  trainerId: string;
  nickname?: string;
  basePokemon: PokemonBaseModel;
  level: number;
  exp: number;
  expMax: number;
  attacks?: string[];
  stats?: PokemonStatsModel;
  ev?: PokemonStatsModel;
  iv?: PokemonStatsModel;
}
