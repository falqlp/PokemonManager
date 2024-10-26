import { IPokemonBase } from '../../domain/pokemon/pokemonBase/PokemonBase';
import { IMove } from '../../domain/move/Move';

export interface IPokedexEvolution {
  pokemon: IPokemonBase;
  evolutionMethod: string;
  minLevel?: number;
}
export interface IPokedexMoveLearned {
  move: IMove;
  levelLearnAt: number;
  learnMethod: string;
}

export interface IPokedex {
  evolutions: IPokedexEvolution[];
  evolutionOf: IPokedexEvolution[];
  pokemonBase: IPokemonBase;
  movesLearned: IPokedexMoveLearned[];
}
