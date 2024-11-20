import { IBattlePokemon, IDamage } from './BattleInterfaces';
import { Injectable } from '@nestjs/common';
import { IMove } from 'shared/models/move/mode-model';
import { Effectiveness } from 'shared/models';
import { TYPE_EFFECTIVENESS } from 'shared/models/pokemon/effectiveness.const';

export const STAB_MODIFIER = 1.5;
export const MIN_ROLL = 0.85;

@Injectable()
class BattleCalcService {
  calcDamage(
    attPokemon: IBattlePokemon,
    defPokemon: IBattlePokemon,
    move: IMove,
  ): IDamage {
    if (attPokemon.currentHp === 0 || move === undefined) {
      return;
    }
    const missed = this.isMissed(move);
    const effectiveness = this.calcEffectiveness(move, defPokemon);
    const criticalHit =
      effectiveness === 0 || missed ? 1 : this.criticalHit(attPokemon);
    return {
      damage:
        this.calcDamageBase(attPokemon, defPokemon, move) *
        effectiveness *
        this.stab(move, attPokemon) *
        criticalHit *
        this.roll() *
        (missed ? 0 : 1),
      effectiveness: this.getEffectiveness(effectiveness),
      critical: criticalHit !== 1 && !missed,
      missed,
      attPokemon,
      defPokemon,
      move,
    };
  }

  calcDamageBase(
    attPokemon: IBattlePokemon,
    defPokemon: IBattlePokemon,
    move: IMove,
  ): number {
    if (move.category === 'status' || move.power === 0) {
      return 0;
    }
    let pokemonAtt;
    let pokemonDef;
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

  calcEffectiveness(move: IMove, defPokemon: IBattlePokemon): number {
    let modifier = 1;
    defPokemon.basePokemon.types.forEach((type) => {
      if (TYPE_EFFECTIVENESS[move.type][type] !== undefined) {
        modifier *= TYPE_EFFECTIVENESS[move.type][type];
      }
    });
    return modifier;
  }

  getEffectiveness(effectiveness: number): Effectiveness {
    if (effectiveness === 0) {
      return 'IMMUNE';
    } else if (effectiveness < 1) {
      return 'NOT_VERY_EFFECTIVE';
    } else if (effectiveness > 1) {
      return 'SUPER_EFFECTIVE';
    }
    return 'EFFECTIVE';
  }

  stab(move: IMove, attPokemon: IBattlePokemon): number {
    let modifier = 1;
    attPokemon.basePokemon.types.forEach((type) => {
      if (type === move.type) {
        modifier = STAB_MODIFIER;
      }
    });
    return modifier;
  }

  criticalHit(attPokemon: IBattlePokemon): number {
    return this.criticalHitProbability()
      ? this.criticalHitDamage(attPokemon)
      : 1;
  }

  criticalHitDamage(attPokemon: IBattlePokemon): number {
    return (2 * attPokemon.level + 5) / (attPokemon.level + 5);
  }

  criticalHitProbability(): boolean {
    return Math.floor(Math.random() * 24) === 0;
  }

  roll(): number {
    return Math.random() * (1 - MIN_ROLL) + MIN_ROLL;
  }

  damageOnPokemon(pokemon: IBattlePokemon, damage: IDamage): number {
    if (!damage) {
      return pokemon.currentHp;
    }
    damage.damage = Math.min(
      pokemon.currentHp,
      Math.round(damage.damage * 10) / 10,
    );
    return Math.round((pokemon.currentHp - damage.damage) * 10) / 10;
  }

  isMissed(move: IMove): boolean {
    if (!move.accuracy) {
      return true;
    }
    return Math.random() > move.accuracy / 100;
  }

  estimator(
    attPokemon: IBattlePokemon,
    defPokemon: IBattlePokemon,
    move: IMove,
  ): number {
    if (!move) {
      return 0;
    }
    return (
      this.calcDamageBase(attPokemon, defPokemon, move) *
      this.calcEffectiveness(move, defPokemon) *
      this.stab(move, attPokemon) *
      (move.accuracy / 100)
    );
  }
}
export default BattleCalcService;
