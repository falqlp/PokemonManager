import { PokemonModel } from '../../../models/PokemonModels/pokemon.model';
import { DamageModel } from '../../../models/damage.model';
import { MoveModel, SideEffect } from '../../../models/move.model';

export interface BattlePokemonModel extends PokemonModel {
  currentHp: number;
  dailyForm: number;
  moves: MoveModel[];
  animation?: string;
  moving: boolean;
  reload: number;
}

export interface BattleTrainerModel {
  name: string;
  _id: string;
  class: string;
  pokemons: BattlePokemonModel[];
  defeat: boolean;
}

export interface BattleStateModel {
  player: BattleTrainerModel;
  opponent: BattleTrainerModel;
  battleOrder: BattlePokemonModel[];
  damage: DamageModel;
  _id?: string;
}
export type SideEffectLambda = (
  value: number,
  isPlayerMoving: boolean
) => string;
export const SIDE_EFFECT_LOG: Record<SideEffect, SideEffectLambda> = {
  [SideEffect.DRAIN]: (value: number): string => {
    return value > 0 ? 'DRAINED_ENERGY' : 'BACKLASH_INJURY';
  },
  [SideEffect.RELOAD]: (): string => {
    return undefined;
  },
};
