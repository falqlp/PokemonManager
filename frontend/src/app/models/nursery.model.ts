import { PokemonModel } from './PokemonModels/pokemon.model';

export interface TypeRepartitionModel {
  bug: number;
  dark: number;
  dragon: number;
  electric: number;
  fairy: number;
  fighting: number;
  fire: number;
  flying: number;
  ghost: number;
  grass: number;
  ground: number;
  ice: number;
  normal: number;
  poison: number;
  psy: number;
  rock: number;
  steel: number;
  water: number;
}

export interface WishListModel {
  typeRepartition: TypeRepartitionModel;
  quantity: number;
}

export type NurserySteps = 'WISHLIST' | 'FIRST_SELECTION' | 'LAST_SELECTION';

export interface NurseryModel {
  _id: string;
  gameId: string;
  level: number;
  wishList?: WishListModel;
  eggs?: PokemonModel[];
  step: NurserySteps;
}
