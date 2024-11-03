import { Test, TestingModule } from '@nestjs/testing';
import PokemonUtilsService from './PokemonUtilsService';
import { PokemonTestMother } from '../../test/domain/pokemon/PokemonTestMother';
import { StatsTestMother } from '../../test/domain/Stats/StatsTestMother';
import { normalRandom } from 'shared/utils/RandomUtils';
import { POKEMON_NATURES } from '../../domain/pokemon/pokemonConst';
import { IPokemon, IPokemonStats } from 'shared/models';

jest.mock('shared/utils/RandomUtils');

describe('PokemonUtilsService', () => {
  let service: PokemonUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonUtilsService],
    }).compile();

    service = module.get<PokemonUtilsService>(PokemonUtilsService);
    jest.clearAllMocks();
  });

  describe('generatePotential method', () => {
    it('should generate a potential correctly for nursery level 0', () => {
      jest.mocked(normalRandom).mockReturnValueOnce(0);
      const result = service.generatePotential(0);
      expect(result).toBe(20);
    });

    it('should not exceed 100 when the generated potential is more than 100', () => {
      jest.mocked(normalRandom).mockReturnValueOnce(1000);
      const result = service.generatePotential(8);
      expect(result).toBe(100);
    });
  });

  describe('generateIvs', () => {
    it('should correctly generate a pokemonStats object with random values', () => {
      const pokemonStats: IPokemonStats = service.generateIvs();

      const statsNames: (keyof IPokemonStats)[] = [
        'hp',
        'atk',
        'def',
        'spAtk',
        'spDef',
        'spe',
      ];

      statsNames.forEach((stat) => {
        expect(pokemonStats[stat]).toBeGreaterThanOrEqual(0);
        expect(pokemonStats[stat]).toBeLessThanOrEqual(31);
      });
    });
  });

  describe('generateHiddenPotential method', () => {
    it('returns potential range in string format', () => {
      const potential = 50;
      const pattern = /^\d{1,3}\s*-\s*\d{1,3}$/;
      expect(service.generateHiddenPotential(potential)).toMatch(pattern);
    });

    describe.each([0, 10, 50, 100])(
      'potential is between 0 and 100',
      (potential) => {
        it(`test for potential: ${potential}`, () => {
          const result = service.generateHiddenPotential(potential);
          const [pMin, pMax] = result.split('-').map(Number);
          expect(pMin).toBeGreaterThanOrEqual(0);
          expect(pMax).toBeLessThanOrEqual(100);
          expect(pMin).toBeLessThanOrEqual(pMax);
        });
      },
    );
  });

  describe('updateStats', () => {
    let mockPokemon: IPokemon;

    beforeEach(() => {
      mockPokemon = PokemonTestMother.withCustomOptions({
        stats: StatsTestMother.getAll0(),
      });
    });

    it('should correctly update Pokemon stats when level is not 0', () => {
      const {
        basePokemon: { baseStats },
        iv,
        ev,
        nature,
      } = mockPokemon;

      const stats = service.updateStats(mockPokemon);

      expect(stats).toEqual({
        hp: service.calcHp(baseStats.hp, mockPokemon.level, iv.hp, ev.hp),
        atk: service.calcStat(
          baseStats.atk,
          mockPokemon.level,
          iv.atk,
          ev.atk,
          POKEMON_NATURES[nature].atk,
        ),
        def: service.calcStat(
          baseStats.def,
          mockPokemon.level,
          iv.def,
          ev.def,
          POKEMON_NATURES[nature].def,
        ),
        spAtk: service.calcStat(
          baseStats.spAtk,
          mockPokemon.level,
          iv.spAtk,
          ev.spAtk,
          POKEMON_NATURES[nature].spAtk,
        ),
        spDef: service.calcStat(
          baseStats.spDef,
          mockPokemon.level,
          iv.spDef,
          ev.spDef,
          POKEMON_NATURES[nature].spDef,
        ),
        spe: service.calcStat(
          baseStats.spe,
          mockPokemon.level,
          iv.spe,
          ev.spe,
          POKEMON_NATURES[nature].spe,
        ),
      });
    });

    it('should return stats as 0 if level is 0', () => {
      mockPokemon.level = 0;

      const allStats0 = service.updateStats(mockPokemon);

      expect(allStats0).toEqual({
        hp: 0,
        atk: 0,
        def: 0,
        spAtk: 0,
        spDef: 0,
        spe: 0,
      });
    });
  });

  describe('generateShiny method', () => {
    it('should return a boolean value', () => {
      const shiny = service.generateShiny();
      expect(typeof shiny).toBe('boolean');
    });

    it('should return true approximately 1/4096 of the time', () => {
      let shinyCounter = 0;
      const trials = 100_000;
      for (let i = 0; i < trials; i++) {
        if (service.generateShiny()) {
          shinyCounter += 1;
        }
      }
      const shinyRate = shinyCounter / trials;
      expect(shinyRate).toBeCloseTo(1 / 4096, 2);
    });
  });
});
