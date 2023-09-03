import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';
import { DamageModel } from '../../models/damage.model';

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

export interface BattleTrainerModel {
  name: string;
  _id: string;
  pokemons: PokemonModel[];
  selectedMove: MoveModel;
  damage: DamageModel;
  decision: DecisionModel;
  updateDecision: boolean;
  autorizations: TrainerAutorizationsModel;
  defeat: boolean;
}

export interface BattleTurnModel {
  trainer1: BattleTrainerModel;
  trainer2: BattleTrainerModel;
}
