import { IBattlePokemon, IDamage } from './BattleInterfaces';
import { SideEffect } from 'shared/models/move/mode-model';

type SideEffectLambda = (
  value: number,
  attPokemon: IBattlePokemon,
  defPokemon: IBattlePokemon,
  damage: IDamage,
) => void;

export default class BattleSideEffectService {
  public readonly SIDE_EFFECT_MAP: Record<SideEffect, SideEffectLambda> = {
    [SideEffect.DRAIN]: this.drain,
    [SideEffect.RELOAD]: this.reload,
  };

  private drain(
    value: number,
    attPokemon: IBattlePokemon,
    defPokemon: IBattlePokemon,
    damage: IDamage,
  ): void {
    const hpChange = (value / 100) * damage.damage;
    const newHp = Math.min(
      Math.max(attPokemon.currentHp + hpChange, 0),
      attPokemon.stats.hp,
    );
    attPokemon.currentHp = newHp;
  }

  private reload(value: number, attPokemon: IBattlePokemon): void {
    attPokemon.reload = value;
  }
}
