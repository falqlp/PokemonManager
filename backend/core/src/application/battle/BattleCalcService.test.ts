import { MoveTestMother } from 'shared/models/test/domain/Move/MoveTestMother';
import BattleCalcService, {
  MIN_ROLL,
  STAB_MODIFIER,
  TYPE_EFFECTIVENESS,
} from './BattleCalcService';
import { container } from 'tsyringe';
import { PokemonTestMother } from 'shared/models/test/domain/pokemon/PokemonTestMother';
import { IBattlePokemon, IDamage } from './BattleInterfaces';
import BattlePokemonTestMother from '../../test/domain/battle/BattlePokemonTestMother';
import { Test, TestingModule } from '@nestjs/testing';
import { IMove, IPokemon } from 'shared/models';

describe('BattleCalcService', () => {
  let serviceUnderTesting: BattleCalcService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleCalcService],
    }).compile();
    serviceUnderTesting = module.get(BattleCalcService);
  });

  describe('roll method', () => {
    // Test: check return type of roll method
    it('returns a number', () => {
      expect(typeof serviceUnderTesting.roll()).toBe('number');
    });

    // Test: check if roll method returns a number between MIN_ROLL and 1
    it('returns a number between MIN_ROLL and 1', () => {
      const result = serviceUnderTesting.roll();
      expect(result).toBeGreaterThanOrEqual(MIN_ROLL);
      expect(result).toBeLessThanOrEqual(1);
    });

    // Test: check if roll method produces random results
    it('produces random results', () => {
      const roll1 = serviceUnderTesting.roll();
      const roll2 = serviceUnderTesting.roll();
      const roll3 = serviceUnderTesting.roll();
      expect(roll1).not.toBe(roll2);
      expect(roll1).not.toBe(roll3);
      expect(roll2).not.toBe(roll3);
    });
  });
  describe('moveOnTarget method', () => {
    it('should return true when there is no accuracy', () => {
      const move: IMove = MoveTestMother.withCustomOptions({ accuracy: null });
      expect(serviceUnderTesting.isMissed(move)).toBe(true);
    });
    it('should return a boolean value when accuracy is defined', () => {
      const move: IMove = MoveTestMother.basicMove();
      expect(typeof serviceUnderTesting.isMissed(move)).toBe('boolean');
    });
  });
  describe('criticalHitProbability method', () => {
    // Test: check return type of criticalHitProbability method
    it('returns a boolean', () => {
      expect(typeof serviceUnderTesting.criticalHitProbability()).toBe(
        'boolean',
      );
    });

    // Test: check distribution of returned probability
    it('returns a probability with roughly 1 in 24 chance of being true', () => {
      const trials = 10000;
      let trueCount = 0;
      for (let i = 0; i < trials; i++) {
        if (serviceUnderTesting.criticalHitProbability()) {
          trueCount += 1;
        }
      }
      // probability should be ~4.17%
      const empiricalProbability = trueCount / trials;
      expect(empiricalProbability).toBeGreaterThanOrEqual(0.03); // allowing for some variation
      expect(empiricalProbability).toBeLessThanOrEqual(0.05); // allowing for some variation
    });
  });
  describe('criticalHitDamage method', () => {
    it('should return proper critical hit damage calculation', () => {
      const pokemon: IPokemon = PokemonTestMother.withCustomOptions({
        level: 20,
      });

      const result = serviceUnderTesting.criticalHitDamage(pokemon);
      const expected = (2 * pokemon.level + 5) / (pokemon.level + 5);

      expect(result).toBe(expected);
    });

    it('should return a number', () => {
      const pokemon: IPokemon = PokemonTestMother.withCustomOptions({
        level: 20,
      });

      const result = serviceUnderTesting.criticalHitDamage(pokemon);

      expect(typeof result).toBe('number');
    });
  });
  describe('criticalHit method', () => {
    const pokemon: IPokemon = PokemonTestMother.generateBulbasaur();
    it('returns a number', () => {
      expect(typeof serviceUnderTesting.criticalHit(pokemon)).toBe('number');
    });
    it('returns a number between 1 and the output of criticalHitDamage method', () => {
      const criticalHit = serviceUnderTesting.criticalHit(pokemon);
      const criticalHitDamage = serviceUnderTesting.criticalHitDamage(pokemon);
      expect(criticalHit).toBeGreaterThanOrEqual(1);
      expect(criticalHit).toBeLessThanOrEqual(criticalHitDamage);
    });
    it('returns results dependent on criticalHitProbability', () => {
      const constantRandomValue = 0.5;
      jest.spyOn(global.Math, 'random').mockReturnValue(constantRandomValue);

      const criticalHitProbability =
        serviceUnderTesting.criticalHitProbability();
      const criticalHit = serviceUnderTesting.criticalHit(pokemon);

      if (criticalHitProbability) {
        expect(criticalHit).toEqual(
          serviceUnderTesting.criticalHitDamage(pokemon),
        );
      } else {
        expect(criticalHit).toEqual(1);
      }

      jest.spyOn(global.Math, 'random').mockRestore();
    });
  });
  describe('stab method', () => {
    let serviceUnderTesting: BattleCalcService;
    beforeEach(() => {
      serviceUnderTesting = container.resolve(BattleCalcService);
    });

    it('returns a number', () => {
      const pokemon: IPokemon = PokemonTestMother.generateBulbasaur();
      const move: IMove = MoveTestMother.basicMove();
      expect(typeof serviceUnderTesting.stab(move, pokemon)).toBe('number');
    });
    it('multiplies by the appropriate modifier based on Pokemon type', () => {
      const pokemon: IPokemon = PokemonTestMother.generateBulbasaur();
      const move: IMove = MoveTestMother.basicMove();
      let modifier = 1;
      pokemon.basePokemon.types.forEach((type) => {
        if (type === move.type) {
          modifier = STAB_MODIFIER; // earlier defined STAB_MODIFIER constant
        }
      });

      expect(serviceUnderTesting.stab(move, pokemon)).toEqual(modifier);
    });
  });
  describe('getEffectiveness method', () => {
    // Tests the function that calculates the effectiveness of a move.
    it("returns a 'SUPER_EFFECTIVE' string for effectiveness value greater than 1", () => {
      const effectiveness = 2;
      const result = serviceUnderTesting.getEffectiveness(effectiveness);
      expect(result).toEqual('SUPER_EFFECTIVE');
    });

    it("returns a 'EFFECTIVE' string for effectiveness value equals 1", () => {
      const effectiveness = 1;
      const result = serviceUnderTesting.getEffectiveness(effectiveness);
      expect(result).toEqual('EFFECTIVE');
    });

    it("returns a 'NOT_VERRY_EFFECTIVE' string for effectiveness value less than 1", () => {
      const effectiveness = 0.5;
      const result = serviceUnderTesting.getEffectiveness(effectiveness);
      expect(result).toEqual('NOT_VERY_EFFECTIVE');
    });

    it("returns a 'IMMUNE' string for effectiveness value equals zero", () => {
      const effectiveness = 0;
      const result = serviceUnderTesting.getEffectiveness(effectiveness);
      expect(result).toEqual('IMMUNE');
    });
  });
  describe('calcEffectiveness method', () => {
    let move: IMove;
    let pokemon: IPokemon;
    beforeEach(() => {
      move = MoveTestMother.basicMove();
      pokemon = PokemonTestMother.generateBulbasaur();
    });

    it('returns a number', () => {
      expect(typeof serviceUnderTesting.calcEffectiveness(move, pokemon)).toBe(
        'number',
      );
    });

    it('returns a value greater than zero', () => {
      const effectiveness = serviceUnderTesting.calcEffectiveness(
        move,
        pokemon,
      );
      expect(effectiveness).toBeGreaterThan(0);
    });

    it('returns a value between 0 and 4', () => {
      const effectiveness = serviceUnderTesting.calcEffectiveness(
        move,
        pokemon,
      );
      expect(effectiveness).toBeLessThanOrEqual(4);
    });

    it('returns a modifier value that is a multiplier of effectiveness values', () => {
      let modifier = 1;
      pokemon.basePokemon.types.forEach((type) => {
        if (TYPE_EFFECTIVENESS[move.type][type] !== undefined) {
          modifier *= TYPE_EFFECTIVENESS[move.type][type];
        }
      });
      const effectiveness = serviceUnderTesting.calcEffectiveness(
        move,
        pokemon,
      );
      expect(effectiveness).toEqual(modifier);
    });
  });
  describe('calcDamageBase method in BattleCalcService', () => {
    it('returns a number', () => {
      const pokemon: IPokemon = PokemonTestMother.generateBulbasaur();
      const move: IMove = MoveTestMother.basicMove();
      const result = serviceUnderTesting.calcDamageBase(pokemon, pokemon, move);
      expect(typeof result).toBe('number');
    });

    it('returns a number greater than or equal to 0', () => {
      const pokemon: IPokemon = PokemonTestMother.generateBulbasaur();
      const move: IMove = MoveTestMother.basicMove();
      const result = serviceUnderTesting.calcDamageBase(pokemon, pokemon, move);
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it("return with move category 'status' or move power 0", () => {
      const pokemon: IPokemon = PokemonTestMother.generateBulbasaur();
      const move = MoveTestMother.withCustomOptions({
        category: 'status',
        power: 0,
      });
      const result = serviceUnderTesting.calcDamageBase(pokemon, pokemon, move);
      expect(result).toBe(0);
    });
  });
  describe('estimator method', () => {
    let defPokemon: IPokemon;
    let attPokemon: IPokemon;
    let move: IMove;
    beforeEach(() => {
      attPokemon = PokemonTestMother.generateBulbasaur();
      defPokemon = PokemonTestMother.generateBulbasaur();
      move = MoveTestMother.basicMove();
    });

    it('returns a number', () => {
      expect(
        typeof serviceUnderTesting.estimator(attPokemon, defPokemon, move),
      ).toBe('number');
    });

    it('returns a result for hypothetical maximum damage a move attack would do', () => {
      const result = serviceUnderTesting.estimator(
        attPokemon,
        defPokemon,
        move,
      );
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('returns zero if move is not defined', () => {
      const result = serviceUnderTesting.estimator(
        attPokemon,
        defPokemon,
        undefined,
      );
      expect(result).toBe(0);
    });

    it('correctly calculates damage estimator for every move', () => {
      attPokemon.moves.forEach((move) => {
        const result = serviceUnderTesting.estimator(
          attPokemon,
          defPokemon,
          move,
        );
        const expected =
          serviceUnderTesting.calcDamageBase(attPokemon, defPokemon, move) *
          serviceUnderTesting.calcEffectiveness(move, defPokemon) *
          serviceUnderTesting.stab(move, attPokemon) *
          (move.accuracy / 100);
        expect(result).toBe(expected);
      });
    });
  });
  describe('damageOnPokemon method', () => {
    let pokemon: IBattlePokemon;
    let damage: IDamage;
    beforeEach(() => {
      pokemon = BattlePokemonTestMother.getBattlePokemon();
      damage = {
        damage: 10,
        critical: false,
        effectiveness: 'EFFECTIVE',
        missed: false,
        attPokemon: pokemon,
        defPokemon: pokemon,
        move: MoveTestMother.basicMove(),
      };
    });

    it('returns a number', () => {
      expect(typeof serviceUnderTesting.damageOnPokemon(pokemon, damage)).toBe(
        'number',
      );
    });

    it('returns the remaining Hp of the pokemon after hit', () => {
      const result = serviceUnderTesting.damageOnPokemon(pokemon, damage);
      expect(result).toBe(pokemon.currentHp - damage.damage);
    });

    it("returns zero if the pokemon's Hp is less than damage amount", () => {
      const highDamage: IDamage = { ...damage, damage: pokemon.currentHp + 10 };
      const result = serviceUnderTesting.damageOnPokemon(pokemon, highDamage);
      expect(result).toBe(0);
    });

    it("returns the current Hp if there's no damage (damage is undefined)", () => {
      const result = serviceUnderTesting.damageOnPokemon(pokemon, undefined);
      expect(result).toBe(pokemon.currentHp);
    });
  });
  describe('calcDamage method', () => {
    let attPokemon: IBattlePokemon, defPokemon: IBattlePokemon, move: IMove;

    beforeEach(() => {
      attPokemon = BattlePokemonTestMother.getBattlePokemon();
      defPokemon = BattlePokemonTestMother.getBattlePokemon();
      move = MoveTestMother.basicMove();
    });

    // Test: calcDamage method should return a type IDamage
    it('should return IDamage type', () => {
      const result = serviceUnderTesting.calcDamage(
        attPokemon,
        defPokemon,
        move,
      );
      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('damage');
      expect(result).toHaveProperty('effectiveness');
      expect(result).toHaveProperty('critical');
      expect(result).toHaveProperty('missed');
      expect(result).toHaveProperty('attPokemon');
      expect(result).toHaveProperty('defPokemon');
      expect(result).toHaveProperty('move');
    });

    it('should return undefined when the attacking pokemon HP is zero', () => {
      attPokemon.currentHp = 0;
      const result = serviceUnderTesting.calcDamage(
        attPokemon,
        defPokemon,
        move,
      );
      expect(result).toBe(undefined);
    });

    it('should return undefined when the move is undefined', () => {
      const result = serviceUnderTesting.calcDamage(
        attPokemon,
        defPokemon,
        undefined,
      );
      expect(result).toBe(undefined);
    });

    it('should return damage as zero if the move misses', () => {
      jest.spyOn(serviceUnderTesting, 'isMissed').mockReturnValue(true);
      const result = serviceUnderTesting.calcDamage(
        attPokemon,
        defPokemon,
        move,
      );
      expect(result.damage).toBe(0);
    });
  });
});
