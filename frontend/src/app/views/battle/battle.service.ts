import { Injectable } from '@angular/core';
import type { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import type { AttackModel } from '../../models/attack.model';
import { MIN_ROLL, STAB_MODIFIER, TYPE_EFFECTIVENESS } from './battel.const';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public calcDamage(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    attack: AttackModel
  ): number {
    return (
      this.calcDamageBase(attPokemon, defPokemon, attack) *
      this.calcEfficiency(attack, defPokemon) *
      this.stab(attack, attPokemon) *
      this.roll()
    );
  }

  public calcDamageBase(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    attack: AttackModel
  ): number {
    if (attack.category === 'status' || attack.power === 0) {
      return 0;
    }
    let pokemonAtt: number;
    let pokemonDef: number;
    if (attack.category === 'physical') {
      pokemonAtt = attPokemon.stats.atk;
      pokemonDef = defPokemon.stats.def;
    } else if (attack.category === 'special') {
      pokemonAtt = attPokemon.stats.spAtk;
      pokemonDef = defPokemon.stats.spDef;
    }
    return (
      (attPokemon.level * 0.4 * pokemonAtt * attack.power) / pokemonDef / 50 + 2
    );
  }

  public calcEfficiency(attack: AttackModel, defPokemon: PokemonModel): number {
    let modifier = 1;
    defPokemon.basePokemon.types.forEach((type) => {
      if (
        TYPE_EFFECTIVENESS[attack.type] &&
        TYPE_EFFECTIVENESS[attack.type][type]
      ) {
        modifier *= TYPE_EFFECTIVENESS[attack.type][type];
      }
    });
    return modifier;
  }

  public stab(attack: AttackModel, attPokemon: PokemonModel): number {
    let modifier = 1;
    attPokemon.basePokemon.types.forEach((type) => {
      if (type === attack.type) {
        modifier = STAB_MODIFIER;
      }
    });
    return modifier;
  }

  public criticalHit(attPokemon: PokemonModel): number {
    return this.criticalHitProbability()
      ? this.criticalHitDamage(attPokemon)
      : 1;
  }

  public criticalHitDamage(attPokemon: PokemonModel): number {
    return (2 * attPokemon.level + 5) / (attPokemon.level + 5);
  }

  public criticalHitProbability(): boolean {
    return Math.floor(Math.random() * 24) === 0;
  }

  public roll(): number {
    return Math.random() * (1 - MIN_ROLL) + MIN_ROLL;
  }
}
