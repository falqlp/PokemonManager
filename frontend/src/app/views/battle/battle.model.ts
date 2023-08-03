import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';

export interface DecisionModel {
  pokemon: PokemonModel;
  move: MoveModel;
}

export interface TrainerAutorizationsModel {
  canChangePokemon: boolean;
  pokemonCooldown: number;
  canChangeMove: boolean;
  moveCooldown: number;
}
