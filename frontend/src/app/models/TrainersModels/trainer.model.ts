import { PokemonModel } from '../PokemonModels/pokemon.model';
import { CompetitionModel } from '../competition.model';

export class TrainerModel {
  _id?: string;
  name: string;
  class: string;
  pokemons?: PokemonModel[];
  competitions?: CompetitionModel[];
  pcStorage?: string;
  nursery: string;
  berries: number;
  money: number;
}
