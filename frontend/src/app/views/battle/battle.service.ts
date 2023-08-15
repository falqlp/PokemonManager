import { Injectable } from '@angular/core';
import type { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import type { MoveModel } from '../../models/move.model';
import { MIN_ROLL, STAB_MODIFIER, TYPE_EFFECTIVENESS } from './battel.const';
import type { DamageModel, Effectiveness } from '../../models/damage.model';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public calcDamage(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    move: MoveModel
  ): DamageModel {
    const missed = this.moveOnTarget(move);
    const effectivness = this.calcEffectivness(move, defPokemon);
    const criticalHit =
      effectivness === 0 || missed ? 1 : this.criticalHit(attPokemon);
    return {
      damage:
        this.calcDamageBase(attPokemon, defPokemon, move) *
        effectivness *
        this.stab(move, attPokemon) *
        criticalHit *
        this.roll() *
        (missed ? 0 : 1),
      effectivness: this.getEffectiveness(effectivness),
      critical: criticalHit !== 1 && !missed,
      missed,
    };
  }

  public calcDamageBase(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    move: MoveModel
  ): number {
    if (move.category === 'status' || move.power === 0) {
      return 0;
    }
    let pokemonAtt: number;
    let pokemonDef: number;
    if (move.category === 'physical') {
      pokemonAtt = attPokemon.stats['atk'];
      pokemonDef = defPokemon.stats['def'];
    } else if (move.category === 'special') {
      pokemonAtt = attPokemon.stats['spAtk'];
      pokemonDef = defPokemon.stats['spDef'];
    }
    return (
      (attPokemon.level * 0.4 * pokemonAtt * move.power) / pokemonDef / 50 + 2
    );
  }

  public calcEffectivness(move: MoveModel, defPokemon: PokemonModel): number {
    let modifier = 1;
    defPokemon.basePokemon.types.forEach((type) => {
      if (TYPE_EFFECTIVENESS[move.type][type] !== undefined) {
        modifier *= TYPE_EFFECTIVENESS[move.type][type];
      }
    });
    return modifier;
  }

  public getEffectiveness(effectivness: number): Effectiveness {
    if (effectivness === 0) {
      return 'IMMUNE';
    } else if (effectivness < 1) {
      return 'NOT_VERY_EFFECTIVE';
    } else if (effectivness > 1) {
      return 'SUPER_EFFECTIVE';
    }
    return 'EFFECTIVE';
  }

  public stab(move: MoveModel, attPokemon: PokemonModel): number {
    let modifier = 1;
    attPokemon.basePokemon.types.forEach((type) => {
      if (type === move.type) {
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

  public damageOnPokemon(
    pokemon: PokemonModel,
    damage: DamageModel
  ): PokemonModel {
    pokemon.currentHp = Math.max(
      0,
      Math.round((pokemon.currentHp - damage.damage / 5) * 10) / 10
    );
    return pokemon;
  }

  public moveOnTarget(move: MoveModel): boolean {
    return Math.random() > move.accuracy / 100;
  }

  public estimator(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    move: MoveModel
  ): number {
    return (
      this.calcDamageBase(attPokemon, defPokemon, move) *
      this.calcEffectivness(move, defPokemon) *
      this.stab(move, attPokemon) *
      (move.accuracy / 100)
    );
  }

  public getCooldownMs(pokemon: PokemonModel): number {
    return 6 + 200 / Math.sqrt(pokemon.stats['spe']);
  }
}
