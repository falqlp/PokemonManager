import { PokemonModel } from '../PokemonModels/pokemon.model';

export class TrainerModel {
  _id?: string;
  name: string;
  pokemons?: PokemonModel[];
  pcStorage?: string;
  nursery: string;
  berries: number;
  money: number;
}
