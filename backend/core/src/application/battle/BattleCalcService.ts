import { Effectiveness, IBattlePokemon, IDamage } from './BattleInterfaces';
import { Injectable } from '@nestjs/common';
import { IMove } from 'shared/models/move/mode-model';
import { IPokemon } from 'shared/models/pokemon/pokemon-models';

export const TYPE_EFFECTIVENESS: { [key: string]: { [key: string]: number } } =
  {
    NORMAL: { ROCK: 0.5, GHOST: 0, STEEL: 0.5 },
    FIRE: {
      FIRE: 0.5,
      WATER: 0.5,
      GRASS: 2,
      ICE: 2,
      BUG: 2,
      ROCK: 0.5,
      DRAGON: 0.5,
      STEEL: 2,
    },
    WATER: { FIRE: 2, WATER: 0.5, GRASS: 0.5, GROUND: 2, ROCK: 2, DRAGON: 0.5 },
    ELECTRIC: {
      WATER: 2,
      ELECTRIC: 0.5,
      GRASS: 0.5,
      GROUND: 0,
      FLYING: 2,
      DRAGON: 0.5,
    },
    GRASS: {
      FIRE: 0.5,
      WATER: 2,
      GRASS: 0.5,
      POISON: 0.5,
      GROUND: 2,
      FLYING: 0.5,
      BUG: 0.5,
      ROCK: 2,
      DRAGON: 0.5,
      STEEL: 0.5,
    },
    ICE: {
      FIRE: 0.5,
      WATER: 0.5,
      GRASS: 2,
      ICE: 0.5,
      GROUND: 2,
      FLYING: 2,
      DRAGON: 2,
      STEEL: 0.5,
    },
    FIGHTING: {
      NORMAL: 2,
      ICE: 2,
      POISON: 0.5,
      FLYING: 0.5,
      PSY: 0.5,
      BUG: 0.5,
      ROCK: 2,
      GHOST: 0,
      DARK: 2,
      STEEL: 2,
      FAIRY: 0.5,
    },
    POISON: {
      GRASS: 2,
      POISON: 0.5,
      GROUND: 0.5,
      ROCK: 0.5,
      GHOST: 0.5,
      STEEL: 0,
      FAIRY: 2,
    },
    GROUND: {
      FIRE: 2,
      ELECTRIC: 2,
      GRASS: 0.5,
      POISON: 2,
      FLYING: 0,
      BUG: 0.5,
      ROCK: 2,
      STEEL: 2,
    },
    FLYING: {
      ELECTRIC: 0.5,
      GRASS: 2,
      FIGHTING: 2,
      BUG: 2,
      ROCK: 0.5,
      STEEL: 0.5,
    },
    PSY: { FIGHTING: 2, POISON: 2, PSY: 0.5, DARK: 0, STEEL: 0.5 },
    BUG: {
      FIRE: 0.5,
      GRASS: 2,
      FIGHTING: 0.5,
      POISON: 0.5,
      FLYING: 0.5,
      PSY: 2,
      GHOST: 0.5,
      DARK: 2,
      STEEL: 0.5,
      FAIRY: 0.5,
    },
    ROCK: {
      FIRE: 2,
      ICE: 2,
      FIGHTING: 0.5,
      GROUND: 0.5,
      FLYING: 2,
      BUG: 2,
      STEEL: 0.5,
    },
    GHOST: { NORMAL: 0, PSY: 2, GHOST: 2, DARK: 0.5 },
    DRAGON: { DRAGON: 2, STEEL: 0.5, FAIRY: 0 },
    DARK: { FIGHTING: 0.5, PSY: 2, GHOST: 2, DARK: 0.5, FAIRY: 0.5 },
    STEEL: {
      FIRE: 0.5,
      WATER: 0.5,
      ELECTRIC: 0.5,
      ICE: 2,
      ROCK: 2,
      STEEL: 0.5,
      FAIRY: 2,
    },
    FAIRY: {
      FIRE: 0.5,
      FIGHTING: 2,
      POISON: 0.5,
      DRAGON: 2,
      DARK: 2,
      STEEL: 0.5,
    },
  };

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
    attPokemon: IPokemon,
    defPokemon: IPokemon,
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

  calcEffectiveness(move: IMove, defPokemon: IPokemon): number {
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

  stab(move: IMove, attPokemon: IPokemon): number {
    let modifier = 1;
    attPokemon.basePokemon.types.forEach((type) => {
      if (type === move.type) {
        modifier = STAB_MODIFIER;
      }
    });
    return modifier;
  }

  criticalHit(attPokemon: IPokemon): number {
    return this.criticalHitProbability()
      ? this.criticalHitDamage(attPokemon)
      : 1;
  }

  criticalHitDamage(attPokemon: IPokemon): number {
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

  estimator(attPokemon: IPokemon, defPokemon: IPokemon, move: IMove): number {
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
