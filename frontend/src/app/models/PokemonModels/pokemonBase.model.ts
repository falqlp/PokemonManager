import type { PokemonStatsModel } from './pokemonStats.model';

export interface PokemonBaseModel {
  id: number;
  name: string;
  types: string[];
  baseStats: PokemonStatsModel;
}
