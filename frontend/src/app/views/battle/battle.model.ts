import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';
import { DamageModel } from '../../models/damage.model';

export interface DecisionModel {
  pokemon: PokemonModel;
  move: MoveModel;
}

export interface TrainerAutorizationsModel {
  pokemonCooldown: number;
  moveCooldown: number;
  updateCooldown: number;
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
  onKo: boolean;
}

export interface BattleRoundModel {
  trainer1: BattleTrainerModel;
  trainer2: BattleTrainerModel;
}
