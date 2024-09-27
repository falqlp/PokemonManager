import { PokemonBaseModel } from '../../../models/PokemonModels/pokemonBase.model';
import { MoveModel } from '../../../models/move.model';

export interface PokedexEvolutionModel {
  pokemon: PokemonBaseModel;
  evolutionMethod: string;
  minLevel?: number;
}

export interface PokedexMoveLearnedModel {
  move: MoveModel;
  levelLearnAt: number;
  learnMethod: string;
}
export interface PokedexDetailsModel {
  pokemonBase: PokemonBaseModel;
  evolutionOf: PokedexEvolutionModel[];
  evolutions: PokedexEvolutionModel[];
  movesLearned: PokedexMoveLearnedModel[];
}
