import { IPokemonBase } from "../pokemonBase/PokemonBase";
import { IMove } from "../move/Move";

export interface IPokedex {
  evolutions: IPokedexEvolution[];
  evolutionOf: IPokedexEvolution[];
  pokemonBase: IPokemonBase;
  movesLearned: IPokedexMoveLearned[];
}
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
