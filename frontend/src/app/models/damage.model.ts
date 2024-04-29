import { BattlePokemonModel } from '../views/new-battle/battle.model';
import { MoveModel } from './move.model';

export type Effectiveness =
  | 'IMMUNE'
  | 'NOT_VERY_EFFECTIVE'
  | 'EFFECTIVE'
  | 'SUPER_EFFECTIVE';

export interface DamageModel {
  damage: number;
  critical: boolean;
  effectiveness: Effectiveness;
  missed: boolean;
  attPokemon: BattlePokemonModel;
  defPokemon: BattlePokemonModel;
  move: MoveModel;
}
