import { IPokemonBase } from "../pokemonBase/pokemonBase";

export interface IPokedex {
  evolutions: IPokedexEvolution[];
  evolutionOf: IPokedexEvolution[];
  pokemonBase: IPokemonBase;
}
export interface IPokedexEvolution {
  pokemon: IPokemonBase;
  evolutionMethod: string;
  minLevel?: number;
}
