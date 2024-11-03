import { IPokemonBase } from 'shared/models/pokemon/pokemon-models';
import { IMove } from 'shared/models/move/mode-model';

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
