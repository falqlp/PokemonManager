import { IPokemonBase } from "../pokemonBase/pokemonBase";
import { IMove } from "../move/move";

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
