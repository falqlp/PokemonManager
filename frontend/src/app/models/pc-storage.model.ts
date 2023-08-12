import { PokemonModel } from './PokemonModels/pokemon.model';

export interface StorageModel {
  position: number;
  pokemon?: PokemonModel;
}

export interface PcStorageModel {
  _id?: string;
  maxSize: number;
  storage: StorageModel[];
}

export interface StorageArrayModel {
  pokemon?: PokemonModel;
  disabled?: boolean;
  firstSelected?: boolean;
  secondSelected?: boolean;
}
