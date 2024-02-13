import type { PokemonStatsModel } from './pokemonStats.model';

export interface PokemonBaseModel {
  id: number;
  name: string;
  types: string[];
  baseStats: PokemonStatsModel;
  base?: boolean;
  mythical?: boolean;
  legendary?: boolean;
  _id?: string;
}
