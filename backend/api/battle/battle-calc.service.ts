import { IPokemon } from "../pokemon/pokemon";
import { IMove } from "../move/move";
import { Effectiveness, IDamage } from "./battle-interfaces";

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
      PSYCHIC: 0.5,
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
    PSYCHIC: { FIGHTING: 2, POISON: 2, PSYCHIC: 0.5, DARK: 0, STEEL: 0.5 },
    BUG: {
      FIRE: 0.5,
      GRASS: 2,
      FIGHTING: 0.5,
      POISON: 0.5,
      FLYING: 0.5,
      PSYCHIC: 2,
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
    GHOST: { NORMAL: 0, PSYCHIC: 2, GHOST: 2, DARK: 0.5 },
    DRAGON: { DRAGON: 2, STEEL: 0.5, FAIRY: 0 },
    DARK: { FIGHTING: 0.5, PSYCHIC: 2, GHOST: 2, DARK: 0.5, FAIRY: 0.5 },
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

const STAB_MODIFIER = 1.5;
const MIN_ROLL = 0.85;
const TURN_TIME_MS = 500;

const BattleCalcService = {
  moveDamage(attPokemon: IPokemon, defPokemon: IPokemon, move: IMove) {
    const damage = this.calcDamage(attPokemon, defPokemon, move);
    const damagedPokemon = this.damageOnPokemon(defPokemon, damage);
    return { damage, damagedPokemon };
  },

  calcDamage(attPokemon: IPokemon, defPokemon: IPokemon, move: IMove) {
    if (attPokemon.currentHp === 0 || move === undefined) {
      return;
    }
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
  },

  calcDamageBase(attPokemon: IPokemon, defPokemon: IPokemon, move: IMove) {
    if (move.category === "status" || move.power === 0) {
      return 0;
    }
    let pokemonAtt;
    let pokemonDef;
    if (move.category === "physical") {
      pokemonAtt = attPokemon.stats["atk"];
      pokemonDef = defPokemon.stats["def"];
    } else if (move.category === "special") {
      pokemonAtt = attPokemon.stats["spAtk"];
      pokemonDef = defPokemon.stats["spDef"];
    }
    return (
      (attPokemon.level * 0.4 * pokemonAtt * move.power) / pokemonDef / 50 + 2
    );
  },

  calcEffectivness(move: IMove, defPokemon: IPokemon) {
    let modifier = 1;
    defPokemon.basePokemon.types.forEach((type) => {
      if (TYPE_EFFECTIVENESS[move.type][type] !== undefined) {
        modifier *= TYPE_EFFECTIVENESS[move.type][type];
      }
    });
    return modifier;
  },

  getEffectiveness(effectivness: number): Effectiveness {
    if (effectivness === 0) {
      return "IMMUNE";
    } else if (effectivness < 1) {
      return "NOT_VERY_EFFECTIVE";
    } else if (effectivness > 1) {
      return "SUPER_EFFECTIVE";
    }
    return "EFFECTIVE";
  },

  stab(move: IMove, attPokemon: IPokemon) {
    let modifier = 1;
    attPokemon.basePokemon.types.forEach((type) => {
      if (type === move.type) {
        modifier = STAB_MODIFIER;
      }
    });
    return modifier;
  },

  criticalHit(attPokemon: IPokemon) {
    return this.criticalHitProbability()
      ? this.criticalHitDamage(attPokemon)
      : 1;
  },

  criticalHitDamage(attPokemon: IPokemon) {
    return (2 * attPokemon.level + 5) / (attPokemon.level + 5);
  },

  criticalHitProbability() {
    return Math.floor(Math.random() * 24) === 0;
  },

  roll() {
    return Math.random() * (1 - MIN_ROLL) + MIN_ROLL;
  },

  damageOnPokemon(pokemon: IPokemon, damage: IDamage) {
    pokemon.currentHp = Math.max(
      0,
      Math.round((pokemon.currentHp - (damage ? damage.damage : 0) / 10) * 10) /
        10
    );
    return pokemon;
  },

  moveOnTarget(move: IMove) {
    return Math.random() > move.accuracy / 100;
  },

  estimator(attPokemon: IPokemon, defPokemon: IPokemon, move: IMove) {
    if (!move) {
      return 0;
    }
    return (
      this.calcDamageBase(attPokemon, defPokemon, move) *
      this.calcEffectivness(move, defPokemon) *
      this.stab(move, attPokemon) *
      (move.accuracy / 100)
    );
  },
  getCooldownMs(pokemon: IPokemon) {
    return 6 + 200 / Math.sqrt(pokemon.stats["spe"]);
  },
  getCooldownTurn(pokemon: IPokemon) {
    return Math.ceil((this.getCooldownMs(pokemon) * 100) / TURN_TIME_MS);
  },
};
export default BattleCalcService;
