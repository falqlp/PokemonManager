import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { AttackModel } from '../../models/attack.model';

export interface DecisionModel {
  pokemon: PokemonModel;
  attack: AttackModel;
}
