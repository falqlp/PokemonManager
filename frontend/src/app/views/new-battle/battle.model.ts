import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { DamageModel } from '../../models/damage.model';
import { MoveModel } from '../../models/move.model';

export interface BattlePokemonModel extends PokemonModel {
  currentHp: number;
  dailyForm: number;
  moves: MoveModel[];
  animation?: string;
  moving: boolean;
}

export interface BattleTrainerModel {
  name: string;
  _id: string;
  class: string;
  pokemons: BattlePokemonModel[];
  defeat: boolean;
}

export interface NewBattleRoundModel {
  player: BattleTrainerModel;
  opponent: BattleTrainerModel;
  battleOrder: BattlePokemonModel[];
  damage: DamageModel;
}
