import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';

export interface PokedexDetailsModel {
  pokemonBase: PokemonBaseModel;
  evolutionOf: PokedexEvolutionModel[];
  evolutions: PokedexEvolutionModel[];
}

export interface PokedexEvolutionModel {
  pokemon: PokemonBaseModel;
  evolutionMethod: string;
  minLevel?: number;
}
